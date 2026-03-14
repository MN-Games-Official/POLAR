"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { RankEntry } from "@/types";

function createRank(): RankEntry {
  return {
    id: `rank_${Date.now()}`,
    rank_id: 1,
    gamepass_id: 0,
    name: "",
    description: "",
    price: 0,
    is_for_sale: false,
    regional_pricing: false
  };
}

export function RanksEditor({
  ranks,
  onChange
}: {
  ranks: RankEntry[];
  onChange: (nextRanks: RankEntry[]) => void;
}) {
  const updateRank = (id: string, patch: Partial<RankEntry>) => {
    onChange(ranks.map((rank) => (rank.id === id ? { ...rank, ...patch } : rank)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Ranks</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Storefront builder</h3>
        </div>
        <Button type="button" onClick={() => onChange([...ranks, createRank()])}>
          <Plus className="h-4 w-4" />
          Add rank
        </Button>
      </div>

      {ranks.map((rank) => (
        <div key={rank.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Name</label>
              <Input value={rank.name} onChange={(event) => updateRank(rank.id, { name: event.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Rank ID</label>
              <Input
                type="number"
                value={rank.rank_id}
                onChange={(event) => updateRank(rank.id, { rank_id: Number(event.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Gamepass ID</label>
              <Input
                type="number"
                value={rank.gamepass_id}
                onChange={(event) => updateRank(rank.id, { gamepass_id: Number(event.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Price</label>
              <Input
                type="number"
                value={rank.price}
                onChange={(event) => updateRank(rank.id, { price: Number(event.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2 md:col-span-2 xl:col-span-3">
              <label className="text-sm text-slate-200">Description</label>
              <Input
                value={rank.description}
                onChange={(event) => updateRank(rank.id, { description: event.target.value })}
              />
            </div>
            <div className="flex items-end justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onChange(ranks.filter((item) => item.id !== rank.id))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                checked={rank.is_for_sale}
                type="checkbox"
                onChange={(event) => updateRank(rank.id, { is_for_sale: event.target.checked })}
              />
              For sale
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                checked={rank.regional_pricing}
                type="checkbox"
                onChange={(event) =>
                  updateRank(rank.id, { regional_pricing: event.target.checked })
                }
              />
              Regional pricing
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
