import { Worker } from "bullmq";
import { bullConnection } from "../queue/connection";
import { QUEUE_NAMES } from "../queue/queues";
import { AssignmentModel } from "../db/models/Assignment";
import { JobAuditModel } from "../db/models/JobAudit";
import { generatePdfFromPaper } from "../services/pdfRenderer";
import { publishRealtimeEvent } from "../services/realtimeEvents";
import { deleteCacheByPrefix } from "../services/cache";

export const pdfWorker = new Worker(
  QUEUE_NAMES.pdf,
  async (job) => {
    const { assignmentId } = job.data as { assignmentId: string };

    const assignment = await AssignmentModel.findById(assignmentId);
    if (!assignment) {
      throw new Error("Assignment not found for PDF generation");
    }

    await JobAuditModel.findOneAndUpdate(
      { bullJobId: job.id?.toString(), queueName: QUEUE_NAMES.pdf },
      { state: "active", startedAt: new Date(), attemptsMade: job.attemptsMade },
      { upsert: true },
    );

    if (!assignment.generatedPaper?.sections?.length) {
      throw new Error("Generated paper is missing; cannot create PDF");
    }

    assignment.status = "pdf_generating";
    assignment.pdf = { ...assignment.pdf, status: "generating" };
    await assignment.save();
    await deleteCacheByPrefix(`assignments:list:${assignment.userId.toString()}`);
    await deleteCacheByPrefix(`assignments:detail:${assignment.userId.toString()}:${assignmentId}`);

    const pdfPath = await generatePdfFromPaper(assignmentId, assignment.generatedPaper as any);

    assignment.status = "completed";
    assignment.pdf = {
      status: "ready",
      path: pdfPath,
      generatedAt: new Date(),
    };
    await assignment.save();
    await deleteCacheByPrefix(`assignments:list:${assignment.userId.toString()}`);
    await deleteCacheByPrefix(`assignments:detail:${assignment.userId.toString()}:${assignmentId}`);

    await JobAuditModel.findOneAndUpdate(
      { bullJobId: job.id?.toString(), queueName: QUEUE_NAMES.pdf },
      { state: "completed", finishedAt: new Date(), attemptsMade: job.attemptsMade },
      { upsert: true },
    );

    await publishRealtimeEvent({
      type: "assignment.pdf.ready",
      userId: assignment.userId.toString(),
      assignmentId,
      payload: { status: "completed", pdfPath },
    });
  },
  { connection: bullConnection },
);

pdfWorker.on("failed", async (job, error) => {
  const assignmentId = (job?.data as { assignmentId?: string } | undefined)?.assignmentId;
  if (!assignmentId) return;

  const assignment = await AssignmentModel.findById(assignmentId);
  if (!assignment) return;

  assignment.status = "failed";
  assignment.pdf = { ...assignment.pdf, status: "failed" };
  assignment.error = { message: error.message, code: "PDF_FAILED" };
  await assignment.save();
  await deleteCacheByPrefix(`assignments:list:${assignment.userId.toString()}`);
  await deleteCacheByPrefix(`assignments:detail:${assignment.userId.toString()}:${assignmentId}`);

  await JobAuditModel.findOneAndUpdate(
    { bullJobId: job?.id?.toString(), queueName: QUEUE_NAMES.pdf },
    {
      state: "failed",
      finishedAt: new Date(),
      attemptsMade: job?.attemptsMade ?? 0,
      errorMessage: error.message,
    },
    { upsert: true },
  );

  await publishRealtimeEvent({
    type: "assignment.failed",
    userId: assignment.userId.toString(),
    assignmentId,
    payload: { status: "failed", message: error.message },
  });
});
