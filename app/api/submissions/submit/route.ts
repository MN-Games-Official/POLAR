import { errorResponse, successResponse } from "@/lib/api-response";
import { gradeSubmissionAndPromote } from "@/lib/submissions";
import { submissionSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = submissionSchema.parse(body);
    const result = await gradeSubmissionAndPromote({
      appId: parsed.app_id,
      applicantId: parsed.applicant_id,
      membershipId: parsed.membership_id,
      answers: parsed.answers
    });

    return successResponse(result);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to submit application.",
      400,
      "SUBMISSION_ERROR"
    );
  }
}
