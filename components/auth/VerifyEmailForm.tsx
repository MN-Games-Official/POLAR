"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";

export function VerifyEmailForm({ token }: { token?: string }) {
  const [state, setState] = useState<"idle" | "verifying" | "success" | "error">(
    token ? "verifying" : "idle"
  );
  const [message, setMessage] = useState(
    token ? "Verifying your email token." : "Check your email for the verification link."
  );

  useEffect(() => {
    if (!token) return;

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Verification failed.");
        }
        setState("success");
        setMessage("Email verified. You can sign in now.");
      })
      .catch((error) => {
        setState("error");
        setMessage(error instanceof Error ? error.message : "Verification failed.");
      });
  }, [token]);

  return (
    <Card className="w-full rounded-[2rem] p-8">
      <p className="text-xs uppercase tracking-[0.32em] text-coral">Email verification</p>
      <h2 className="mt-4 text-3xl font-semibold">Confirm operator email</h2>
      <p className="mt-3 text-sm text-slate-400">
        Accounts stay inactive until the verification token is redeemed.
      </p>

      <div className="mt-8 space-y-5">
        {state === "success" ? (
          <Alert title="Email verified" description={message} tone="success" />
        ) : state === "error" ? (
          <Alert title="Verification failed" description={message} tone="danger" />
        ) : (
          <Alert title="Verification pending" description={message} tone="info" />
        )}

        <Link
          href="/login"
          className="shine-border inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-coral to-sun px-5 text-sm font-medium text-slate-950 shadow-glow transition-all duration-300 hover:brightness-105"
        >
          Return to login
        </Link>
      </div>
    </Card>
  );
}
