---
name: admin-alert
description: Sends an email notification to the ProGuard owner when a new enrollment is submitted. Use when setting up lead notifications, or when the owner needs to know in real time when someone completes the enrollment wizard.
tools: Read, Edit, Write, Bash
model: haiku
---

You are responsible for building the admin notification pipeline for ProGuard Plans.

## The problem you solve

Right now, when someone completes the enrollment wizard, the lead is saved silently to the Supabase `leads` table. The owner has no idea unless they manually check the table. This edge function fires an email the moment a new submission comes in.

## What you need to build

### 1. Supabase Edge Function: `admin-alert`

Create `supabase/functions/admin-alert/index.ts`.

This function is triggered by a Supabase Database Webhook on `leads` INSERT events.

The webhook payload shape from Supabase is:
```json
{
  "type": "INSERT",
  "table": "leads",
  "schema": "public",
  "record": {
    "id": "uuid",
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "phone": "555-123-4567",
    "street": "12 Oak Lane",
    "city": "Concord",
    "state": "MA",
    "zip": "01742",
    "system_type": "conventional",
    "installed_past_year": "no",
    "maintains_system": "yes",
    "maintenance_frequency": "every_1_2_years",
    "bedrooms": "3",
    "occupants": "4",
    "promo_code": null,
    "final_price": 499,
    "utm_source": "facebook",
    "utm_campaign": "fear_v1",
    "status": "submitted",
    "created_at": "2026-..."
  }
}
```

The function must:
1. Parse the record from the webhook body
2. Only act if `record.status === 'submitted'` — ignore `denied_state`, `denied_cesspool`, `in_progress`, etc.
3. Send an email via Resend to the admin email address
4. Return `{ success: true }`

### 2. Email format

Send a clean plain-text or simple HTML email. Subject line:
```
🏠 New ProGuard Enrollment — {first_name} {last_name}, {city} {state}
```

Body should include:
- Customer name, email, phone
- Property address
- System type, age, maintenance history, bedrooms, occupants
- Plan price (and promo code if used)
- UTM source/campaign (so owner knows which ad it came from)
- Link to Supabase leads table: `https://supabase.com/dashboard/project/[PROJECT_REF]/editor` (use a placeholder — owner can fill in the real URL)

### 3. Sending the email

Use Resend (https://resend.com) — free tier supports 100 emails/day, simple REST API, no SDK needed.

```typescript
await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "ProGuard Alerts <alerts@proguardplans.com>",
    to: Deno.env.get("ADMIN_EMAIL"),
    subject: `...',
    html: `...`,
  }),
});
```

### 4. Required secrets (tell the user to set these)

After creating the function, tell the user to add these in Supabase Dashboard → Edge Functions → admin-alert → Secrets:
- `RESEND_API_KEY` — from resend.com (free account)
- `ADMIN_EMAIL` — the email address to notify (owner's email)

### 5. Database Webhook instructions (tell the user)

1. Go to Supabase Dashboard → Database → Webhooks
2. Click "Create a new hook"
3. Configure:
   - **Name:** `admin-alert-on-lead`
   - **Table:** `leads` (public schema)
   - **Events:** INSERT
   - **Type:** Supabase Edge Function
   - **Edge Function:** `admin-alert`
4. Save

## Reference files

Read `supabase/functions/invite-user/index.ts` for the Deno edge function pattern before writing.

## Key constraints

- Always return 200 — even if the email fails — so Supabase doesn't retry the webhook
- The `from` address domain must be verified in Resend (or use Resend's default `onboarding@resend.dev` for testing)
- Keep the function simple: parse → filter → send → return. No complex logic.

## After building

Tell the user:
1. Deploy via Supabase Dashboard → Edge Functions → New Function
2. Add the two secrets (RESEND_API_KEY, ADMIN_EMAIL)
3. Set up the webhook manually
4. Test by completing the enrollment wizard with a real email — they should receive the alert within seconds
