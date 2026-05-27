import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { BaseUrl } from "./Config/BaseUrl";

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false); // ✅ track if already fetched

  const fetchSiteData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BaseUrl}content/site`); // ✅ removed cache: "no-store"
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
    // ✅ Fetch only once on app mount, not on every route change
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchSiteData();
    }
  }, [fetchSiteData]);

  return (
    <SiteDataContext.Provider
      value={{ siteData, loading, error, refetch: fetchSiteData }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx)
    throw new Error("useSiteData must be used inside <SiteDataProvider>");
  return ctx;
}
