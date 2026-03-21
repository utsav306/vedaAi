export type Assignment = {
  id: string;
  title: string;
  createdAt: string;
  dueOn?: string;
  status: "queued" | "generating" | "generated" | "pdf_generating" | "completed" | "failed";
};
