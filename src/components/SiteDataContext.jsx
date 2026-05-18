import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";
import { BaseUrl } from "./Config/BaseUrl";

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchSiteData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BaseUrl}content/site`, {
        cache: "no-store",
      });
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
  }, [location.pathname, fetchSiteData]);

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
  if (!ctx) {
    throw new Error("useSiteData must be used inside <SiteDataProvider>");
  }
  return ctx;
}
