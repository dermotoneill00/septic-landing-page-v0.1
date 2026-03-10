/**
 * Vercel Edge Function — /api/geo
 *
 * Vercel automatically injects geo headers on every request:
 *   x-vercel-ip-country         → ISO 3166-1 alpha-2 country code  (e.g. "US")
 *   x-vercel-ip-country-region  → ISO 3166-2 region/state code     (e.g. "CT")
 *   x-vercel-ip-city            → city name                        (e.g. "Stamford")
 *
 * No external API, no rate limits, no cost.
 * Returns { stateCode, country, city } — stateCode is null for non-US visitors.
 *
 * In local dev the headers are absent, so all values return null gracefully.
 */

export const config = { runtime: "edge" };

export default function handler(req: Request) {
  const country   = req.headers.get("x-vercel-ip-country") ?? null;
  const region    = req.headers.get("x-vercel-ip-country-region") ?? null;
  const city      = req.headers.get("x-vercel-ip-city") ?? null;

  return Response.json(
    {
      stateCode: country === "US" ? region : null,
      country,
      city,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Never cache — geo must be fresh per visitor
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
