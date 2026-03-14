import { db } from "@/lib/db";
import { batchGradeShortAnswers } from "@/lib/abacus";
import { decryptValue } from "@/lib/crypto";
import { RobloxService } from "@/lib/roblox-service";
import { safeJsonParse } from "@/lib/utils";
import type { Question, SubmissionBreakdownEntry } from "@/types";

export async function gradeSubmissionAndPromote({
  appId,
  applicantId,
  membershipId,
  answers
}: {
  appId: string;
  applicantId: string;
  membershipId?: string;
  answers: Record<string, string | number | boolean>;
}) {
  const application = await db.application.findUnique({
    where: { id: appId },
    include: {
      user: {
        include: {
          apiKeys: {
            where: {
              type: "roblox",
              is_active: true
            },
            orderBy: { updated_at: "desc" },
            take: 1
          }
        }
      }
    }
  });

  if (!application) {
    throw new Error("Application not found.");
  }

  const questions = safeJsonParse<Question[]>(application.questions_json, []);

  if (!questions.length) {
    throw new Error("Application has no questions configured.");
  }

  const shortAnswerItems = questions
    .filter((question) => question.type === "short_answer")
    .map((question) => ({
      id: question.id,
      question: question.text,
      answer: String(answers[question.id] ?? ""),
      max_score: question.max_score,
      criteria: question.grading_criteria
    }));

  const shortAnswerResults = await batchGradeShortAnswers(shortAnswerItems);
  const shortAnswerMap = new Map(shortAnswerResults.map((result) => [result.id, result]));
  const breakdown: Record<string, SubmissionBreakdownEntry> = {};

  let totalScore = 0;
  let maxScore = 0;

  for (const question of questions) {
    maxScore += question.max_score;
    const answer = answers[question.id];
    let score = 0;
    let feedback = "Incorrect";

    if (question.type === "multiple_choice") {
      score = Number(answer) === Number(question.correct_answer) ? question.max_score : 0;
      feedback = score ? "Correct" : "Incorrect";
    }

    if (question.type === "true_false") {
      score = String(answer) === String(question.correct_answer) ? question.max_score : 0;
      feedback = score ? "Correct" : "Incorrect";
    }

    if (question.type === "short_answer") {
      const result = shortAnswerMap.get(question.id);
      score = Math.max(0, Math.min(question.max_score, result?.score ?? 0));
      feedback = result?.feedback ?? "AI grading unavailable.";
    }

    totalScore += score;
    breakdown[question.id] = {
      type: question.type,
      score,
      max_score: question.max_score,
      feedback
    };
  }

  const percentage = maxScore ? (totalScore / maxScore) * 100 : 0;
  const passed = percentage >= application.pass_score;

  let promotionStatus = "not_attempted";
  let promotionMessage = "Promotion not attempted.";
  let resolvedMembershipId = membershipId;

  const robloxKey = application.user.apiKeys[0];

  if (passed && robloxKey) {
    try {
      const service = new RobloxService(decryptValue(robloxKey.encrypted_key));
      if (!resolvedMembershipId) {
        const membership = await service.getMembership(application.group_id, applicantId);
        resolvedMembershipId = membership?.path?.split("/").pop() ?? undefined;
      }

      if (resolvedMembershipId) {
        await service.promoteUser(application.group_id, resolvedMembershipId, application.target_role);
        promotionStatus = "success";
        promotionMessage = "Promoted successfully.";
      } else {
        promotionStatus = "failed";
        promotionMessage = "Applicant is not a member of the configured Roblox group.";
      }
    } catch (error) {
      promotionStatus = "failed";
      promotionMessage = error instanceof Error ? error.message : "Promotion failed.";
    }
  } else if (passed) {
    promotionStatus = "pending";
    promotionMessage = "No active Roblox key available for automatic promotion.";
  }

  const feedback = Object.values(breakdown)
    .map((entry, index) => `Q${index + 1}: ${entry.feedback}`)
    .join(" ");

  const submission = await db.applicationSubmission.create({
    data: {
      application_id: application.id,
      roblox_user_id: applicantId,
      membership_id: resolvedMembershipId,
      answers_json: JSON.stringify(answers),
      score: totalScore,
      max_score: maxScore,
      passed,
      feedback,
      breakdown_json: JSON.stringify(breakdown),
      promotion_status: promotionStatus
    }
  });

  return {
    success: true,
    passed,
    total_score: totalScore,
    max_score: maxScore,
    percentage,
    breakdown,
    promotion: {
      success: promotionStatus === "success",
      group_id: application.group_id,
      target_role: application.target_role,
      message: promotionMessage
    },
    submission_id: submission.id
  };
}
