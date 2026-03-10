import { createContext, useContext, type ReactNode } from "react";
import { useGeoState, type GeoState } from "@/hooks/useGeoState";

const GeoContext = createContext<GeoState>({
  stateCode: null,
  stateName: null,
  isLoading: false,
  isCovered: null,
});

/**
 * Wrap the app (inside BrowserRouter) with GeoProvider once.
 * Any component can then call `useGeo()` to read the visitor's state.
 *
 * Usage example:
 *   const { stateName, isCovered } = useGeo();
 *   // stateName → "Connecticut" | null
 *   // isCovered → true | false | null
 */
export const GeoProvider = ({ children }: { children: ReactNode }) => (
  <GeoContext.Provider value={useGeoState()}>{children}</GeoContext.Provider>
);

export const useGeo = () => useContext(GeoContext);
