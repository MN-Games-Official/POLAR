"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PolarisWidget } from "@/components/applications/PolarisWidget";
import { PreviewPanel } from "@/components/applications/PreviewPanel";
import { QuestionEditor } from "@/components/applications/QuestionEditor";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { apiClient } from "@/lib/api-client";
import { DEFAULT_APP_STYLE } from "@/lib/constants";
import { applicationSchema } from "@/lib/validation";
import type { ApplicationDraft, Question } from "@/types";

const emptyApplication: ApplicationDraft = {
  name: "",
  description: "",
  group_id: "",
  target_role: "rank: 1",
  pass_score: 70,
  style: DEFAULT_APP_STYLE,
  questions: []
};

export function ApplicationBuilder({ initialData }: { initialData?: ApplicationDraft }) {
  const router = useRouter();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ApplicationDraft>({
    resolver: zodResolver(applicationSchema),
    defaultValues: initialData ?? emptyApplication
  });

  const values = watch();

  const previewValues = useMemo<ApplicationDraft>(
    () => ({
      ...values,
      description: values.description ?? "",
      style: values.style ?? DEFAULT_APP_STYLE,
      questions: values.questions ?? []
    }),
    [values]
  );

  const upsertQuestion = (question: Question) => {
    const nextQuestions = [...(values.questions ?? [])];
    const index = nextQuestions.findIndex((item) => item.id === question.id);

    if (index >= 0) {
      nextQuestions[index] = question;
    } else {
      nextQuestions.push(question);
    }

    setValue("questions", nextQuestions, { shouldValidate: true });
  };

  const moveQuestion = (id: string, direction: -1 | 1) => {
    const questions = [...(values.questions ?? [])];
    const index = questions.findIndex((question) => question.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= questions.length) return;
    [questions[index], questions[target]] = [questions[target], questions[index]];
    setValue("questions", questions, { shouldValidate: true });
  };

  return (
    <form
      className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
      onSubmit={handleSubmit(async (formValues) => {
        try {
          const payload = await apiClient<{ application: { id: string } }>(
            initialData?.id ? `/api/applications/${initialData.id}` : "/api/applications",
            {
              method: initialData?.id ? "PUT" : "POST",
              body: JSON.stringify(formValues)
            }
          );
          router.push(`/dashboard/application-center/${payload.application.id}`);
          router.refresh();
        } catch (error) {
          setError("root", {
            message: error instanceof Error ? error.message : "Unable to save application."
          });
        }
      })}
    >
      <div className="space-y-6">
        <Card className="dashboard-card">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-slate-200">Application name</label>
              <Input placeholder="Leadership assessment" {...register("name")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-slate-200">Description</label>
              <Textarea placeholder="Describe the position and evaluation criteria." {...register("description")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Group ID</label>
              <Input placeholder="123456" {...register("group_id")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Target role</label>
              <Input placeholder="rank: 218" {...register("target_role")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Pass score</label>
              <Input type="number" {...register("pass_score", { valueAsNumber: true })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Primary</label>
                <Input type="color" {...register("style.primary_color")} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Secondary</label>
                <Input type="color" {...register("style.secondary_color")} />
              </div>
            </div>
          </div>

          {errors.root?.message ? (
            <div className="mt-5">
              <Alert title="Save failed" description={errors.root.message} tone="danger" />
            </div>
          ) : null}
          {errors.questions?.message ? (
            <div className="mt-5">
              <Alert title="Question issue" description={errors.questions.message as string} tone="warning" />
            </div>
          ) : null}
        </Card>

        <Card className="dashboard-card">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Questions</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Assessment builder</h3>
            </div>
            <Button
              type="button"
              onClick={() => {
                setEditingQuestion(null);
                setEditorOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add question
            </Button>
          </div>
          <div className="space-y-4">
            {(values.questions ?? []).length ? (
              values.questions?.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Question {index + 1}
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">{question.text}</p>
                      <p className="mt-2 text-sm text-slate-400">
                        {question.type.replace("_", " ")} • {question.max_score} points
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="ghost" onClick={() => moveQuestion(question.id, -1)}>
                        Up
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => moveQuestion(question.id, 1)}>
                        Down
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setEditingQuestion(question);
                          setEditorOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setValue(
                            "questions",
                            (values.questions ?? []).filter((item) => item.id !== question.id),
                            { shouldValidate: true }
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                No questions yet. Add them manually or generate them with Polaris AI.
              </p>
            )}
          </div>
        </Card>

        <PolarisWidget
          applicationId={initialData?.id}
          values={previewValues}
          onApply={(questions, mode) =>
            setValue(
              "questions",
              mode === "replace" ? questions : [...(values.questions ?? []), ...questions],
              { shouldValidate: true }
            )
          }
        />

        <div className="flex flex-wrap gap-3">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : initialData?.id ? "Save changes" : "Create application"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/dashboard/application-center")}>
            Back to list
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <PreviewPanel application={previewValues} />
      </div>

      <QuestionEditor
        open={editorOpen}
        initialQuestion={editingQuestion}
        onClose={() => setEditorOpen(false)}
        onSave={upsertQuestion}
      />
    </form>
  );
}
