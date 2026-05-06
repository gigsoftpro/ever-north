import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { BaseUrl } from "./Config/BaseUrl";

// ─── Context ──────────────────────────────────────────────────────────────────
const SiteDataContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function SiteDataProvider({ children }) {
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSiteData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BaseUrl}content/site`);
      const json = await res.json();
      if (json.success) {
        setSiteData(json.data);
      } else {
        setError(json.message || "Failed to load site data");
      }
    } catch (err) {
      setError("Network error — could not load site content.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteData();
  }, [fetchSiteData]);

  return (
    <SiteDataContext.Provider
      value={{ siteData, loading, error, refetch: fetchSiteData }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error("useSiteData must be used inside <SiteDataProvider>");
  }
  return ctx;
}
