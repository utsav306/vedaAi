import mongoose, { Schema, InferSchemaType } from "mongoose";

const generatedQuestionSchema = new Schema(
  {
    text: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "moderate", "hard"], required: true },
    marks: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const generatedSectionSchema = new Schema(
  {
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [generatedQuestionSchema], default: [] },
  },
  { _id: false },
);

const assignmentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    title: { type: String, default: "Generated Question Paper" },
    status: {
      type: String,
      enum: ["queued", "generating", "generated", "pdf_generating", "completed", "failed"],
      required: true,
      index: true,
    },
    inputSnapshot: {
      subject: { type: String },
      className: { type: String },
      dueDate: { type: String },
      additionalInfo: { type: String },
      questionTypes: {
        type: [
          {
            type: { type: String, required: true },
            count: { type: Number, required: true, min: 1 },
            marks: { type: Number, required: true, min: 1 },
          },
        ],
        default: [],
      },
      file: {
        originalName: { type: String },
        mimeType: { type: String },
        sizeBytes: { type: Number },
      },
    },
    promptSnapshot: { type: String },
    modelMeta: {
      provider: { type: String, default: "gemini" },
      model: { type: String },
    },
    generatedPaper: {
      title: { type: String },
      subject: { type: String },
      className: { type: String },
      studentInfoFields: { type: [String], default: ["Name", "Roll Number", "Section"] },
      sections: { type: [generatedSectionSchema], default: [] },
    },
    rawLlmResponse: { type: String },
    pdf: {
      status: {
        type: String,
        enum: ["not_started", "queued", "generating", "ready", "failed"],
        default: "not_started",
      },
      path: { type: String },
      generatedAt: { type: Date },
    },
    error: {
      message: { type: String },
      code: { type: String },
    },
  },
  { timestamps: true },
);

export type AssignmentDocument = InferSchemaType<typeof assignmentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AssignmentModel =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
