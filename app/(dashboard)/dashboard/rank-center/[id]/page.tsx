import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { RankCenterBuilder } from "@/components/rank-center/RankCenterBuilder";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeJsonParse } from "@/lib/utils";
import type { RankCenterDraft, RankEntry } from "@/types";

export default async function EditRankCenterPage({
  params
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const rankCenter = await db.rankCenter.findFirst({
    where: { id: params.id, user_id: user.id }
  });

  if (!rankCenter) {
    notFound();
  }

  const initialData: RankCenterDraft = {
    id: rankCenter.id,
    name: rankCenter.name,
    group_id: rankCenter.group_id,
    universe_id: rankCenter.universe_id ?? "",
    ranks: safeJsonParse<RankEntry[]>(rankCenter.ranks_json, [])
  };

  return (
    <>
      <Header
        title={rankCenter.name}
        description="Adjust pricing, visibility, and Roblox mapping for each configured rank."
      />
      <RankCenterBuilder initialData={initialData} />
    </>
  );
}
