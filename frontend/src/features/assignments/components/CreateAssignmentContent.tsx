"use client";

import { useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Minus,
  Plus,
  Upload,
  X,
} from "lucide-react";

type QuestionRow = {
  id: string;
  type: string;
  count: number;
  marks: number;
};

const defaultRows: QuestionRow[] = [
  { id: "q1", type: "Multiple Choice Questions", count: 4, marks: 1 },
  { id: "q2", type: "Short Questions", count: 5, marks: 2 },
  { id: "q3", type: "Diagram/Graph-Based Questions", count: 5, marks: 5 },
  { id: "q4", type: "Numerical Problems", count: 5, marks: 5 },
];

const questionTypeOptions = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Long Answer Questions",
  "Case Study Questions",
];

export default function CreateAssignmentContent() {
  const [dueDate, setDueDate] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [rows, setRows] = useState<QuestionRow[]>(defaultRows);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);

  const totalQuestions = useMemo(
    () => rows.reduce((acc, row) => acc + row.count, 0),
    [rows],
  );
  const totalMarks = useMemo(
    () => rows.reduce((acc, row) => acc + row.count * row.marks, 0),
    [rows],
  );

  const updateRow = (id: string, updater: (row: QuestionRow) => QuestionRow) => {
    setRows((currentRows) =>
      currentRows.map((row) => (row.id === id ? updater(row) : row)),
    );
  };

  const removeRow = (id: string) => {
    setRows((currentRows) => currentRows.filter((row) => row.id !== id));
  };

  const addRow = () => {
    const id = `q${rows.length + 1}-${Date.now()}`;
    setRows((currentRows) => [
      ...currentRows,
      {
        id,
        type: "Long Answer Questions",
        count: 1,
        marks: 1,
      },
    ]);
  };

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  const onPickFile = () => hiddenFileInputRef.current?.click();

  const onFileSelected = (file: File | null) => {
    if (!file) return;
    setAttachedFileName(file.name);
    setIsUploadModalOpen(false);
  };

  return (
    <>
      <section className="mt-2 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[#D6D6D6] bg-[#DEDEDE] px-4 pb-4 pt-3">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#65C588]" />
          <h2 className="text-[24px] font-semibold text-[#2D2D2D]">
            Create Assignment
          </h2>
        </div>
        <p className="mb-5 text-[12px] text-[#808080]">
          Set up a new assignment for your students.
        </p>

        <div className="mb-5 h-[3px] w-full rounded-full bg-[#D0D0D0]">
          <div className="h-full w-1/2 rounded-full bg-[#6A6A6A]" />
        </div>

        <div className="rounded-3xl bg-[#EEEEEE] p-4">
          <h3 className="text-[16px] font-semibold text-[#2D2D2D]">
            Assignment Details
          </h3>
          <p className="mb-4 text-[11px] text-[#8A8A8A]">
            Basic information about your assignment
          </p>

          <div className="rounded-2xl border border-dashed border-[#C6C6C6] bg-[#F7F7F7] px-4 py-6 text-center">
            <Upload size={18} className="mx-auto mb-2 text-[#444]" />
            <p className="text-[13px] font-medium text-[#2F2F2F]">
              Choose a file or drag & drop it here
            </p>
            <p className="mb-3 mt-1 text-[11px] text-[#989898]">
              JPEG, PNG, upto 10MB
            </p>
            <button
              onClick={openUploadModal}
              className="rounded-full bg-[#EAEAEA] px-4 py-1.5 text-[12px] font-medium text-[#434343] transition hover:bg-[#E2E2E2]"
            >
              Browse Files
            </button>
            <p className="mt-3 text-[12px] text-[#888]">
              Upload images of your preferred document/image
            </p>
            {attachedFileName ? (
              <p className="mt-1 text-[12px] font-medium text-[#2F2F2F]">
                Attached: {attachedFileName}
              </p>
            ) : null}
          </div>

          <div className="mt-4">
            <label
              htmlFor="due-date"
              className="mb-1 block text-[12px] font-semibold text-[#2F2F2F]"
            >
              Due Date
            </label>
            <div className="relative">
              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="h-10 w-full rounded-full border border-[#CDCDCD] bg-[#F8F8F8] px-3 pr-10 text-[13px] text-[#3D3D3D] outline-none focus:border-[#B8B8B8]"
              />
              <CalendarDays
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6D6D6D]"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 grid grid-cols-[1fr_112px_92px] gap-2 text-[11px] font-semibold text-[#4A4A4A]">
              <p>Question Type</p>
              <p className="text-center">No. of Questions</p>
              <p className="text-center">Marks</p>
            </div>

            <div className="space-y-2.5">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[1fr_24px_112px_92px] items-center gap-2"
                >
                  <div className="relative">
                    <select
                      value={row.type}
                      onChange={(event) =>
                        updateRow(row.id, (currentRow) => ({
                          ...currentRow,
                          type: event.target.value,
                        }))
                      }
                      className="h-10 w-full appearance-none rounded-full bg-[#F8F8F8] px-3 pr-8 text-[12px] text-[#353535] outline-none"
                    >
                      {questionTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7B7B7B]"
                    />
                  </div>

                  <button
                    onClick={() => removeRow(row.id)}
                    className="grid h-6 w-6 place-items-center rounded-full text-[#5D5D5D] transition hover:bg-[#E5E5E5]"
                    aria-label="Remove row"
                  >
                    <X size={13} />
                  </button>

                  <div className="flex h-10 items-center justify-between rounded-full bg-[#F8F8F8] px-2.5">
                    <button
                      onClick={() =>
                        updateRow(row.id, (currentRow) => ({
                          ...currentRow,
                          count: Math.max(1, currentRow.count - 1),
                        }))
                      }
                      className="grid h-6 w-6 place-items-center rounded-full text-[#787878] transition hover:bg-[#EBEBEB]"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-[12px] font-semibold text-[#3A3A3A]">
                      {row.count}
                    </span>
                    <button
                      onClick={() =>
                        updateRow(row.id, (currentRow) => ({
                          ...currentRow,
                          count: currentRow.count + 1,
                        }))
                      }
                      className="grid h-6 w-6 place-items-center rounded-full text-[#787878] transition hover:bg-[#EBEBEB]"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="flex h-10 items-center justify-between rounded-full bg-[#F8F8F8] px-2.5">
                    <button
                      onClick={() =>
                        updateRow(row.id, (currentRow) => ({
                          ...currentRow,
                          marks: Math.max(1, currentRow.marks - 1),
                        }))
                      }
                      className="grid h-6 w-6 place-items-center rounded-full text-[#787878] transition hover:bg-[#EBEBEB]"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-[12px] font-semibold text-[#3A3A3A]">
                      {row.marks}
                    </span>
                    <button
                      onClick={() =>
                        updateRow(row.id, (currentRow) => ({
                          ...currentRow,
                          marks: currentRow.marks + 1,
                        }))
                      }
                      className="grid h-6 w-6 place-items-center rounded-full text-[#787878] transition hover:bg-[#EBEBEB]"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addRow}
              className="mt-3 inline-flex items-center gap-2 text-[12px] font-semibold text-[#2E2E2E]"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#2E2E2E] text-white">
                <Plus size={12} />
              </span>
              Add Question Type
            </button>
          </div>

          <div className="mt-3 space-y-0.5 text-right text-[13px]">
            <p className="text-[#3D3D3D]">
              Total Questions : <span className="font-semibold">{totalQuestions}</span>
            </p>
            <p className="text-[#3D3D3D]">
              Total Marks : <span className="font-semibold">{totalMarks}</span>
            </p>
          </div>

          <div className="mt-4">
            <label
              htmlFor="additional-info"
              className="mb-1 block text-[12px] font-semibold text-[#2F2F2F]"
            >
              Additional Information (For better output)
            </label>
            <textarea
              id="additional-info"
              value={additionalInfo}
              onChange={(event) => setAdditionalInfo(event.target.value)}
              rows={4}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              className="w-full resize-none rounded-2xl border border-[#D6D6D6] bg-[#F7F7F7] px-3 py-2.5 text-[12px] text-[#363636] outline-none placeholder:text-[#A1A1A1] focus:border-[#BEBEBE]"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button className="inline-flex h-10 items-center gap-2 rounded-full bg-[#F8F8F8] px-5 text-[13px] text-[#323232] transition hover:bg-[#F0F0F0]">
            <span className="text-[16px]">←</span>
            Previous
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-full bg-[#18191B] px-5 text-[13px] text-white transition hover:brightness-110">
            Next
            <span className="text-[16px]">→</span>
          </button>
        </div>
      </section>

      {isUploadModalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-[16px] font-semibold text-[#2F2F2F]">
                Attach Assignment File
              </h4>
              <button
                onClick={closeUploadModal}
                className="grid h-7 w-7 place-items-center rounded-full text-[#666] transition hover:bg-[#F1F1F1]"
                aria-label="Close modal"
              >
                <X size={15} />
              </button>
            </div>

            <div className="rounded-xl border border-dashed border-[#CBCBCB] bg-[#FAFAFA] p-5 text-center">
              <Upload size={18} className="mx-auto mb-2 text-[#4A4A4A]" />
              <p className="text-[13px] text-[#363636]">
                Select a file to attach with assignment
              </p>
              <p className="mt-1 text-[11px] text-[#9A9A9A]">Max size: 10MB</p>
              <button
                onClick={onPickFile}
                className="mt-3 rounded-full bg-[#191A1C] px-4 py-1.5 text-[12px] font-medium text-white transition hover:brightness-110"
              >
                Choose File
              </button>
              <input
                ref={hiddenFileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={(event) => onFileSelected(event.target.files?.[0] ?? null)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

