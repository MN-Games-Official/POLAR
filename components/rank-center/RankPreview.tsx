import type { RankCenterDraft } from "@/types";

export function RankPreview({ rankCenter }: { rankCenter: RankCenterDraft }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6">
      <p className="text-xs uppercase tracking-[0.28em] text-coral">Preview</p>
      <h3 className="mt-4 text-3xl font-semibold text-white">
        {rankCenter.name || "Untitled rank center"}
      </h3>
      <p className="mt-3 text-sm text-slate-400">
        Roblox group {rankCenter.group_id || "pending"} {rankCenter.universe_id ? `• universe ${rankCenter.universe_id}` : ""}
      </p>
      <div className="mt-6 grid gap-4">
        {rankCenter.ranks.map((rank) => (
          <div
            key={rank.id}
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-white">{rank.name || `Rank ${rank.rank_id}`}</p>
                <p className="mt-1 text-sm text-slate-400">{rank.description || "No description provided."}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{rank.price} R$</p>
                <p className="text-xs text-slate-500">{rank.is_for_sale ? "For sale" : "Hidden"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
