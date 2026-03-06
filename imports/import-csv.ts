/**
 * ProGuard CSV Import Script
 *
 * Usage:
 *   npx tsx imports/import-csv.ts --file path/to/customers.csv [--dry-run]
 *
 * Prerequisites:
 *   - Copy .env.example to .env.local and fill in SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *   - Run SQL migrations 001 and 002 against your Supabase project first
 *
 * Outputs:
 *   - imports/output/temp-passwords-export.csv  (gitignored — store securely)
 *   - imports/output/flagged-rows.csv           (rows needing manual review)
 *   - Console summary of results
 */

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

// ── Environment ──────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const fileArgIdx = args.indexOf("--file");
const isDryRun = args.includes("--dry-run");

if (fileArgIdx === -1 || !args[fileArgIdx + 1]) {
  console.error("Usage: npx tsx imports/import-csv.ts --file <path-to-csv> [--dry-run]");
  process.exit(1);
}

const csvPath = path.resolve(args[fileArgIdx + 1]);
if (!fs.existsSync(csvPath)) {
  console.error(`ERROR: File not found: ${csvPath}`);
  process.exit(1);
}

// ── Types ────────────────────────────────────────────────────────────────────

interface CsvRow {
  [key: string]: string;
}

interface CustomerGroup {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  rows: CsvRow[];
  hasActivePolicy: boolean;
}

interface FlaggedRow {
  sourceRowIdentifier: string;
  issueType: string;
  notes: string;
  rawRow: CsvRow;
}

