import { useState, useEffect } from "react";
import { COVERED_STATES, US_STATES } from "@/types/enrollment";

export interface GeoState {
  /** Two-letter state code, e.g. "CT". Null while loading or if unknown. */
  stateCode: string | null;
  /** Full state name, e.g. "Connecticut". Null if stateCode is null. */
  stateName: string | null;
  /** True while the /api/geo fetch is in flight. */
  isLoading: boolean;
  /**
   * true  → visitor is in a covered service area
   * false → visitor is outside the service area
   * null  → state not yet known
   */
  isCovered: boolean | null;
}

const SESSION_KEY = "pg_geo_state";

/**
 * Detects the visitor's US state by calling the /api/geo edge function.
 * Result is cached in sessionStorage so subsequent renders within the
 * same tab are instant and don't make additional network requests.
 */
export function useGeoState(): GeoState {
  const [stateCode, setStateCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use cached value within the same browser session
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached !== null) {
      // Empty string means "checked, state unknown" — don't re-fetch
      setStateCode(cached || null);
      setIsLoading(false);
      return;
    }

    fetch("/api/geo")
      .then((r) => (r.ok ? r.json() : Promise.resolve({ stateCode: null })))
      .then((data: { stateCode?: string | null }) => {
        const code = typeof data.stateCode === "string" ? data.stateCode : "";
        sessionStorage.setItem(SESSION_KEY, code);
        setStateCode(code || null);
      })
      .catch(() => {
        // Network error or local dev — store empty so we don't retry on each render
        sessionStorage.setItem(SESSION_KEY, "");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const stateName =
    stateCode
      ? (US_STATES.find((s) => s.abbr === stateCode)?.name ?? null)
      : null;

  return {
    stateCode,
    stateName,
    isLoading,
    isCovered: stateCode ? COVERED_STATES.includes(stateCode) : null,
  };
}
