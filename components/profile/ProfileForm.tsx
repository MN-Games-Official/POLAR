"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";
import { profileUpdateSchema } from "@/lib/validation";
import type { AuthUser } from "@/types";
import type { z } from "zod";

type ProfileValues = z.infer<typeof profileUpdateSchema>;

export function ProfileForm({ user }: { user: AuthUser }) {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: user.full_name ?? "",
      avatar_url: user.avatar_url ?? ""
    }
  });

  return (
    <Card className="dashboard-card">
      <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Identity</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Operator profile</h3>

      <form
        className="mt-6 space-y-5"
        onSubmit={handleSubmit(async (values) => {
          setSaved(false);
          try {
            await apiClient("/api/users/profile/update", {
              method: "PUT",
              body: JSON.stringify(values)
            });
            setSaved(true);
          } catch (error) {
            setError("root", {
              message: error instanceof Error ? error.message : "Unable to update profile."
            });
          }
        })}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Username</label>
            <Input defaultValue={user.username} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Email</label>
            <Input defaultValue={user.email} disabled />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Full name</label>
            <Input placeholder="Alex Polaris" {...register("full_name")} />
            {errors.full_name ? (
              <p className="text-xs text-rose-300">{errors.full_name.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Avatar URL</label>
            <Input placeholder="https://example.com/avatar.png" {...register("avatar_url")} />
            {errors.avatar_url ? (
              <p className="text-xs text-rose-300">{errors.avatar_url.message}</p>
            ) : null}
          </div>
        </div>

        {saved ? (
          <Alert title="Profile updated" description="Operator details were saved." tone="success" />
        ) : null}

        {errors.root?.message ? (
          <Alert title="Update failed" description={errors.root.message} tone="danger" />
        ) : null}

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : "Save profile"}
        </Button>
      </form>
    </Card>
  );
}
