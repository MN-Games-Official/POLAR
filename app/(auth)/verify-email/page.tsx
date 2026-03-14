import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";

export default function VerifyEmailPage({
  searchParams
}: {
  searchParams: { token?: string };
}) {
  return <VerifyEmailForm token={searchParams.token} />;
}
