"use client";

import { useAuth } from "@/hooks/useAuth";

export function useUser() {
  const { user, refreshProfile } = useAuth();
  return { user, refreshProfile };
}
