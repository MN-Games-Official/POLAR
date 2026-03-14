"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

export function useFetch<T>(url: string, enabled = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;
    setLoading(true);

    apiClient<T>(url)
      .then((payload) => {
        if (mounted) {
          setData(payload);
          setError(null);
        }
      })
      .catch((reason) => {
        if (mounted) {
          setError(reason instanceof Error ? reason.message : "Request failed.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [enabled, url]);

  return { data, loading, error, setData };
}
