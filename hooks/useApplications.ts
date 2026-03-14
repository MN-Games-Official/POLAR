"use client";

import { useFetch } from "@/hooks/useFetch";

export function useApplications(enabled = true) {
  return useFetch<{
    applications: Array<{
      id: string;
      name: string;
      description?: string | null;
      group_id: string;
      created_at: string;
      updated_at: string;
      submission_count: number;
      pass_count: number;
    }>;
    stats: {
      total: number;
      submissions: number;
      passRate: number;
    };
  }>("/api/applications", enabled);
}
