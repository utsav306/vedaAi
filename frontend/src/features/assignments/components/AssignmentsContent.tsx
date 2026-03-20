"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Filter, MoreVertical, Plus, Search } from "lucide-react";
import type { Assignment } from "../types";

type AssignmentsContentProps = {
  assignments: Assignment[];
};

export default function AssignmentsContent({
  assignments,
}: AssignmentsContentProps) {
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredAssignments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return assignments;
    return assignments.filter((item) =>
      item.title.toLowerCase().includes(normalizedQuery),
    );
  }, [assignments, query]);

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

      <div className="relative min-h-0 flex-1">
        <div className="h-full overflow-y-auto px-2.5 pb-24 pt-2.5">
          {filteredAssignments.length === 0 ? (
            <div className="grid h-full place-items-center rounded-xl border border-dashed border-[#C8C8C8] bg-[#E4E4E4] px-4 text-center text-[14px] text-[#727272]">
              No assignments match this search.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 xl:grid-cols-2">
              {filteredAssignments.map((assignment) => (
                <article
                  key={assignment.id}
                  className="relative rounded-3xl bg-[#F7F7F7] px-5 py-4 shadow-[0_4px_12px_-10px_rgba(0,0,0,0.25)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[22px] font-semibold tracking-[-0.01em] text-[#2D2D2D]">
                      {assignment.title}
                    </h3>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId((current) =>
                            current === assignment.id ? null : assignment.id,
                          )
                        }
                        className="grid h-8 w-8 place-items-center rounded-full text-[#9A9A9A] transition hover:bg-[#ECECEC]"
                        aria-label="Card actions"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openMenuId === assignment.id ? (
                        <div className="absolute right-0 top-9 z-20 w-[126px] rounded-xl border border-[#E5E5E5] bg-white p-1.5 text-[13px] shadow-md">
                          <Link
                            href={`/assignment/${assignment.id}`}
                            className="block rounded-lg px-2.5 py-1.5 text-[#474747] transition hover:bg-[#F4F4F4]"
                          >
                            View Assignment
                          </Link>
                          <button className="mt-1 block w-full rounded-lg px-2.5 py-1.5 text-left text-[#E06A6A] transition hover:bg-[#FFF1F1]">
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between text-[13px] text-[#8B8B8B]">
                    <p>
                      <span className="font-semibold text-[#303030]">
                        Assigned on :
                      </span>{" "}
                      {assignment.assignedOn}
                    </p>
                    <p>
                      <span className="font-semibold text-[#303030]">
                        Due :
                      </span>{" "}
                      {assignment.dueOn}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

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
      </div>
    </section>
  );
}
