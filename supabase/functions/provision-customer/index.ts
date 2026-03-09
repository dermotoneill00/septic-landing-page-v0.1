import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Supabase Database Webhook payload:
  // { type: "INSERT", table: "users", schema: "auth", record: { id, email, ... } }
  let payload: { type: string; record: { id: string; email: string } };

  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id: authUserId, email } = payload.record ?? {};

  if (!authUserId || !email) {
    return new Response(JSON.stringify({ skipped: "missing id or email" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── Path A: CSV-imported customer ──────────────────────────────────────────
  // A profiles row already exists (from the CSV import) but auth_user_id is
  // null because they've never logged in before. Just link their new auth
  // account to the existing profile — don't overwrite anything else.
  const { data: existingProfile, error: profileLookupError } = await supabaseAdmin
    .from("profiles")
    .select("id, auth_user_id")
    .eq("email", email)
    .maybeSingle();

  if (profileLookupError) {
    console.error("Profile lookup error:", profileLookupError.message);
    // Return 200 so Supabase doesn't retry the webhook indefinitely
    return new Response(JSON.stringify({ skipped: "profile lookup failed" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (existingProfile) {
    if (existingProfile.auth_user_id) {
      // Already linked — webhook fired twice or user re-invited. Nothing to do.
      console.log(`Profile already linked for ${email}`);
      return new Response(JSON.stringify({ skipped: "already linked", email }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Link auth account to existing imported profile
    const { error: linkError } = await supabaseAdmin
      .from("profiles")
      .update({
        auth_user_id: authUserId,
        portal_enabled: true,
        must_reset_password: false,
      })
      .eq("id", existingProfile.id);

    if (linkError) {
      console.error("Profile link error:", linkError.message);
      return new Response(JSON.stringify({ error: linkError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`Linked auth account to existing profile for ${email}`);
    return new Response(
      JSON.stringify({ success: true, path: "linked-existing", email }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  // ── Path B: New web enrollment ─────────────────────────────────────────────
  // No existing profile. Pull their details from the leads table and create
  // a fresh profiles row.
  const { data: lead, error: leadError } = await supabaseAdmin
    .from("leads")
    .select("first_name, last_name, phone, referral_code")
    .eq("email", email)
    .eq("status", "submitted")
    .maybeSingle();

  if (leadError) {
    console.error("Lead lookup error:", leadError.message);
    return new Response(JSON.stringify({ skipped: "lead lookup failed" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!lead) {
    // No profile and no submitted lead = admin or test account. Skip silently.
    console.log(`No profile or lead found for ${email}`);
    return new Response(JSON.stringify({ skipped: "no profile or lead found" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: newProfile, error: insertError } = await supabaseAdmin
    .from("profiles")
    .insert({
      auth_user_id: authUserId,
      email,
      first_name: lead.first_name ?? null,
      last_name: lead.last_name ?? null,
      phone: lead.phone ?? null,
      portal_enabled: true,
      must_reset_password: false,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Profile insert error:", insertError.message);
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── Referral tracking ───────────────────────────────────────────────────
  // If the lead was referred (has a referral_code from ?ref= param), create
  // a referral record linking the referrer to this new customer.
  if (lead.referral_code && newProfile) {
    const { data: referrer } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("referral_code", lead.referral_code)
      .maybeSingle();

    if (referrer) {
      const { error: refError } = await supabaseAdmin
        .from("referrals")
        .insert({
          referrer_profile_id: referrer.id,
          referee_email: email,
          referee_profile_id: newProfile.id,
          referral_code: lead.referral_code,
          status: "enrolled",
          reward_amount: 20.0,
          enrolled_at: new Date().toISOString(),
        });
      if (refError) {
        // Log but don't fail the provisioning — referral is non-critical
        console.error("Referral insert error:", refError.message);
      } else {
        console.log(`Referral recorded: ${lead.referral_code} → ${email}`);
      }
    } else {
      console.log(`Referral code ${lead.referral_code} not found — skipping`);
    }
  }

  console.log(`Created new profile for ${email}`);
  return new Response(
    JSON.stringify({ success: true, path: "created-new", email }),
    { headers: { "Content-Type": "application/json" } },
  );
});
