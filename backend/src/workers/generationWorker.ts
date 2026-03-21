import { Worker } from "bullmq";
import mongoose from "mongoose";
import { bullConnection } from "../queue/connection";
import { QUEUE_NAMES, pdfQueue } from "../queue/queues";
import { AssignmentModel } from "../db/models/Assignment";
import { JobAuditModel } from "../db/models/JobAudit";
import { buildGenerationPrompt } from "../services/promptBuilder";
import { GEMINI_QUOTA_ERROR_CODE, generateWithGemini } from "../services/geminiClient";
import { normalizeGeneratedPaper } from "../services/normalizePaper";
import { publishRealtimeEvent } from "../services/realtimeEvents";
import { env } from "../config/env";
import { GenerateAssignmentInput } from "../modules/assignments/validation";
import { deleteCacheByPrefix } from "../services/cache";

export const generationWorker = new Worker(
  QUEUE_NAMES.generation,
  async (job) => {
    const { assignmentId } = job.data as { assignmentId: string };
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw new Error("Invalid assignment id in job payload");
    }

    const assignment = await AssignmentModel.findById(assignmentId);
    if (!assignment) {
      throw new Error("Assignment not found");
    }

    await JobAuditModel.findOneAndUpdate(
      { bullJobId: job.id?.toString(), queueName: QUEUE_NAMES.generation },
      { state: "active", startedAt: new Date(), attemptsMade: job.attemptsMade },
      { upsert: true },
    );

    assignment.status = "generating";
    assignment.error = undefined;
    await assignment.save();
    await deleteCacheByPrefix(`assignments:list:${assignment.userId.toString()}`);
    await deleteCacheByPrefix(`assignments:detail:${assignment.userId.toString()}:${assignmentId}`);

    await publishRealtimeEvent({
      type: "assignment.generation.progress",
      userId: assignment.userId.toString(),
      assignmentId,
      payload: { status: "generating", progress: 20 },
    });

    const inputSnapshot = assignment.inputSnapshot as unknown as GenerateAssignmentInput;
    const prompt = buildGenerationPrompt({
      subject: inputSnapshot.subject ?? "General Science",
      className: inputSnapshot.className ?? "8th",
      questionTypes: inputSnapshot.questionTypes,
      dueDate: inputSnapshot.dueDate,
      additionalInfo: inputSnapshot.additionalInfo,
      file: inputSnapshot.file,
      title: assignment.title,
    });

    assignment.promptSnapshot = prompt;
    assignment.modelMeta = { provider: "gemini", model: env.GEMINI_MODEL };
    await assignment.save();

    const raw = await generateWithGemini(prompt);

    await publishRealtimeEvent({
      type: "assignment.generation.progress",
      userId: assignment.userId.toString(),
      assignmentId,
      payload: { status: "generating", progress: 65 },
    });

    const normalized = normalizeGeneratedPaper(raw);

    assignment.rawLlmResponse = raw;
    assignment.generatedPaper = normalized as any;
    assignment.status = "generated";
    assignment.pdf = { ...assignment.pdf, status: "queued" };
    await assignment.save();
    await deleteCacheByPrefix(`assignments:list:${assignment.userId.toString()}`);
    await deleteCacheByPrefix(`assignments:detail:${assignment.userId.toString()}:${assignmentId}`);

    await pdfQueue.add(
      "generate-pdf",
      { assignmentId },
      { attempts: 3, backoff: { type: "exponential", delay: 2000 }, removeOnComplete: true },
    );

    await JobAuditModel.findOneAndUpdate(
      { bullJobId: job.id?.toString(), queueName: QUEUE_NAMES.generation },
      { state: "completed", finishedAt: new Date(), attemptsMade: job.attemptsMade },
      { upsert: true },
    );

    await publishRealtimeEvent({
      type: "assignment.status.updated",
      userId: assignment.userId.toString(),
      assignmentId,
      payload: { status: "generated" },
    });
  },
  { connection: bullConnection },
);

generationWorker.on("failed", async (job, error) => {
  const assignmentId = (job?.data as { assignmentId?: string } | undefined)?.assignmentId;
  if (!assignmentId) return;

  const assignment = await AssignmentModel.findById(assignmentId);
  if (!assignment) return;

  const quotaExceeded = error.message.includes(GEMINI_QUOTA_ERROR_CODE);
  const safeMessage = quotaExceeded
    ? "Gemini quota exceeded. Please retry after some time or upgrade your Gemini API quota."
    : error.message;

  assignment.status = "failed";
  assignment.error = {
    message: safeMessage,
    code: quotaExceeded ? GEMINI_QUOTA_ERROR_CODE : "GENERATION_FAILED",
  };
  await assignment.save();
  await deleteCacheByPrefix(`assignments:list:${assignment.userId.toString()}`);
  await deleteCacheByPrefix(`assignments:detail:${assignment.userId.toString()}:${assignmentId}`);

  await JobAuditModel.findOneAndUpdate(
    { bullJobId: job?.id?.toString(), queueName: QUEUE_NAMES.generation },
    {
      state: "failed",
      finishedAt: new Date(),
      attemptsMade: job?.attemptsMade ?? 0,
      errorMessage: safeMessage,
    },
    { upsert: true },
  );

  await publishRealtimeEvent({
    type: "assignment.failed",
    userId: assignment.userId.toString(),
    assignmentId,
    payload: { status: "failed", message: safeMessage },
  });
});