interface ImportResult {
  created: number;
  skipped: number;
  flagged: number;
  errors: string[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalizeEmail(raw: string | undefined): string {
  return (raw ?? "").trim().toLowerCase();
}

function generateTempPassword(): string {
  const bytes = crypto.randomBytes(12);
  const base = bytes.toString("base64url").slice(0, 14);
  // Inject uppercase and digit to meet common password policies
  return `Pg${base}1`;
}

function parseDate(raw: string | undefined): string | null {
  if (!raw || raw.trim() === "") return null;
  const d = new Date(raw.trim());
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0];
}

function buildFullAddress(row: CsvRow): string {
  return [row["Street"], row["City"], row["State"], row["Zip"]]
    .filter(Boolean)
    .join(", ");
}

function determinePolicySortDate(row: CsvRow): string | null {
  return (
    parseDate(row["Coverage Effective Date"]) ||
    parseDate(row["Start Date"]) ||
    parseDate(row["Expiration Date"]) ||
    null
  );
}

function pickEmail(row: CsvRow): { email: string | null; flagReason: string | null } {
  const policyHolderEmail = normalizeEmail(row["Policy Holder Email"]);
  const genericEmail = normalizeEmail(row["Email"]);

  if (policyHolderEmail) return { email: policyHolderEmail, flagReason: null };
  if (genericEmail) return { email: genericEmail, flagReason: null };
  return { email: null, flagReason: "No email address found in row" };
}

function ensureOutputDir() {
  const dir = path.resolve("imports/output");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeCsv(filePath: string, rows: Record<string, string>[]): void {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => `"${(r[h] ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ];
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
}

// ── Step 1: Read + parse CSV ──────────────────────────────────────────────────

console.log(`\nProGuard CSV Import${isDryRun ? " [DRY RUN]" : ""}`);
console.log(`Source: ${csvPath}\n`);

const rawContent = fs.readFileSync(csvPath, "utf8");
const rows: CsvRow[] = parse(rawContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

console.log(`Parsed ${rows.length} rows from CSV.`);

// ── Step 2: Group rows by customer email, collect flags ───────────────────────

const customerMap = new Map<string, CsvRow[]>();
const flaggedRows: FlaggedRow[] = [];

for (const row of rows) {
  const rowId = row["Record Id"] || row["Policy Number"] || JSON.stringify(row).slice(0, 60);
  const { email, flagReason } = pickEmail(row);

  if (!email) {
    flaggedRows.push({
      sourceRowIdentifier: rowId,
      issueType: "missing_email",
      notes: flagReason ?? "No usable email found",
      rawRow: row,
    });
    continue;
  }

  if (!customerMap.has(email)) {
    customerMap.set(email, []);
  }
  customerMap.get(email)!.push(row);
}

// ── Step 3: Build customer groups and determine eligibility ───────────────────

const groups: CustomerGroup[] = [];

for (const [email, emailRows] of customerMap.entries()) {
  const hasActivePolicy = emailRows.some(
    (r) => (r["Status"] ?? "").trim().toLowerCase() === "active"
  );

  const firstRow = emailRows[0];
  const group: CustomerGroup = {
    email,
    firstName: (firstRow["First"] ?? "").trim(),
    lastName: (firstRow["Last"] ?? "").trim(),
    phone: (firstRow["Home Phone"] || firstRow["Cell"] || "").trim(),
    rows: emailRows,
    hasActivePolicy,
  };

  groups.push(group);
}

const eligible = groups.filter((g) => g.hasActivePolicy);
const ineligible = groups.filter((g) => !g.hasActivePolicy);

console.log(`Customer groups: ${groups.length} total`);
console.log(`  Eligible (has active policy): ${eligible.length}`);
console.log(`  Ineligible (no active policy): ${ineligible.length}`);
console.log(`  Flagged rows: ${flaggedRows.length}`);

if (isDryRun) {
  console.log("\n[DRY RUN] No changes written. Remove --dry-run to execute.");
  process.exit(0);
}

// ── Step 4: Load all existing auth users once (paginated) ────────────────────

const authUserMap = new Map<string, string>(); // email → auth user id
let page = 1;
while (true) {
  const { data: pageData } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
  if (!pageData?.users?.length) break;
  for (const u of pageData.users) {
    if (u.email) authUserMap.set(normalizeEmail(u.email), u.id);
  }
  if (pageData.users.length < 1000) break;
  page++;
}
console.log(`Loaded ${authUserMap.size} existing auth users.\n`);

// ── Step 5: Create auth users, profiles, and policy rows ─────────────────────

const result: ImportResult = { created: 0, skipped: 0, flagged: flaggedRows.length, errors: [] };
const tempPasswords: { email: string; temp_password: string; first_name: string; last_name: string }[] = [];

for (const group of eligible) {
  const tempPassword = generateTempPassword();
  const existingAuthUserId = authUserMap.get(group.email);

  let authUserId: string;

  if (existingAuthUserId) {
    authUserId = existingAuthUserId;
    console.log(`  [SKIP] Auth user already exists: ${group.email}`);
    result.skipped++;
  } else {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: group.email,
      password: tempPassword,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      const msg = `Failed to create auth user for ${group.email}: ${authError?.message ?? "unknown"}`;
      console.error(`  [ERROR] ${msg}`);
      result.errors.push(msg);
      continue;
    }

    authUserId = authData.user.id;
    authUserMap.set(group.email, authUserId);
    tempPasswords.push({
      email: group.email,
      temp_password: tempPassword,
      first_name: group.firstName,
      last_name: group.lastName,
    });

    console.log(`  [CREATE] Auth user: ${group.email}`);
  }

  // Upsert profile
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        auth_user_id: authUserId,
        email: group.email,
        first_name: group.firstName || null,
        last_name: group.lastName || null,
        phone: group.phone || null,
        portal_enabled: true,
        must_reset_password: true,
      },
      { onConflict: "email" }
    )
    .select("id")
    .single();

  if (profileError || !profileData) {
    const msg = `Failed to upsert profile for ${group.email}: ${profileError?.message ?? "unknown"}`;
    console.error(`  [ERROR] ${msg}`);
    result.errors.push(msg);
    continue;
  }

  const profileId = profileData.id;

  // Insert policy rows for this customer
  for (const row of group.rows) {
    const policyNumber = (row["Policy Number"] ?? "").trim();
    if (!policyNumber) {
      flaggedRows.push({
        sourceRowIdentifier: row["Record Id"] || "unknown",
        issueType: "missing_policy_number",
        notes: `Customer ${group.email} has a row with no policy number`,
        rawRow: row,
      });
      continue;
    }

    const street = (row["Street"] ?? "").trim();
    const city = (row["City"] ?? "").trim();
    const state = (row["State"] ?? "").trim();
    const zip = (row["Zip"] ?? "").trim();

    const { error: policyError } = await supabase.from("policies").upsert(
      {
        profile_id: profileId,
        source_record_id: row["Record Id"] || null,
        policy_number: policyNumber,
        status: (row["Status"] ?? "").trim(),
        product_type: (row["Product Type"] ?? "").trim() || null,
        product: (row["Product"] ?? "").trim() || null,
        start_date: parseDate(row["Start Date"]),
        expiration_date: parseDate(row["Expiration Date"]),
        coverage_effective_date: parseDate(row["Coverage Effective Date"]),
        policy_sort_date: determinePolicySortDate(row),
        street: street || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        full_address: buildFullAddress(row) || null,
        home_phone: (row["Home Phone"] ?? "").trim() || null,
        cell: (row["Cell"] ?? "").trim() || null,
        raw_import_json: row as unknown as Record<string, unknown>,
      },
      { onConflict: "policy_number" }
    );

    if (policyError) {
      const msg = `Failed to upsert policy ${policyNumber} for ${group.email}: ${policyError.message}`;
      console.error(`    [ERROR] ${msg}`);
      result.errors.push(msg);
    }
  }

  result.created++;
}

// ── Step 6: Write import_review_flags to Supabase + output CSV ─────────────────

if (flaggedRows.length > 0) {
  const flagInserts = flaggedRows.map((f) => ({
    source_row_identifier: f.sourceRowIdentifier,
    issue_type: f.issueType,
    notes: f.notes,
    raw_row_json: f.rawRow as unknown as Record<string, unknown>,
  }));

  const { error: flagError } = await supabase
    .from("import_review_flags")
    .insert(flagInserts);

  if (flagError) {
    console.error(`  [WARN] Could not write flags to database: ${flagError.message}`);
  }
}

// ── Step 7: Write output files ────────────────────────────────────────────────

ensureOutputDir();

const passwordsPath = path.resolve("imports/output/temp-passwords-export.csv");
writeCsv(
  passwordsPath,
  tempPasswords.map((t) => ({
    email: t.email,
    first_name: t.first_name,
    last_name: t.last_name,
    temp_password: t.temp_password,
  }))
);

const flaggedPath = path.resolve("imports/output/flagged-rows.csv");
writeCsv(
  flaggedPath,
  flaggedRows.map((f) => ({
    source_row_identifier: f.sourceRowIdentifier,
    issue_type: f.issueType,
    notes: f.notes,
    raw_row_preview: JSON.stringify(f.rawRow).slice(0, 200),
  }))
);

// ── Summary ───────────────────────────────────────────────────────────────────

console.log("\n── Import complete ──────────────────────────────────────────────");
console.log(`  Customers created / updated: ${result.created}`);
console.log(`  Customers skipped (already existed): ${result.skipped}`);
console.log(`  Rows flagged for review: ${result.flagged}`);
if (result.errors.length > 0) {
  console.log(`  Errors encountered: ${result.errors.length}`);
  result.errors.forEach((e) => console.log(`    - ${e}`));
}

console.log(`\nOutput files:`);
if (tempPasswords.length > 0) {
  console.log(`  Temp passwords: ${passwordsPath}`);
  console.log("  WARNING: This file contains credentials. Store it securely and delete after use.");
}
if (flaggedRows.length > 0) {
  console.log(`  Flagged rows:   ${flaggedPath}`);
}
console.log();
