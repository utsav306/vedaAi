import { GenerateAssignmentInput } from "../modules/assignments/validation";

export function buildGenerationPrompt(input: GenerateAssignmentInput): string {
  const questionTypeLines = input.questionTypes
    .map((item, index) => `${index + 1}. ${item.type} | count=${item.count} | marks=${item.marks}`)
    .join("\n");

  return [
    "You are an expert question paper generator.",
    "Return strict JSON only. Do not include markdown.",
    "Schema:",
    "{",
    "  \"title\": string,",
    "  \"subject\": string,",
    "  \"className\": string,",
    "  \"studentInfoFields\": [\"Name\",\"Roll Number\",\"Section\"],",
    "  \"sections\": [",
    "    {",
    "      \"title\": string,",
    "      \"instruction\": string,",
    "      \"questions\": [",
    "        { \"text\": string, \"difficulty\": \"easy\"|\"moderate\"|\"hard\", \"marks\": number }",
    "      ]",
    "    }",
    "  ]",
    "}",
    "Constraints:",
    `- Subject: ${input.subject}`,
    `- Class: ${input.className}`,
    "- Include sections like Section A, Section B based on question types.",
    "- Match marks and counts from requested types as closely as possible.",
    input.additionalInfo ? `- Additional info: ${input.additionalInfo}` : "",
    "Question type requests:",
    questionTypeLines,
  ]
    .filter(Boolean)
    .join("\n");
}
