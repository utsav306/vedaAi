import { z } from "zod";
import { GeneratedPaper } from "../types/assignment";

const generatedPaperSchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  className: z.string().min(1),
  studentInfoFields: z.array(z.enum(["Name", "Roll Number", "Section"]))
    .min(1)
    .default(["Name", "Roll Number", "Section"]),
  sections: z.array(
    z.object({
      title: z.string().min(1),
      instruction: z.string().min(1),
      questions: z.array(
        z.object({
          text: z.string().min(1),
          difficulty: z.enum(["easy", "moderate", "hard"]),
          marks: z.coerce.number().int().min(1),
        }),
      ),
    }),
  ).min(1),
});

function extractJson(raw: string): string {
  const fenceMatch = raw.match(/```json\s*([\s\S]*?)```/i);
  if (fenceMatch?.[1]) return fenceMatch[1].trim();
  return raw.trim();
}

function extractJsonObject(raw: string): string {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return raw.slice(start, end + 1);
  }
  return raw;
}

function isHex(char: string): boolean {
  return /^[0-9a-fA-F]$/.test(char);
}

function repairInvalidEscapes(raw: string): string {
  let output = "";
  let inString = false;
  let i = 0;

  while (i < raw.length) {
    const ch = raw[i];

    if (ch === '"' && (i === 0 || raw[i - 1] !== "\\")) {
      inString = !inString;
      output += ch;
      i += 1;
      continue;
    }

    if (inString && ch === "\\") {
      const next = raw[i + 1] ?? "";

      // Valid one-char JSON escapes.
      if (`"\\/bfnrt`.includes(next)) {
        output += ch + next;
        i += 2;
        continue;
      }

      // Valid unicode escape: \uXXXX
      if (
        next === "u" &&
        isHex(raw[i + 2] ?? "") &&
        isHex(raw[i + 3] ?? "") &&
        isHex(raw[i + 4] ?? "") &&
        isHex(raw[i + 5] ?? "")
      ) {
        output += raw.slice(i, i + 6);
        i += 6;
        continue;
      }

      // Invalid escape sequence: preserve char, but escape backslash itself.
      output += "\\\\";
      i += 1;
      continue;
    }

    output += ch;
    i += 1;
  }

  return output;
}

function tryParseJson(candidate: string): unknown {
  const attempts = [
    candidate,
    extractJsonObject(candidate),
    repairInvalidEscapes(candidate),
    repairInvalidEscapes(extractJsonObject(candidate)),
  ];

  let lastError: unknown;
  for (const attempt of attempts) {
    try {
      return JSON.parse(attempt);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export function normalizeGeneratedPaper(raw: string): GeneratedPaper {
  const candidate = extractJson(raw);
  const parsedJson = tryParseJson(candidate);
  return generatedPaperSchema.parse(parsedJson);
}
