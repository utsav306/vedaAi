import { Queue } from "bullmq";
import { bullConnection } from "./connection";

export const QUEUE_NAMES = {
  generation: "question-generation",
  pdf: "pdf-generation",
} as const;

export const generationQueue = new Queue(QUEUE_NAMES.generation, {
  connection: bullConnection,
});

export const pdfQueue = new Queue(QUEUE_NAMES.pdf, {
  connection: bullConnection,
});
