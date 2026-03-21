"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import {
  createRealtimeSocket,
  downloadAssignmentPdf,
  getAssignmentById,
  type AssignmentDetail,
} from "@/services/backendApi";

function prettyStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AssignmentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const loadAssignment = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const data = await getAssignmentById(id);
      setAssignment(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load assignment";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadAssignment();
  }, [loadAssignment]);

  useEffect(() => {
    if (!id) return;

    let cleanup: (() => void) | undefined;
    void createRealtimeSocket()
      .then((socket) => {
        const onUpdate = (event: { assignmentId?: string }) => {
          if (event.assignmentId === id) {
            void loadAssignment();
          }
        };

        socket.emit("assignment:join", id);
        socket.on("assignment.status.updated", onUpdate);
        socket.on("assignment.generation.progress", onUpdate);
        socket.on("assignment.pdf.ready", onUpdate);
        socket.on("assignment.failed", onUpdate);

        cleanup = () => {
          socket.emit("assignment:leave", id);
          socket.off("assignment.status.updated", onUpdate);
          socket.off("assignment.generation.progress", onUpdate);
          socket.off("assignment.pdf.ready", onUpdate);
          socket.off("assignment.failed", onUpdate);
          socket.disconnect();
        };
      })
      .catch(() => undefined);

    return () => cleanup?.();
  }, [id, loadAssignment]);

  const totalMarks = useMemo(() => {
    const sections = assignment?.generatedPaper?.sections ?? [];
    return sections.reduce(
      (marksAcc, section) =>
        marksAcc + section.questions.reduce((questionAcc, question) => questionAcc + question.marks, 0),
      0,
    );
  }, [assignment]);

  const handleDownloadPdf = async () => {
    if (!id || isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadAssignmentPdf(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Download failed";
      setError(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-transparent p-2 pb-24 md:pb-2">
      <section className="mx-auto flex h-full max-w-[1700px] gap-2.5 rounded-xl bg-transparent p-2">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-transparent p-2">
          <div className="shrink-0">
            <Navbar />
          </div>

          <section className="mt-2 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[#D6D6D6] bg-[#DEDEDE] p-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="mb-3 flex items-center gap-2">
              <Link
                href="/assignment"
                className="grid h-8 w-8 place-items-center rounded-full bg-[#EFEFEF] text-[#2f2f2f] transition hover:bg-[#e6e6e6]"
                aria-label="Back to assignments"
              >
                <ArrowLeft size={16} />
              </Link>
              <span className="text-[14px] text-[#7A7A7A]">{assignment?.title ?? "Assignment Detail"}</span>
            </div>

            <div className="rounded-3xl bg-[#252628] p-4 text-white">
              {loading ? (
                <p className="text-[14px]">Loading assignment...</p>
              ) : error ? (
                <div>
                  <p className="text-[14px] text-[#FFD2D2]">{error}</p>
                  <button
                    onClick={() => {
                      setLoading(true);
                      void loadAssignment();
                    }}
                    className="mt-3 rounded-full bg-white px-4 py-1.5 text-[12px] font-medium text-[#1F1F1F]"
                  >
                    Retry
                  </button>
                </div>
              ) : assignment ? (
                <div>
                  <p className="text-[14px] leading-6">
                    Status: <span className="font-semibold">{prettyStatus(assignment.status)}</span>
                  </p>
                  {assignment.error?.message ? <p className="mt-2 text-[13px] text-[#FFD2D2]">{assignment.error.message}</p> : null}
                  <button
                    onClick={handleDownloadPdf}
                    disabled={assignment.pdf?.status !== "ready" || isDownloading}
                    className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[12px] font-medium text-[#1F1F1F] transition hover:bg-[#F1F1F1] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Download size={14} />
                    {isDownloading ? "Downloading..." : "Download as PDF"}
                  </button>
                </div>
              ) : null}
            </div>

            {assignment?.generatedPaper ? (
              <article className="mt-3 rounded-3xl bg-[#F6F6F6] p-6 text-[#2F2F2F]">
                <header className="text-center">
                  <h1 className="text-[40px] font-semibold leading-none">{assignment.generatedPaper.title || "Generated Question Paper"}</h1>
                  <p className="mt-2 text-[30px] font-medium">Subject: {assignment.generatedPaper.subject}</p>
                  <p className="text-[30px] font-medium">Class: {assignment.generatedPaper.className}</p>
                </header>

                <div className="mt-5 flex items-center justify-between text-[18px] font-medium">
                  <p>Total Sections: {assignment.generatedPaper.sections.length}</p>
                  <p>Total Marks: {totalMarks}</p>
                </div>

                <div className="mt-8 space-y-1 text-[17px]">
                  {assignment.generatedPaper.studentInfoFields.map((field) => (
                    <p key={field}>{field}: __________________</p>
                  ))}
                </div>

                {assignment.generatedPaper.sections.map((section, sectionIndex) => (
                  <section key={`${section.title}-${sectionIndex}`} className="mt-10">
                    <h2 className="text-center text-[34px] font-semibold">{section.title}</h2>
                    <p className="mt-2 text-[16px] italic text-[#666666]">{section.instruction}</p>

                    <ol className="mt-5 space-y-4 pl-6 text-[17px] leading-7">
                      {section.questions.map((question, questionIndex) => (
                        <li key={`${question.text}-${questionIndex}`}>
                          <p>{question.text}</p>
                          <p className="text-[13px] text-[#6A6A6A]">
                            Difficulty: {question.difficulty} | Marks: {question.marks}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </article>
            ) : !loading && !error ? (
              <div className="mt-3 rounded-2xl border border-dashed border-[#C8C8C8] bg-[#E4E4E4] px-4 py-10 text-center text-[14px] text-[#727272]">
                Generated paper is not ready yet. This page will auto-refresh when processing completes.
              </div>
            ) : null}
          </section>
        </div>
      </section>
      <MobileBottomNav />
    </main>
  );
}
