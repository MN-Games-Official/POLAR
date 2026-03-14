"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  className
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className={cn("glass-panel w-full max-w-3xl rounded-[2rem] p-6", className)}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl">{title}</h3>
            {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
          </div>
          <button
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 hover:text-white"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
