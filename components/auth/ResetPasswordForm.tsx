"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";
import { resetPasswordSchema } from "@/lib/validation";
import type { z } from "zod";

type ResetValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ResetValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token ?? ""
    }
  });

  return (
    <Card className="w-full rounded-[2rem] p-8">
      <p className="text-xs uppercase tracking-[0.32em] text-coral">Reset access</p>
      <h2 className="mt-4 text-3xl font-semibold">Create a new password</h2>
      <p className="mt-3 text-sm text-slate-400">
        Use the emailed reset token to securely rotate the operator password.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={handleSubmit(async (values) => {
          try {
            await apiClient("/api/password/reset", {
              method: "POST",
              body: JSON.stringify(values)
            });
            setSuccess(true);
            window.setTimeout(() => {
              router.push("/login");
            }, 1200);
          } catch (error) {
            setError("root", {
              message: error instanceof Error ? error.message : "Unable to reset password."
            });
          }
        })}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Reset token</label>
          <Input placeholder="Paste token" {...register("token")} />
          {errors.token ? <p className="text-xs text-rose-300">{errors.token.message}</p> : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">New password</label>
          <Input placeholder="NewPassword123!" type="password" {...register("new_password")} />
          {errors.new_password ? (
            <p className="text-xs text-rose-300">{errors.new_password.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Confirm password</label>
          <Input placeholder="Repeat password" type="password" {...register("confirm_password")} />
          {errors.confirm_password ? (
            <p className="text-xs text-rose-300">{errors.confirm_password.message}</p>
          ) : null}
        </div>

        {success ? (
          <Alert
            title="Password updated"
            description="Redirecting you back to login."
            tone="success"
          />
        ) : null}

        {errors.root?.message ? (
          <Alert title="Reset failed" description={errors.root.message} tone="danger" />
        ) : null}

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Resetting..." : "Reset password"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-400">
        Back to{" "}
        <Link className="text-mint hover:text-white" href="/login">
          sign in
        </Link>
      </p>
    </Card>
  );
}
