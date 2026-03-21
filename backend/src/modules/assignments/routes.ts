import { Router } from "express";
import mongoose from "mongoose";
import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { AssignmentModel } from "../../db/models/Assignment";
import { JobAuditModel } from "../../db/models/JobAudit";
import { requireAuth, AuthenticatedRequest } from "../../middleware/requireAuth";
import { HttpError } from "../../middleware/errorHandler";
import { generationQueue } from "../../queue/queues";
import { generateAssignmentSchema } from "./validation";
import { publishRealtimeEvent } from "../../services/realtimeEvents";
import { deleteCacheByPrefix, getJsonCache, setJsonCache } from "../../services/cache";

const assignmentsRouter = Router();

assignmentsRouter.use(requireAuth);

assignmentsRouter.post("/generate", async (req: AuthenticatedRequest, res) => {
  const input = generateAssignmentSchema.parse(req.body);
  const userId = req.auth!.userId;

  const assignment = await AssignmentModel.create({
    userId,
    title: input.title ?? "Generated Question Paper",
    status: "queued",
    inputSnapshot: {
      subject: input.subject,
      className: input.className,
      dueDate: input.dueDate,
      additionalInfo: input.additionalInfo,
      questionTypes: input.questionTypes,
      file: input.file,
    },
    pdf: { status: "queued" },
  });

  const job = await generationQueue.add(
    "generate-assignment",
    { assignmentId: assignment._id.toString() },
    { attempts: 1, backoff: { type: "exponential", delay: 2000 }, removeOnComplete: true },
  );

  await JobAuditModel.create({
    assignmentId: assignment._id,
    queueName: "question-generation",
    bullJobId: job.id?.toString() ?? "unknown",
    state: "queued",
  });

  await publishRealtimeEvent({
    type: "assignment.status.updated",
    userId,
    assignmentId: assignment._id.toString(),
    payload: { status: "queued" },
  });

  await deleteCacheByPrefix(`assignments:list:${userId}:`);

  res.status(202).json({
    assignmentId: assignment._id,
    jobId: job.id,
    status: assignment.status,
  });
});

assignmentsRouter.get("/", async (req: AuthenticatedRequest, res) => {
  const userId = req.auth!.userId;
  const cacheKey = `assignments:list:${userId}`;

  const cached = await getJsonCache<unknown[]>(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  const assignments = await AssignmentModel.find({ userId })
    .sort({ createdAt: -1 })
    .select("title status createdAt updatedAt pdf.status");

  await setJsonCache(cacheKey, assignments, 30);
  res.json(assignments);
});

assignmentsRouter.get("/:id", async (req: AuthenticatedRequest, res) => {
  const userId = req.auth!.userId;
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const cacheKey = `assignments:detail:${userId}:${id}`;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError(400, "Invalid assignment id", "INVALID_ID");
  }

  const cached = await getJsonCache<unknown>(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  const assignment = await AssignmentModel.findOne({ _id: id, userId });
  if (!assignment) {
    throw new HttpError(404, "Assignment not found", "ASSIGNMENT_NOT_FOUND");
  }

  await setJsonCache(cacheKey, assignment, 30);
  res.json(assignment);
});

assignmentsRouter.get("/:id/pdf", async (req: AuthenticatedRequest, res) => {
  const userId = req.auth!.userId;
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const assignment = await AssignmentModel.findOne({ _id: id, userId }).select("status pdf");
  if (!assignment) {
    throw new HttpError(404, "Assignment not found", "ASSIGNMENT_NOT_FOUND");
  }

  res.json({
    assignmentId: assignment._id,
    status: assignment.status,
    pdf: assignment.pdf,
  });
});

assignmentsRouter.get("/:id/pdf/download", async (req: AuthenticatedRequest, res) => {
  const userId = req.auth!.userId;
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const assignment = await AssignmentModel.findOne({ _id: id, userId }).select("pdf.path");
  if (!assignment) {
    throw new HttpError(404, "Assignment not found", "ASSIGNMENT_NOT_FOUND");
  }

  const pdfPath = assignment.pdf?.path;
  if (!pdfPath || !existsSync(pdfPath)) {
    throw new HttpError(404, "PDF not generated yet", "PDF_NOT_READY");
  }

  res.download(pdfPath);
});

assignmentsRouter.delete("/:id", async (req: AuthenticatedRequest, res) => {
  const userId = req.auth!.userId;
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError(400, "Invalid assignment id", "INVALID_ID");
  }

  const assignment = await AssignmentModel.findOne({ _id: id, userId }).select("pdf.path");
  if (!assignment) {
    throw new HttpError(404, "Assignment not found", "ASSIGNMENT_NOT_FOUND");
  }

  const pdfPath = assignment.pdf?.path;
  await AssignmentModel.deleteOne({ _id: id, userId });
  await JobAuditModel.deleteMany({ assignmentId: id });

  await deleteCacheByPrefix(`assignments:list:${userId}`);
  await deleteCacheByPrefix(`assignments:detail:${userId}:${id}`);

  if (pdfPath && existsSync(pdfPath)) {
    await unlink(pdfPath).catch(() => undefined);
  }

  res.status(204).send();
});

export { assignmentsRouter };
