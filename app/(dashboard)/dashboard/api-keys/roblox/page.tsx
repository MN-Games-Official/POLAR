import { Header } from "@/components/Header";
import { RobloxKeyUpload } from "@/components/api-keys/RobloxKeyUpload";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export default async function RobloxKeyPage() {
  const user = await requireUser();
  const key = await db.apiKey.findFirst({
    where: { user_id: user.id, type: "roblox", is_active: true },
    orderBy: { updated_at: "desc" }
  });

  return (
    <>
      <Header
        title="Roblox API key"
        description="Validate and store the Roblox Cloud credential used for membership checks and promotions."
      />
      <RobloxKeyUpload
        initialStatus={
          key
            ? {
                preview: key.key_prefix,
                last_used: key.last_used?.toISOString() ?? null,
                active: key.is_active
              }
            : undefined
        }
      />
    </>
  );
}
