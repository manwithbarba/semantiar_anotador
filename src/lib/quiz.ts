import quizDataRaw from "@/data/quiz-data.json";
import type { QuizItem, Difficulty } from "./types";

export const quizData = quizDataRaw as QuizItem[];

export const CATEGORIES = ["Hallazgo clínico", "Procedimiento", "Fármaco"] as const;
export const POLARITIES = ["Activo", "Negado"] as const;
export const CERTAINTIES = ["Confirmado", "Sospecha", "Diferencial"] as const;
export const TEMPORALITIES = ["Actual", "Histórico"] as const;
export const SUBJECTS = ["Paciente", "Familiar"] as const;

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Elige N ítems al azar que tengan offset localizable en el texto
// (necesario para el resaltado visual del literal clínico).
export function pickRoundItems(
  count: number,
  difficulty?: Difficulty,
  pool: QuizItem[] = quizData
): QuizItem[] {
  let usable = pool.filter((it) => it.start !== null && it.end !== null);
  
  if (difficulty) {
    usable = usable.filter((it) => {
      const len = it.text.length;
      if (difficulty === "facil") return len < 130;
      if (difficulty === "normal") return len >= 130 && len <= 250;
      return len > 250;
    });
    if (usable.length < count) {
      usable = pool.filter((it) => it.start !== null && it.end !== null);
    }
  }
  
  return shuffle(usable).slice(0, count);
}

// Genera opciones múltiple-choice para el término SNOMED CT correcto,
// mezclando con distractores de la misma categoría cuando sea posible.
export function buildTermOptions(item: QuizItem, allItems: QuizItem[] = quizData, n = 4): string[] {
  const sameCat = allItems.filter((it) => it.cat === item.cat && it.term !== item.term);
  const distractorTerms = Array.from(new Set(sameCat.map((it) => it.term)));
  const otherTerms = Array.from(
    new Set(allItems.filter((it) => it.term !== item.term).map((it) => it.term))
  );
  const pool = distractorTerms.length >= n - 1 ? distractorTerms : otherTerms;
  const distractors = shuffle(pool).slice(0, n - 1);
  return shuffle([item.term, ...distractors]);
}