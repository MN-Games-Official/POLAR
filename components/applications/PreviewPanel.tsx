import type { ApplicationDraft } from "@/types";

export function PreviewPanel({ application }: { application: ApplicationDraft }) {
  return (
    <div
      className="rounded-[2rem] border p-6 shadow-panel"
      style={{
        borderColor: `${application.style.primary_color}55`,
        background: `linear-gradient(180deg, ${application.style.secondary_color}cc, rgba(6,19,31,0.94))`
      }}
    >
      <p className="text-xs uppercase tracking-[0.28em]" style={{ color: application.style.primary_color }}>
        Live preview
      </p>
      <h3 className="mt-4 text-3xl font-semibold text-white">
        {application.name || "Untitled application"}
      </h3>
      <p className="mt-3 text-sm text-slate-300">
        {application.description || "Describe the role, expectations, and grading philosophy."}
      </p>
      <div className="mt-6 space-y-4">
        {application.questions.map((question, index) => (
          <div key={question.id} className="rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">
                {index + 1}. {question.text || "Untitled question"}
              </p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                {question.type.replace("_", " ")}
              </span>
            </div>
            {question.type === "multiple_choice" && question.options?.length ? (
              <div className="mt-4 grid gap-3">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={`${question.id}-${optionIndex}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200"
                  >
                    {option || `Option ${optionIndex + 1}`}
                  </div>
                ))}
              </div>
            ) : null}
            {question.type === "short_answer" ? (
              <div className="mt-4 rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-400">
                Applicant response area
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
