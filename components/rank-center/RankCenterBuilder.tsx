"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RankPreview } from "@/components/rank-center/RankPreview";
import { RanksEditor } from "@/components/rank-center/RanksEditor";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";
import { rankCenterSchema } from "@/lib/validation";
import type { RankCenterDraft } from "@/types";

const emptyRankCenter: RankCenterDraft = {
  name: "",
  group_id: "",
  universe_id: "",
  ranks: []
};

export function RankCenterBuilder({ initialData }: { initialData?: RankCenterDraft }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<RankCenterDraft>({
    resolver: zodResolver(rankCenterSchema),
    defaultValues: initialData ?? emptyRankCenter
  });

  const values = watch();
  const previewValues = useMemo<RankCenterDraft>(
    () => ({
      ...values,
      universe_id: values.universe_id ?? "",
      ranks: values.ranks ?? []
    }),
    [values]
  );

  return (
    <form
      className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
      onSubmit={handleSubmit(async (formValues) => {
        try {
          const response = await apiClient<{ rank_center: { id: string } }>(
            initialData?.id ? `/api/rank-centers/${initialData.id}` : "/api/rank-centers",
            {
              method: initialData?.id ? "PUT" : "POST",
              body: JSON.stringify(formValues)
            }
          );
          router.push(`/dashboard/rank-center/${response.rank_center.id}`);
          router.refresh();
        } catch (error) {
          setError("root", {
            message: error instanceof Error ? error.message : "Unable to save rank center."
          });
        }
      })}
    >
      <div className="space-y-6">
        <Card className="dashboard-card">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-slate-200">Rank center name</label>
              <Input placeholder="Premium ranks" {...register("name")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Group ID</label>
              <Input placeholder="123456" {...register("group_id")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Universe ID</label>
              <Input placeholder="9876543" {...register("universe_id")} />
            </div>
          </div>

          {errors.root?.message ? (
            <div className="mt-5">
              <Alert title="Save failed" description={errors.root.message} tone="danger" />
            </div>
          ) : null}
          {errors.ranks?.message ? (
            <div className="mt-5">
              <Alert title="Rank issue" description={errors.ranks.message as string} tone="warning" />
            </div>
          ) : null}
        </Card>

        <Card className="dashboard-card">
          <RanksEditor
            ranks={values.ranks ?? []}
            onChange={(nextRanks) => setValue("ranks", nextRanks, { shouldValidate: true })}
          />
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : initialData?.id ? "Save changes" : "Create rank center"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/dashboard/rank-center")}>
            Back to list
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <RankPreview rankCenter={previewValues} />
      </div>
    </form>
  );
}
