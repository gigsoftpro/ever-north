// hooks/usePageData.js  (or components/hooks/usePageData.js — adjust path to suit)
import { useState, useEffect, useCallback } from "react";
import { BaseUrl } from "../Config/BaseUrl";

export function usePageData(pageName) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BaseUrl}pages/${pageName}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.message || "Failed to load page data");
      }
    } catch {
      setError("Network error — could not load page content.");
    } finally {
      setLoading(false);
    }
  }, [pageName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
