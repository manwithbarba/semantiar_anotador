import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rawDir = path.join(__dirname, "..", "rawdata");
const outDir = path.join(__dirname, "..", "src", "data");
mkdirSync(outDir, { recursive: true });

function normalize(s) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function findOffset(text, literal) {
  const lit = literal.trim();
  if (!lit) return null;
  let idx = text.indexOf(lit);
  if (idx !== -1) return { start: idx, end: idx + lit.length };

  const normText = normalize(text);
  const normLit = normalize(lit);
  idx = normText.indexOf(normLit);
  if (idx === -1) return null;

  let start = -1;
  let end = -1;
  let normPos = 0;
  let prevWasSpace = true;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const isSpace = /\s/.test(ch);
    let advances = false;
    if (isSpace) {
      if (!prevWasSpace) advances = true;
    } else {
      advances = true;
    }
    if (advances) {
      if (normPos === idx) start = i;
      if (normPos === idx + normLit.length - 1) end = i + 1;
      normPos++;
    }
    prevWasSpace = isSpace;
  }
  if (start !== -1 && end !== -1) return { start, end };
  return null;
}

const files = readdirSync(rawDir).filter((f) => f.endsWith(".json"));

let items = [];
let caseCount = 0;

for (const file of files) {
  const raw = JSON.parse(readFileSync(path.join(rawDir, file), "utf-8"));
  const annotator = file.replace("SEMANTIAR_anotado_", "").replace(".json", "");
  for (const c of raw.cases ?? []) {
    caseCount++;
    for (const [i, concept] of (c.concepts ?? []).entries()) {
      const offset = findOffset(c.text, concept.textoLiteral ?? "");
      items.push({
        id: `${c.id}__${i}`,
        caseId: c.id,
        annotator,
        text: c.text,
        literal: concept.textoLiteral,
        start: offset?.start ?? null,
        end: offset?.end ?? null,
        cat: concept.cat,
        sctid: concept.sctid,
        term: concept.term,
        pol: concept.pol,
        cert: concept.cert,
        temp: concept.temp,
        suj: concept.suj,
      });
    }
  }
}

items = items.filter((it) => it.literal && it.literal.trim().length > 0);

const withOffset = items.filter((it) => it.start !== null).length;

writeFileSync(
  path.join(outDir, "quiz-data.json"),
  JSON.stringify(items, null, 2),
  "utf-8"
);

console.log(`Casos procesados: ${caseCount}`);
console.log(`Conceptos totales: ${items.length}`);
console.log(`Con offset localizado: ${withOffset} (${((withOffset / items.length) * 100).toFixed(1)}%)`);