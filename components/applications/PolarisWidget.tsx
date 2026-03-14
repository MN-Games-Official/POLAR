import { Card } from "@/components/ui/Card";
import { AIFormGenerator } from "@/components/applications/AIFormGenerator";
import type { ApplicationDraft, Question } from "@/types";

export function PolarisWidget({
  applicationId,
  values,
  onApply
}: {
  applicationId?: string;
  values: ApplicationDraft;
  onApply: (questions: Question[], mode: "replace" | "merge") => void;
}) {
  return (
    <Card className="dashboard-card overflow-hidden bg-gradient-to-br from-coral/10 via-transparent to-mint/10">
      <p className="text-xs uppercase tracking-[0.26em] text-coral">Polaris AI</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Generate a stronger form</h3>
      <p className="mt-2 text-sm text-slate-400">
        Abacus AI can draft a complete application aligned to the target group and role.
      </p>
      <div className="mt-6">
        <AIFormGenerator applicationId={applicationId} values={values} onApply={onApply} />
      </div>
    </Card>
  );
}
