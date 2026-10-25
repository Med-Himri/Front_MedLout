"use client";

import { useCallback, useEffect, useState } from "react";
import { apiError } from "@/utils/axiosInstance";

/**
 * Loads data for an admin page. `load` is an async function returning an axios
 * response; re-runs whenever `deps` change. Returns { data, loading, error, reload, setData }.
 */
export function useAdminData(load, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(load, deps);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await run();
      setData(response.data);
    } catch (err) {
      setError(apiError(err, "Impossible de charger les données"));
    } finally {
      setLoading(false);
    }
  }, [run]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}
