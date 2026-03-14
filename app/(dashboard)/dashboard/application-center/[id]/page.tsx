import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { ApplicationBuilder } from "@/components/applications/ApplicationBuilder";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeJsonParse } from "@/lib/utils";
import type { ApplicationDraft, Question } from "@/types";

export default async function EditApplicationPage({
  params
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const application = await db.application.findFirst({
    where: { id: params.id, user_id: user.id }
  });

  if (!application) {
    notFound();
  }

  const parsedQuestions = safeJsonParse<Question[]>(application.questions_json, []);
  const parsedStyle = safeJsonParse<Record<string, string>>(application.style_json ?? "{}", {
    primary_color: application.primary_color,
    secondary_color: application.secondary_color
  });

  const initialData: ApplicationDraft = {
    id: application.id,
    name: application.name,
    description: application.description ?? "",
    group_id: application.group_id,
    target_role: application.target_role,
    pass_score: application.pass_score,
    style: {
      primary_color: parsedStyle.primary_color ?? application.primary_color,
      secondary_color: parsedStyle.secondary_color ?? application.secondary_color
    },
    questions: parsedQuestions
  };

  return (
    <>
      <Header
        title={application.name}
        description="Update question logic, target rank mapping, and application styling."
      />
      <ApplicationBuilder initialData={initialData} />
    </>
  );
}
