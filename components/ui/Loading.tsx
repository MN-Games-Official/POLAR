export function Loading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <span className="relative inline-flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-coral/70" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-coral" />
      </span>
      {label}
    </div>
  );
}
