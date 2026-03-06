# ProGuard Septic — Landing Page + Customer Portal

This repo contains the ProGuard septic protection landing page and a self-service customer portal for active policyholders.

- **Marketing site**: Vite + React + TypeScript + Tailwind + shadcn/ui
- **Customer portal**: `/portal/login` and `/portal/dashboard`, same SPA
- **Backend**: Supabase (Auth + PostgreSQL with RLS)
- **Hosting**: Vercel

---

## Local development

### Prerequisites

- Node.js 18+
- A Supabase project (free tier is sufficient for development)

### 1. Clone and install

```bash
git clone https://github.com/dermotoneill00/septic-landing-page-v0.1.git
cd septic-landing-page-v0.1
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard > Settings > API > Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings > API > anon public |
| `SUPABASE_URL` | Same as above (used by import script, not Vite) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard > Settings > API > service_role (keep secret) |

### 3. Apply SQL migrations

In the Supabase SQL Editor, run these two files in order:

1. `supabase/migrations/001_schema.sql` — creates tables and indexes
2. `supabase/migrations/002_rls.sql` — enables Row Level Security

### 4. Start the dev server

```bash
npm run dev
# http://localhost:8080
```

---

## Deploy on Vercel

1. Import this GitHub repo into Vercel
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel > Settings > Environment Variables
3. Do **not** add `SUPABASE_SERVICE_ROLE_KEY` to Vercel — it is only used locally by the import script
4. Build settings (Vercel detects these automatically from `package.json`):
   - Build command: `npm run build`
   - Output directory: `dist`
5. The `vercel.json` SPA rewrite is already in place

---

## Connect Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Authentication > Providers and ensure **Email** is enabled
3. For development, you may disable "Confirm email" under Authentication > Settings (re-enable before production)
4. Run both migration files in the SQL Editor

---

## Customer portal

### Routes

| Route | Access |
|---|---|
| `/portal/login` | Public |
| `/portal/dashboard` | Authenticated only (ProtectedRoute) |
| `/portal/change-password` | Authenticated only (ProtectedRoute) |

### How portal eligibility is enforced

A customer can log in and see data only if:

1. They have an auth user in Supabase Auth (created by the import script)
2. Their `profiles` row has `portal_enabled = true`
3. Their `policies` rows pass the RLS policy (which checks `portal_enabled = true`)

The import script only creates auth users for customers with at least one `Active` policy. Ineligible customers never receive credentials. Even if someone obtains credentials somehow, the database returns no policy rows unless `portal_enabled = true`.

### First-login password reset

All imported users have `must_reset_password = true`. The dashboard detects this and immediately redirects to `/portal/change-password`. After setting a new password, the flag is cleared and the dashboard is accessible.

---

## CSV import

### Required environment variables

The import script uses the **service role key** to bypass RLS. Run it locally only.

`.env.local` must have `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

### Place your CSV

```
imports/
  input/
    customers.csv    <-- place your file here (directory is gitignored)
  output/            <-- script writes here (gitignored)
```

### Run the import

```bash
# Dry run — shows row counts and eligibility, writes nothing
npm run import:csv -- --file imports/input/customers.csv --dry-run

# Live run
npm run import:csv -- --file imports/input/customers.csv
```

### What the script does

1. Reads all rows from the CSV
2. Determines the customer email: uses `Policy Holder Email` first, falls back to `Email`
3. Normalizes emails (trim + lowercase) and groups rows per customer
4. Checks each customer group for at least one `Status = Active` row
5. **Eligible customers** (has active policy): creates Supabase auth user + profile + all policy rows
6. **Ineligible customers** (no active policy): skipped entirely — no auth user, no profile
7. Rows with no usable email are flagged for manual review
8. Writes temp passwords to `imports/output/temp-passwords-export.csv`
9. Writes flagged rows to `imports/output/flagged-rows.csv`
10. Inserts flagged rows into the `import_review_flags` Supabase table

The script is idempotent. Re-running it against the same CSV upserts rather than duplicating.

### Expected CSV columns

```
Record Id, Email, Policy Holder Email, First, Last,
Policy Number, Status, Product Type, Product,
Street, City, State, Zip, Home Phone, Cell,
Start Date, Expiration Date, Coverage Effective Date,
County, Plan Term
```

Extra columns are stored in `raw_import_json` for audit purposes.

### Output files

| File | Contents |
|---|---|
| `imports/output/temp-passwords-export.csv` | Email + temp password for each new user |
| `imports/output/flagged-rows.csv` | Rows that could not be auto-processed |

Both are gitignored. Store `temp-passwords-export.csv` securely and delete it after distributing credentials.

### Flagged row types

| `issue_type` | Meaning |
|---|---|
| `missing_email` | Row has no `Policy Holder Email` or `Email` |
| `missing_policy_number` | Row for an eligible customer has a blank policy number |

---

## How to test portal login

1. After running the import, open `imports/output/temp-passwords-export.csv`
2. Copy an email + temp password
3. Go to `/portal/login` and sign in
4. You will be redirected to `/portal/change-password` (first login)
5. Set a new password — you are then redirected to `/portal/dashboard`

To verify ineligible customers cannot access the portal, attempt to sign in with an email that is not in the temp passwords output. The sign-in will fail at the Supabase Auth level.

---

## Security summary

- All secrets live in `.env.local` (gitignored)
- `SUPABASE_SERVICE_ROLE_KEY` never leaves the local machine
- RLS is enabled on `profiles`, `policies`, and `import_review_flags`
- Authenticated users can only read their own profile and policies
- `import_review_flags` has no authenticated-user policies — service role only
- `portal_enabled = false` blocks all policy data access at the database layer
