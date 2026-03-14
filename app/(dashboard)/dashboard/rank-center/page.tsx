import { Header } from "@/components/Header";
import { RankList } from "@/components/rank-center/RankList";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeJsonParse } from "@/lib/utils";

export default async function RankCenterPage() {
  const user = await requireUser();
  const rankCenters = await db.rankCenter.findMany({
    where: { user_id: user.id },
    orderBy: { updated_at: "desc" }
  });

  const list = rankCenters.map((center) => ({
    id: center.id,
    name: center.name,
    group_id: center.group_id,
    universe_id: center.universe_id,
    rank_count: safeJsonParse<unknown[]>(center.ranks_json, []).length,
    created_at: center.created_at.toISOString(),
    updated_at: center.updated_at.toISOString()
  }));

  return (
    <>
      <Header
        title="Rank Center"
        description="Configure purchasable ranks, gamepasses, and sale visibility for Roblox groups."
      />
      <RankList rankCenters={list} />
    </>
  );
}
