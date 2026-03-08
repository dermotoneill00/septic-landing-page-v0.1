import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Supabase Database Webhook payload shape:
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
    // Not a valid auth user record — return 200 so webhook doesn't retry
    return new Response(JSON.stringify({ skipped: "missing id or email" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Look up the submitted lead for this email
  const { data: lead, error: leadError } = await supabaseAdmin
    .from("leads")
    .select("first_name, last_name, phone")
    .eq("email", email)
    .eq("status", "submitted")
    .maybeSingle();

  if (leadError) {
    console.error("Lead lookup error:", leadError.message);
    // Still return 200 — don't cause webhook retries for DB errors
    return new Response(JSON.stringify({ skipped: "lead lookup failed" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!lead) {
    // No submitted lead = admin user or test account. Nothing to provision.
    return new Response(JSON.stringify({ skipped: "no submitted lead found" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Upsert the profiles row (safe to re-run if webhook fires twice)
  const { error: upsertError } = await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        auth_user_id: authUserId,
        email,
        first_name: lead.first_name ?? null,
        last_name: lead.last_name ?? null,
        phone: lead.phone ?? null,
        portal_enabled: true,
        must_reset_password: false,
      },
      { onConflict: "email" },
    );

  if (upsertError) {
    console.error("Profile upsert error:", upsertError.message);
    return new Response(JSON.stringify({ error: upsertError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log(`Provisioned portal access for ${email}`);

  return new Response(JSON.stringify({ success: true, email }), {
    headers: { "Content-Type": "application/json" },
  });
});
