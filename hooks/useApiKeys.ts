"use client";

import { useFetch } from "@/hooks/useFetch";
import type { ApiKeySummary } from "@/types";

export function useApiKeys(enabled = true) {
  return useFetch<{ api_keys: ApiKeySummary[] }>("/api/api-keys", enabled);
}
