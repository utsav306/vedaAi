"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, MoreVertical, Plus, Search } from "lucide-react";
import type { Assignment } from "../types";
import EmptyState from "@/components/EmptyState";

type AssignmentsContentProps = {
  assignments: Assignment[];
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  onDelete?: (assignmentId: string) => Promise<void>;
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function toStatusLabel(status: Assignment["status"]): string {
  if (status === "pdf_generating") return "PDF Generating";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function AssignmentsContent({
  assignments,
  isLoading = false,
  errorMessage = null,
  onRetry,
  onDelete,
}: AssignmentsContentProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteClick = async (assignmentId: string) => {
    if (!onDelete || deletingId === assignmentId) return;

    const confirmed = window.confirm("Delete this assignment permanently? This action cannot be undone.");
    if (!confirmed) return;

    try {
      setDeleteError(null);
      setDeletingId(assignmentId);
      await onDelete(assignmentId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete assignment";
      setDeleteError(message);
    } finally {
      setDeletingId(null);
      setOpenMenuId(null);
    }
  };

  const filteredAssignments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return assignments;
    return assignments.filter((item) =>
      item.title.toLowerCase().includes(normalizedQuery),
    );
  }, [assignments, query]);
  const hasAssignments = assignments.length > 0;

  return (
    <section className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#D7D7D7] bg-transparent">
      <div className="border-b border-[#D2D2D2] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#65C588]" />
          <h2 className="text-[24px] font-semibold text-[#2D2D2D]">
            Assignments
          </h2>
        </div>
        <p className="mt-0.5 text-[12px] text-[#7D7D7D]">
          Manage and create assignments for your classes.
        </p>
      </div>

      {hasAssignments ? (
        <div className="mx-3 flex items-center justify-between gap-3 rounded-2xl border-b border-[#D2D2D2] bg-white px-3 py-2.5">
          <button className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-[#8A8A8A] transition hover:bg-[#F3F3F3]">
            <Filter size={14} />
            <span>Filter By</span>
          </button>

          <label className="flex h-10 w-full max-w-[260px] items-center gap-2 rounded-full border border-[#CFCFCF] px-3 text-[#8A8A8A] focus-within:border-[#BDBDBD]">
            <Search size={14} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Assignment"
              className="w-full bg-transparent text-[13px] text-[#5A5A5A] outline-none placeholder:text-[#9A9A9A]"
            />
          </label>
        </div>
      ) : null}

      <div className="relative min-h-0 flex-1">
        <div className="h-full overflow-y-auto px-2.5 pb-24 pt-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {deleteError ? (
            <div className="mb-2.5 rounded-xl border border-[#D7B5B5] bg-[#FBEFEF] px-3 py-2 text-[13px] text-[#8E4E4E]">
              {deleteError}
            </div>
          ) : null}
          {isLoading ? (
            <div className="grid h-full place-items-center rounded-xl border border-dashed border-[#C8C8C8] bg-[#E4E4E4] px-4 text-center text-[14px] text-[#727272]">
              Loading assignments...
            </div>
          ) : errorMessage ? (
            <div className="grid h-full place-items-center rounded-xl border border-dashed border-[#D7B5B5] bg-[#FBEFEF] px-4 text-center text-[14px] text-[#8E4E4E]">
              <div>
                <p>{errorMessage}</p>
                {onRetry ? (
                  <button
                    onClick={onRetry}
                    className="mt-3 rounded-full bg-[#202124] px-4 py-1.5 text-[12px] text-white"
                  >
                    Retry
                  </button>
                ) : null}
              </div>
            </div>
          ) : assignments.length === 0 ? (
            <EmptyState />
          ) : filteredAssignments.length === 0 ? (
            <div className="grid h-full place-items-center rounded-xl border border-dashed border-[#C8C8C8] bg-[#E4E4E4] px-4 text-center text-[14px] text-[#727272]">
              No assignments match this search.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 xl:grid-cols-2">
              {filteredAssignments.map((assignment) => (
                <article
                  key={assignment.id}
                  onClick={() => router.push(`/assignment/${assignment.id}`)}
                  className="relative cursor-pointer rounded-3xl bg-[#F7F7F7] px-5 py-4 shadow-[0_4px_12px_-10px_rgba(0,0,0,0.25)] transition hover:bg-[#F2F2F2]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[22px] font-semibold tracking-[-0.01em] text-[#2D2D2D]">
                      {assignment.title}
                    </h3>

                    <div className="relative">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenMenuId((current) =>
                            current === assignment.id ? null : assignment.id,
                          );
                        }}
                        className="grid h-8 w-8 place-items-center rounded-full text-[#9A9A9A] transition hover:bg-[#ECECEC]"
                        aria-label="Card actions"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openMenuId === assignment.id ? (
                        <div className="absolute right-0 top-9 z-20 w-[126px] rounded-xl border border-[#E5E5E5] bg-white p-1.5 text-[13px] shadow-md">
                          <Link
                            href={`/assignment/${assignment.id}`}
                            onClick={(event) => event.stopPropagation()}
                            className="block rounded-lg px-2.5 py-1.5 text-[#474747] transition hover:bg-[#F4F4F4]"
                          >
                            View Assignment
                          </Link>
                          {onDelete ? (
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                void handleDeleteClick(assignment.id);
                              }}
                              disabled={deletingId === assignment.id}
                              className="block w-full rounded-lg px-2.5 py-1.5 text-left text-[#A33D3D] transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingId === assignment.id ? "Deleting..." : "Delete Assignment"}
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between text-[13px] text-[#8B8B8B]">
                    <p>
                      <span className="font-semibold text-[#303030]">
                        Created :
                      </span>{" "}
                      {formatDate(assignment.createdAt)}
                    </p>
                    <p className="rounded-full bg-[#ECECEC] px-2.5 py-1 text-[11px] font-semibold text-[#464646]">
                      {toStatusLabel(assignment.status)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {hasAssignments ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
            <div className="h-20 bg-gradient-to-t from-[#DEDEDE]/90 via-[#DEDEDE]/70 to-transparent backdrop-blur-[2px]" />
            <div className="absolute inset-x-0 bottom-0 flex justify-center px-3 pb-3">
              <div className="pointer-events-auto rounded-full  p-1  backdrop-blur-xl">
                <Link
                  href="/assignment/new"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-[#18191B] px-6 text-white transition hover:brightness-110"
                >
                  <Plus size={15} />
                  <span className="text-[14px] font-medium">
                    Create Assignment
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
