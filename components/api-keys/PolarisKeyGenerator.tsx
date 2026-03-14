"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";
import { polarisKeySchema } from "@/lib/validation";
import type { z } from "zod";

type PolarisKeyValues = z.infer<typeof polarisKeySchema>;

const scopes = [
  "applications:read",
  "applications:write",
  "submissions:read",
  "ranks:read",
  "ranks:write"
];

export function PolarisKeyGenerator() {
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<PolarisKeyValues>({
    resolver: zodResolver(polarisKeySchema),
    defaultValues: {
      name: "Primary integration",
      scopes: ["applications:read", "applications:write"],
      expires_in: 2592000
    }
  });

  const selectedScopes = watch("scopes") ?? [];

  return (
    <Card className="dashboard-card">
      <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Polaris services</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Generate Polaris API key</h3>
      <p className="mt-2 text-sm text-slate-400">
        Plaintext is shown once. Storage is hashed and the preview remains visible later.
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={handleSubmit(async (values) => {
          try {
            const payload = await apiClient<{ api_key: string }>("/api/api-keys/polaris", {
              method: "POST",
              body: JSON.stringify(values)
            });
            setGeneratedKey(payload.api_key);
          } catch (error) {
            setError("root", {
              message: error instanceof Error ? error.message : "Unable to generate key."
            });
          }
        })}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Integration name</label>
            <Input {...register("name")} />
            {errors.name ? <p className="text-xs text-rose-300">{errors.name.message}</p> : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Expires in (seconds)</label>
            <Input type="number" {...register("expires_in", { valueAsNumber: true })} />
            {errors.expires_in ? (
              <p className="text-xs text-rose-300">{errors.expires_in.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm text-slate-200">Scopes</label>
          <div className="grid gap-3 md:grid-cols-2">
            {scopes.map((scope) => {
              const active = selectedScopes.includes(scope);
              return (
                <button
                  key={scope}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    active
                      ? "border-mint/30 bg-mint/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-slate-400"
                  }`}
                  onClick={(event) => {
                    event.preventDefault();
                    setValue(
                      "scopes",
                      active
                        ? selectedScopes.filter((item) => item !== scope)
                        : [...selectedScopes, scope]
                    );
                  }}
                  type="button"
                >
                  {scope}
                </button>
              );
            })}
          </div>
          {errors.scopes ? <p className="text-xs text-rose-300">{errors.scopes.message}</p> : null}
        </div>

        {generatedKey ? (
          <Alert
            title="Copy this key now"
            description={generatedKey}
            tone="success"
          />
        ) : null}

        {errors.root?.message ? (
          <Alert title="Generation failed" description={errors.root.message} tone="danger" />
        ) : null}

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Generating..." : "Generate key"}
        </Button>
      </form>
    </Card>
  );
}
