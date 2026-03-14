import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage({
  searchParams
}: {
  searchParams: { token?: string };
}) {
  return <ResetPasswordForm token={searchParams.token} />;
}
