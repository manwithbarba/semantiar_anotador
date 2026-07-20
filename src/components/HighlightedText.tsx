"use client";

import type { QuizItem } from "@/lib/types";

export function HighlightedText({ item, fontClass = "" }: { item: QuizItem; fontClass?: string }) {
  if (item.start === null || item.end === null) {
    return <p className={`whitespace-pre-wrap leading-relaxed text-lg ${fontClass}`}>{item.text}</p>;
  }
  const before = item.text.slice(0, item.start);
  const mid = item.text.slice(item.start, item.end);
  const after = item.text.slice(item.end);
  return (
    <p className={`whitespace-pre-wrap leading-relaxed text-lg ${fontClass}`}>
      {before}
      <mark className="bg-amber-300/70 dark:bg-amber-500/40 rounded px-1 font-semibold text-inherit">
        {mid}
      </mark>
      {after}
    </p>
  );
}