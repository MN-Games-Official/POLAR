"use client";

import { useState } from "react";
import { WandSparkles } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { apiClient } from "@/lib/api-client";
import type { ApplicationDraft, Question } from "@/types";

export function AIFormGenerator({
  applicationId,
  values,
  onApply
}: {
  applicationId?: string;
  values: ApplicationDraft;
  onApply: (questions: Question[], mode: "replace" | "merge") => void;
}) {
  const [questionsCount, setQuestionsCount] = useState(6);
  const [vibe, setVibe] = useState("professional");
  const [instructions, setInstructions] = useState("");
  const [generated, setGenerated] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-slate-200">Questions</label>
          <Input
            type="number"
            value={questionsCount}
            onChange={(event) => setQuestionsCount(Number(event.target.value) || 6)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-200">Tone</label>
          <Input value={vibe} onChange={(event) => setVibe(event.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-200">Custom instructions</label>
        <Textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} />
      </div>

      {error ? <Alert title="Generation failed" description={error} tone="danger" /> : null}
      {generated.length ? (
        <Alert
          title="AI form ready"
          description={`${generated.length} questions generated and ready to import.`}
          tone="success"
        />
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              const response = await apiClient<{ form: { questions: Question[] } }>(
                `/api/applications/${applicationId ?? "draft"}/generate`,
                {
                  method: "POST",
                  body: JSON.stringify({
                    name: values.name,
                    description: values.description,
                    group_id: values.group_id,
                    rank: values.target_role,
                    questions_count: questionsCount,
                    vibe,
                    primary_color: values.style.primary_color,
                    secondary_color: values.style.secondary_color,
                    instructions
                  })
                }
              );
              setGenerated(response.form.questions);
            } catch (reason) {
              setError(reason instanceof Error ? reason.message : "Unable to generate questions.");
            } finally {
              setLoading(false);
            }
          }}
        >
          <WandSparkles className="h-4 w-4" />
          {loading ? "Generating..." : "Generate with AI"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={!generated.length}
          onClick={() => onApply(generated, "replace")}
        >
          Replace questions
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={!generated.length}
          onClick={() => onApply(generated, "merge")}
        >
          Merge questions
        </Button>
      </div>
    </div>
  );
}
