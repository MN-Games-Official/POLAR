import { Header } from "@/components/Header";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfilePicture } from "@/components/profile/ProfilePicture";
import { Card } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <>
      <Header
        title="Profile and access"
        description="Maintain operator identity details and security settings."
      />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="dashboard-card">
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Operator card</p>
          <div className="mt-6 flex flex-col items-start gap-5">
            <ProfilePicture alt={user.full_name || user.username} src={user.avatar_url} />
            <div>
              <h3 className="text-2xl font-semibold text-white">{user.full_name || user.username}</h3>
              <p className="mt-1 text-sm text-slate-400">{user.email}</p>
              <p className="mt-4 max-w-sm text-sm text-slate-400">
                Email verification is {user.email_verified ? "enabled" : "pending"} for this operator.
              </p>
            </div>
          </div>
        </Card>
        <ProfileForm user={user} />
      </div>
      <div className="mt-6">
        <PasswordChangeForm />
      </div>
    </>
  );
}
