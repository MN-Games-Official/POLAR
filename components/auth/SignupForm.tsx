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
import { signUpSchema } from "@/lib/validation";
import type { z } from "zod";

type SignupValues = z.infer<typeof signUpSchema>;

export function SignupForm() {
  const router = useRouter();
  const { signup, loading } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<SignupValues>({
    resolver: zodResolver(signUpSchema)
  });

  return (
    <Card className="w-full rounded-[2rem] p-8">
      <p className="text-xs uppercase tracking-[0.32em] text-coral">Create account</p>
      <h2 className="mt-4 text-3xl font-semibold">Provision a new operator</h2>
      <p className="mt-3 text-sm text-slate-400">
        Accounts require email verification before access is granted.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={handleSubmit(async (values) => {
          try {
            await signup(values);
            router.push("/verify-email");
          } catch (error) {
            setError("root", {
              message: error instanceof Error ? error.message : "Unable to create account."
            });
          }
        })}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Full name</label>
            <Input placeholder="Alex Polaris" {...register("full_name")} />
            {errors.full_name ? (
              <p className="text-xs text-rose-300">{errors.full_name.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Username</label>
            <Input placeholder="polaris_admin" {...register("username")} />
            {errors.username ? (
              <p className="text-xs text-rose-300">{errors.username.message}</p>
            ) : null}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Email</label>
          <Input placeholder="user@example.com" type="email" {...register("email")} />
          {errors.email ? <p className="text-xs text-rose-300">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Password</label>
          <Input placeholder="SecurePassword123!" type="password" {...register("password")} />
          {errors.password ? (
            <p className="text-xs text-rose-300">{errors.password.message}</p>
          ) : null}
        </div>

        {errors.root?.message ? (
          <Alert title="Sign up failed" description={errors.root.message} tone="danger" />
        ) : null}

        <Button className="w-full" disabled={loading} type="submit">
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-400">
        Already have access?{" "}
        <Link className="text-mint hover:text-white" href="/login">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
