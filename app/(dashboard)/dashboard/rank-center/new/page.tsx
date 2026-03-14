import { Header } from "@/components/Header";
import { RankCenterBuilder } from "@/components/rank-center/RankCenterBuilder";

export default function NewRankCenterPage() {
  return (
    <>
      <Header
        title="New rank center"
        description="Create a new storefront or promotion rank program."
      />
      <RankCenterBuilder />
    </>
  );
}
