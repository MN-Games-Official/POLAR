"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";
import { changePasswordSchema } from "@/lib/validation";
import type { z } from "zod";

type PasswordValues = z.infer<typeof changePasswordSchema>;

export function PasswordChangeForm() {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PasswordValues>({
    resolver: zodResolver(changePasswordSchema)
  });

  return (
    <Card className="dashboard-card">
      <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Security</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Change password</h3>

      <form
        className="mt-6 space-y-5"
        onSubmit={handleSubmit(async (values) => {
          setSaved(false);
          try {
            await apiClient("/api/users/change-password", {
              method: "POST",
              body: JSON.stringify(values)
            });
            reset();
            setSaved(true);
          } catch (error) {
            setError("root", {
              message: error instanceof Error ? error.message : "Unable to change password."
            });
          }
        })}
      >
        <div className="space-y-2">
          <label className="text-sm text-slate-200">Current password</label>
          <Input type="password" {...register("current_password")} />
          {errors.current_password ? (
            <p className="text-xs text-rose-300">{errors.current_password.message}</p>
          ) : null}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-200">New password</label>
            <Input type="password" {...register("new_password")} />
            {errors.new_password ? (
              <p className="text-xs text-rose-300">{errors.new_password.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Confirm new password</label>
            <Input type="password" {...register("confirm_password")} />
            {errors.confirm_password ? (
              <p className="text-xs text-rose-300">{errors.confirm_password.message}</p>
            ) : null}
          </div>
        </div>

        {saved ? (
          <Alert
            title="Password changed"
            description="Other active sessions were invalidated."
            tone="success"
          />
        ) : null}

        {errors.root?.message ? (
          <Alert title="Update failed" description={errors.root.message} tone="danger" />
        ) : null}

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : "Change password"}
        </Button>
      </form>
    </Card>
  );
}
