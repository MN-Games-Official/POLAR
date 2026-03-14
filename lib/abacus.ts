import { config } from "@/lib/config";
import type { Question } from "@/types";

type GenerationParams = {
  name: string;
  description?: string;
  group_id: string;
  rank: string;
  questions_count: number;
  vibe: string;
  primary_color: string;
  secondary_color: string;
  instructions?: string;
};

function extractJson(content: string) {
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("AI did not return JSON.");
  }
  return JSON.parse(match[0]);
}

export async function generateApplicationWithAi(params: GenerationParams) {
  if (!config.abacus.apiKey) {
    throw new Error("ABACUS_AI_API_KEY is not configured.");
  }

  const prompt = `
You are an expert application designer for Roblox group staffing programs.
Create a ${params.questions_count}-question application with balanced difficulty.

Requirements:
- Name: ${params.name}
- Description: ${params.description ?? "N/A"}
- Group ID: ${params.group_id}
- Target rank: ${params.rank}
- Tone: ${params.vibe}
- Primary color: ${params.primary_color}
- Secondary color: ${params.secondary_color}
- Additional instructions: ${params.instructions ?? "None"}

Rules:
- Use only question types: multiple_choice, short_answer, true_false.
- Include at most 3 short_answer questions.
- Every question must have id, type, text, correct_answer, and max_score.
- Multiple choice questions require 4 options.
- Return only valid JSON in the form:
{
  "form": {
    "questions": [...]
  }
}
`;

  const response = await fetch(`${config.abacus.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.abacus.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: config.abacus.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      stream: false,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    throw new Error("Failed to generate form with Abacus AI.");
  }

  const data = await response.json();
  const parsed = extractJson(data.choices[0]?.message?.content ?? "{}");
  return parsed.form as { questions: Question[] };
}

type ShortAnswerItem = {
  id: string;
  question: string;
  answer: string;
  max_score: number;
  criteria?: string;
};

export async function batchGradeShortAnswers(items: ShortAnswerItem[]) {
  if (!items.length) {
    return [];
  }

  if (!config.abacus.apiKey) {
    return items.map((item) => ({
      id: item.id,
      score: item.max_score / 2,
      feedback: "AI grading unavailable. Defaulted to midpoint score."
    }));
  }

  const prompt = `
You are an objective grader for Roblox group applications.
Grade each answer on a scale of 0-max_score.

${items
  .map(
    (item, index) => `
ITEM ${index + 1}
id=${item.id}
max_score=${item.max_score}
question=${item.question}
answer=${item.answer}
criteria=${item.criteria ?? "No specific criteria"}
`
  )
  .join("\n")}

Return only valid JSON:
{
  "results": [
    { "id": "q1", "score": 7.5, "feedback": "..." }
  ]
}
`;

  const response = await fetch(`${config.abacus.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.abacus.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: config.abacus.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      stream: false,
      max_tokens: 1600
    })
  });

  if (!response.ok) {
    throw new Error("Failed to grade short answers.");
  }

  const data = await response.json();
  return extractJson(data.choices[0]?.message?.content ?? "{}").results as Array<{
    id: string;
    score: number;
    feedback: string;
  }>;
}
