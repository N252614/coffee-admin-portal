import { useEffect, useState } from "react";

/**
 * Tiny reusable data-fetching hook.
 * Handles loading & error states automatically.
 * Cancels state updates if the component is unmounted
 * to avoid "memory leak" warnings.
 */
export function useFetch(url, options) {
  // Store fetched data
  const [data, setData] = useState(null);

  // Loading state (true at start)
  const [loading, setLoading] = useState(true);

  // Error state (null by default)
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // flag to prevent updates after unmount
    setLoading(true); // reset loading before every request

    fetch(url, options)
      .then((res) => res.json())
      .then((d) => {
        if (!cancelled) setData(d); // only update if still mounted
      })
      .catch((e) => {
        if (!cancelled) setError(e); // save error if request failed
      })
      .finally(() => {
        if (!cancelled) setLoading(false); // finish loading
      });

    // Cleanup function: runs if component unmounts
    return () => {
      cancelled = true;
    };
  }, [url]); // re-run if URL changes

  // Return data, loading flag, and error
  return { data, loading, error };
}