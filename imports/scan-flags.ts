import fs from 'fs';
import { parse } from 'csv-parse/sync';

const raw = fs.readFileSync('./imports/Policies_2026_03_06.csv', 'utf8');
const rows: any[] = parse(raw, { columns: true, skip_empty_lines: true, trim: true });

const flagged = rows.filter(r => {
  const phe = (r['Policy Holder Email'] || '').trim().toLowerCase();
  const em = (r['Email'] || '').trim().toLowerCase();
  return !phe && !em;
});

console.log('Total flagged (no email):', flagged.length);
console.log('\nAll flagged rows:');
flagged.forEach((r: any) => {
  console.log(` - ${r['Policy Number'] || '(no policy#)'} | ${r['Policy Holder'] || '(no name)'} | Status: ${r['Status']}`);
});

const statuses: Record<string, number> = {};
flagged.forEach((r: any) => { const s = r['Status'] || 'blank'; statuses[s] = (statuses[s] || 0) + 1; });
console.log('\nStatus breakdown:', statuses);
