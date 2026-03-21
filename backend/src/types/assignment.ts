export type Difficulty = "easy" | "moderate" | "hard";

export type StudentInfoField = "Name" | "Roll Number" | "Section";

export type GeneratedQuestion = {
  text: string;
  difficulty: Difficulty;
  marks: number;
};

export type GeneratedSection = {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
};

export type GeneratedPaper = {
  title: string;
  subject: string;
  className: string;
  studentInfoFields: StudentInfoField[];
  sections: GeneratedSection[];
};

export type QuestionTypeInput = {
  type: string;
  count: number;
  marks: number;
};

export type AssignmentInputSnapshot = {
  subject?: string;
  className?: string;
  dueDate?: string;
  additionalInfo?: string;
  questionTypes: QuestionTypeInput[];
  file?: {
    originalName: string;
    mimeType?: string;
    sizeBytes?: number;
  };
};
