"use client";

import { useFetch } from "@/hooks/useFetch";

export function useRankCenters(enabled = true) {
  return useFetch<{
    rank_centers: Array<{
      id: string;
      name: string;
      group_id: string;
      universe_id?: string | null;
      rank_count: number;
      created_at: string;
      updated_at: string;
    }>;
  }>("/api/rank-centers", enabled);
}
