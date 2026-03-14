"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validation";
import type { z } from "zod";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <Card className="w-full rounded-[2rem] p-8">
      <p className="text-xs uppercase tracking-[0.32em] text-coral">Welcome back</p>
      <h2 className="mt-4 text-3xl font-semibold">Sign in to Polaris Pilot</h2>
      <p className="mt-3 text-sm text-slate-400">
        Manage applications, ranks, API keys, and operator settings.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={handleSubmit(async (values) => {
          try {
            await login(values);
            router.push("/dashboard");
            router.refresh();
          } catch (error) {
            setError("root", {
              message: error instanceof Error ? error.message : "Unable to sign in."
            });
          }
        })}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Email</label>
          <Input placeholder="user@example.com" type="email" {...register("email")} />
          {errors.email ? <p className="text-xs text-rose-300">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-200">Password</label>
            <Link className="text-xs text-mint hover:text-white" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <Input placeholder="SecurePassword123!" type="password" {...register("password")} />
          {errors.password ? (
            <p className="text-xs text-rose-300">{errors.password.message}</p>
          ) : null}
        </div>

        {errors.root?.message ? (
          <Alert title="Sign in failed" description={errors.root.message} tone="danger" />
        ) : null}

        <Button className="w-full" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-400">
        Need access?{" "}
        <Link className="text-mint hover:text-white" href="/signup">
          Create an operator account
        </Link>
      </p>
    </Card>
  );
}
