import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";

export const GEMINI_QUOTA_ERROR_CODE = "GEMINI_QUOTA_EXCEEDED";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string") return error;

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown Gemini API error";
  }
}

function isQuotaExceededError(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("\"code\":429") ||
    normalized.includes("resource_exhausted") ||
    normalized.includes("quota exceeded")
  );
}

export async function generateWithGemini(prompt: string): Promise<string> {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured. Set it in backend/.env to generate assignments.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text =
      (response as unknown as { text?: string }).text ??
      JSON.stringify(response);

    return text;
  } catch (error) {
    const message = extractErrorMessage(error);

    if (isQuotaExceededError(message)) {
      throw new Error(
        `${GEMINI_QUOTA_ERROR_CODE}: Gemini quota exceeded. Please wait and retry, or upgrade API quota.`,
      );
    }

    throw new Error(`Gemini generation failed: ${message}`);
  }
}
