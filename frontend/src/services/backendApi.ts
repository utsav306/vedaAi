import { io, Socket } from "socket.io-client";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

const DEMO_USER = {
  name: "Demo Teacher",
  email: "demo@vedaai.local",
  password: "DemoPass123!",
};

const TOKEN_KEY = "vedaai_demo_token";

export type AssignmentSummary = {
  _id: string;
  title: string;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt: string;
  pdf?: { status?: string };
};

export type GeneratedQuestion = {
  text: string;
  difficulty: "easy" | "moderate" | "hard";
  marks: number;
};

export type GeneratedSection = {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
};

export type AssignmentDetail = {
  _id: string;
  title: string;
  status: AssignmentStatus;
  inputSnapshot?: {
    subject?: string;
    className?: string;
    dueDate?: string;
    additionalInfo?: string;
  };
  generatedPaper?: {
    title: string;
    subject: string;
    className: string;
    studentInfoFields: string[];
    sections: GeneratedSection[];
  };
  pdf?: {
    status?: string;
    path?: string;
    generatedAt?: string;
  };
  error?: {
    message?: string;
  };
};

export type AssignmentStatus =
  | "queued"
  | "generating"
  | "generated"
  | "pdf_generating"
  | "completed"
  | "failed";

export type GenerateAssignmentPayload = {
  title?: string;
  subject: string;
  className: string;
  dueDate?: string;
  additionalInfo?: string;
  questionTypes: Array<{
    type: string;
    count: number;
    marks: number;
  }>;
  file?: {
    originalName: string;
    mimeType?: string;
    sizeBytes?: number;
  };
};

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

async function authRequest(path: string, body: Record<string, unknown>): Promise<{ token: string }> {
  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Auth failed (${response.status})`);
  }

  return response.json() as Promise<{ token: string }>;
}

export async function ensureDemoToken(): Promise<string> {
  const existing = getStoredToken();
  if (existing) return existing;

  try {
    const login = await authRequest("/api/v1/auth/login", {
      email: DEMO_USER.email,
      password: DEMO_USER.password,
    });
    setStoredToken(login.token);
    return login.token;
  } catch {
    await authRequest("/api/v1/auth/register", DEMO_USER);
    const login = await authRequest("/api/v1/auth/login", {
      email: DEMO_USER.email,
      password: DEMO_USER.password,
    });
    setStoredToken(login.token);
    return login.token;
  }
}

async function authedRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await ensureDemoToken();
  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(payload.message ?? `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function listAssignments(): Promise<AssignmentSummary[]> {
  return authedRequest<AssignmentSummary[]>("/api/v1/assignments");
}

export async function getAssignmentById(id: string): Promise<AssignmentDetail> {
  return authedRequest<AssignmentDetail>(`/api/v1/assignments/${id}`);
}

export async function deleteAssignment(id: string): Promise<void> {
  await authedRequest<void>(`/api/v1/assignments/${id}`, {
    method: "DELETE",
  });
}

export async function generateAssignment(payload: GenerateAssignmentPayload): Promise<{ assignmentId: string }> {
  return authedRequest<{ assignmentId: string }>("/api/v1/assignments/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAssignmentPdfDownloadUrl(id: string): string {
  return `${BACKEND_BASE_URL}/api/v1/assignments/${id}/pdf/download`;
}

export async function downloadAssignmentPdf(id: string): Promise<void> {
  const token = await ensureDemoToken();
  const response = await fetch(getAssignmentPdfDownloadUrl(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(payload.message ?? `Download failed (${response.status})`);
  }

  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = `assignment-${id}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(downloadUrl);
}

export async function createRealtimeSocket(): Promise<Socket> {
  const token = await ensureDemoToken();
  return io(BACKEND_BASE_URL, {
    auth: { token },
    transports: ["websocket"],
  });
}
