export type QuizItem = {
  id: string;
  caseId: string;
  annotator: string;
  text: string;
  literal: string;
  start: number | null;
  end: number | null;
  cat: string;
  sctid: string;
  term: string;
  pol: string;
  cert: string;
  temp: string;
  suj: string;
};

export type Difficulty = "facil" | "normal" | "dificil";

export type QuestionKind = "cat" | "pol" | "cert" | "temp" | "suj" | "term";

export type RoundResult = {
  item: QuizItem;
  answers: Partial<Record<QuestionKind, string>>;
  correct: Partial<Record<QuestionKind, boolean>>;
  allCorrect: boolean;
};

export type GameStats = {
  roundsPlayed: number;
  totalScore: number;
  maxScore: number;
  bestScore: number;
  history: {
    timestamp: number;
    score: number;
    maxScore: number;
    difficulty: Difficulty;
  }[];
  dimensionStats?: Record<string, { attempts: number; errors: number }>;
};