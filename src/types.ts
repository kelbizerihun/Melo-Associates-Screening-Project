export interface InterviewQuestion {
  num: number;
  questionText: string;
  intent: string;
  idealIndicators: string[];
}

export interface GenerationResponse {
  role: string;
  questions: InterviewQuestion[];
  rationale: string;
}

export interface QuickRolePreset {
  title: string;
  emoji?: string;
  description: string;
}
