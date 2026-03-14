"use client";

import type { ReactNode } from "react";
import { useToastContext } from "@/components/providers";

export function ToastButton({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const { pushToast } = useToastContext();

  return (
    <button
      type="button"
      onClick={() => pushToast({ title, description })}
      className="text-sm text-slate-200 underline decoration-slate-500 underline-offset-4 hover:text-white"
    >
      {children}
    </button>
  );
}
