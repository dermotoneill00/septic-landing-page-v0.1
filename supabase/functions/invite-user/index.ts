import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Security: only invite if a submitted lead exists for this email
  const { data: lead, error: leadError } = await supabaseAdmin
    .from("leads")
    .select("id")
    .eq("email", email)
    .eq("status", "submitted")
    .maybeSingle();

  if (leadError || !lead) {
    return new Response(
      JSON.stringify({ error: "No active enrollment found for this email" }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

  const siteUrl = Deno.env.get("SITE_URL") ?? "https://proguardplans.com";

  const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/portal/dashboard`,
  });

  if (error) {
    // "User already registered" is fine — they already have portal access
    if (!error.message.includes("already")) {
      console.error("Invite error:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
