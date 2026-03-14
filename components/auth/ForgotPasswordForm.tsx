"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";
import { forgotPasswordSchema } from "@/lib/validation";
import type { z } from "zod";

type ForgotValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  return (
    <Card className="w-full rounded-[2rem] p-8">
      <p className="text-xs uppercase tracking-[0.32em] text-coral">Password reset</p>
      <h2 className="mt-4 text-3xl font-semibold">Request reset link</h2>
      <p className="mt-3 text-sm text-slate-400">
        A one-hour reset token will be sent to the operator email if the account exists.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={handleSubmit(async (values) => {
          try {
            await apiClient("/api/password/request-reset", {
              method: "POST",
              body: JSON.stringify(values)
            });
            setSent(true);
          } catch (error) {
            setError("root", {
              message: error instanceof Error ? error.message : "Unable to request reset."
            });
          }
        })}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Email</label>
          <Input placeholder="user@example.com" type="email" {...register("email")} />
          {errors.email ? <p className="text-xs text-rose-300">{errors.email.message}</p> : null}
        </div>

        {sent ? (
          <Alert
            title="Check your email"
            description="If the account exists, a reset link has been issued."
            tone="success"
          />
        ) : null}

        {errors.root?.message ? (
          <Alert title="Request failed" description={errors.root.message} tone="danger" />
        ) : null}

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Sending..." : "Send reset link"}
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
