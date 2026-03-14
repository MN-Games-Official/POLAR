import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[0-9]/, "Password must include a number.")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character.");

export const signUpSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Username may contain only letters, numbers, and underscores."),
  password: passwordSchema,
  full_name: z.string().max(100).optional().or(z.literal(""))
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    new_password: passwordSchema,
    confirm_password: z.string().min(1)
  })
  .refine((value) => value.new_password === value.confirm_password, {
    message: "Passwords must match.",
    path: ["confirm_password"]
  });

const questionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["multiple_choice", "short_answer", "true_false"]),
  text: z.string().min(3).max(400),
  options: z.array(z.string().min(1).max(120)).optional(),
  correct_answer: z.union([z.number(), z.string(), z.boolean()]).optional(),
  max_score: z.number().min(1).max(100),
  grading_criteria: z.string().max(500).optional()
});

export const applicationSchema = z
  .object({
    name: z.string().min(3).max(100),
    description: z.string().max(500).optional().or(z.literal("")),
    group_id: z.string().regex(/^\d+$/),
    target_role: z.string().min(3).max(120),
    pass_score: z.number().min(0).max(100),
    style: z.object({
      primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/)
    }),
    questions: z.array(questionSchema).min(1).max(25)
  })
  .refine(
    (value) =>
      value.questions.filter((question) => question.type === "short_answer").length <= 3,
    {
      message: "Applications may contain at most three short-answer questions.",
      path: ["questions"]
    }
  );

export const aiGenerationSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  group_id: z.string().regex(/^\d+$/),
  rank: z.string().min(1),
  questions_count: z.number().min(3).max(12),
  vibe: z.string().min(3).max(40),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  instructions: z.string().max(1200).optional()
});

export const rankEntrySchema = z.object({
  id: z.string().optional(),
  rank_id: z.number().min(0).max(255),
  gamepass_id: z.number().min(0),
  name: z.string().min(2).max(80),
  description: z.string().max(280),
  price: z.number().min(0),
  is_for_sale: z.boolean(),
  regional_pricing: z.boolean()
});

export const rankCenterSchema = z.object({
  name: z.string().min(3).max(100),
  group_id: z.string().regex(/^\d+$/),
  universe_id: z.string().regex(/^\d+$/).optional().or(z.literal("")),
  ranks: z.array(rankEntrySchema).min(1).max(30)
});

export const robloxKeySchema = z.object({
  api_key: z.string().min(16),
  validate: z.boolean().optional().default(true)
});

export const polarisKeySchema = z.object({
  name: z.string().min(3).max(60),
  scopes: z.array(z.string().min(3)).min(1),
  expires_in: z.number().min(3600).max(31536000)
});

export const profileUpdateSchema = z.object({
  full_name: z.string().max(100).optional().or(z.literal("")),
  avatar_url: z.string().url().optional().or(z.literal(""))
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1),
    new_password: passwordSchema,
    confirm_password: z.string().min(1)
  })
  .refine((value) => value.new_password === value.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords must match."
  });

export const submissionSchema = z.object({
  app_id: z.string().uuid(),
  applicant_id: z.union([z.number(), z.string()]).transform((value) => String(value)),
  membership_id: z
    .union([z.number(), z.string()])
    .optional()
    .transform((value) => (value === undefined ? undefined : String(value))),
  answers: z.record(z.union([z.string(), z.number(), z.boolean()]))
});
