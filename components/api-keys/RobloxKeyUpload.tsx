"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";
import { robloxKeySchema } from "@/lib/validation";
import type { z } from "zod";

type RobloxKeyValues = z.infer<typeof robloxKeySchema>;

export function RobloxKeyUpload({
  initialStatus
}: {
  initialStatus?: { preview?: string; last_used?: string | null; active?: boolean };
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState(initialStatus?.preview ?? "");
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<RobloxKeyValues>({
    resolver: zodResolver(robloxKeySchema),
    defaultValues: {
      validate: true
    }
  });

  return (
    <Card className="dashboard-card">
      <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Roblox cloud</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Upload Roblox API key</h3>
      <p className="mt-2 text-sm text-slate-400">
        The key is validated against Roblox group APIs and stored encrypted.
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={handleSubmit(async (values) => {
          setMessage(null);
          try {
            const payload = await apiClient<{ preview: string; message: string }>(
              "/api/api-keys/roblox",
              {
                method: "POST",
                body: JSON.stringify(values)
              }
            );
            setPreview(payload.preview);
            setMessage(payload.message);
          } catch (error) {
            setError("root", {
              message: error instanceof Error ? error.message : "Unable to save Roblox key."
            });
          }
        })}
      >
        <div className="space-y-2">
          <label className="text-sm text-slate-200">API key</label>
          <Input placeholder="Paste Roblox API key" type="password" {...register("api_key")} />
          {errors.api_key ? (
            <p className="text-xs text-rose-300">{errors.api_key.message}</p>
          ) : null}
        </div>

        {preview ? (
          <Alert
            title="Current key stored"
            description={`Preview: ${preview}`}
            tone="success"
          />
        ) : null}

        {message ? <Alert title="Key saved" description={message} tone="success" /> : null}

        {errors.root?.message ? (
          <Alert title="Upload failed" description={errors.root.message} tone="danger" />
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Validating..." : "Validate and save"}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={async () => {
              try {
                const payload = await apiClient<{ message: string; preview: string }>(
                  "/api/api-keys/roblox/validate",
                  {
                    method: "POST",
                    body: JSON.stringify({
                      api_key: getValues("api_key")
                    })
                  }
                );
                setMessage(payload.message);
                setPreview(payload.preview);
              } catch (error) {
                setMessage(error instanceof Error ? error.message : "Validation failed.");
              }
            }}
          >
            Test key only
          </Button>
        </div>
      </form>
    </Card>
  );
}
