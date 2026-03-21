import mongoose, { Schema, InferSchemaType } from "mongoose";

const jobAuditSchema = new Schema(
  {
    assignmentId: { type: Schema.Types.ObjectId, required: true, ref: "Assignment", index: true },
    queueName: { type: String, required: true },
    bullJobId: { type: String, required: true, index: true },
    state: {
      type: String,
      enum: ["queued", "active", "completed", "failed"],
      default: "queued",
      index: true,
    },
    attemptsMade: { type: Number, default: 0 },
    errorMessage: { type: String },
    startedAt: { type: Date },
    finishedAt: { type: Date },
  },
  { timestamps: true },
);

export type JobAuditDocument = InferSchemaType<typeof jobAuditSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const JobAuditModel = mongoose.models.JobAudit || mongoose.model("JobAudit", jobAuditSchema);
