export type QuestionType = "multiple_choice" | "short_answer" | "true_false";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correct_answer?: number | string | boolean;
  max_score: number;
  grading_criteria?: string;
}

export interface ApplicationStyle {
  primary_color: string;
  secondary_color: string;
}

export interface ApplicationDraft {
  id?: string;
  name: string;
  description?: string;
  group_id: string;
  target_role: string;
  pass_score: number;
  style: ApplicationStyle;
  questions: Question[];
}

export interface RankEntry {
  id: string;
  rank_id: number;
  gamepass_id: number;
  name: string;
  description: string;
  price: number;
  is_for_sale: boolean;
  regional_pricing: boolean;
}

export interface RankCenterDraft {
  id?: string;
  name: string;
  group_id: string;
  universe_id?: string;
  ranks: RankEntry[];
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  full_name?: string | null;
  avatar_url?: string | null;
  email_verified?: boolean;
}

export interface ApiKeySummary {
  id: number;
  type: "roblox" | "polaris";
  name?: string | null;
  key_prefix: string;
  scopes?: string[];
  is_active: boolean;
  usage_count: number;
  last_used?: string | null;
  created_at: string;
  expires_at?: string | null;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  tone?: "info" | "success" | "warning";
}

export interface SubmissionBreakdownEntry {
  type: QuestionType;
  score: number;
  max_score: number;
  feedback: string;
}
