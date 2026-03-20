import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { mockAssignments } from "@/features/assignments/data/mockAssignments";

type AssignmentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AssignmentDetailPage({
  params,
}: AssignmentDetailPageProps) {
  const { id } = await params;
  const assignment = mockAssignments.find((item) => item.id === id);

  if (!assignment) {
    notFound();
  }

  return (
    <main className="h-screen overflow-hidden bg-transparent p-2">
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
              <span className="text-[14px] text-[#7A7A7A]">Create New</span>
            </div>

            <div className="rounded-3xl bg-[#252628] p-4 text-white">
              <p className="text-[14px] leading-6">{assignment.details.introMessage}</p>
              <button className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[12px] font-medium text-[#1F1F1F] transition hover:bg-[#F1F1F1]">
                <Download size={14} />
                Download as PDF
              </button>
            </div>

            <article className="mt-3 rounded-3xl bg-[#F6F6F6] p-6 text-[#2F2F2F]">
              <header className="text-center">
                <h1 className="text-[40px] font-semibold leading-none">{assignment.details.schoolName}</h1>
                <p className="mt-2 text-[30px] font-medium">
                  Subject: {assignment.details.subject}
                </p>
                <p className="text-[30px] font-medium">Class: {assignment.details.className}</p>
              </header>

              <div className="mt-5 flex items-center justify-between text-[18px] font-medium">
                <p>Time Allowed: {assignment.details.timeAllowedMinutes} minutes</p>
                <p>Maximum Marks: {assignment.details.maxMarks}</p>
              </div>

              <div className="mt-6 space-y-2 text-[17px]">
                {assignment.details.generalInstructions.map((instruction) => (
                  <p key={instruction}>{instruction}</p>
                ))}
              </div>

              <div className="mt-8 space-y-1 text-[17px]">
                {assignment.details.studentInfoFields.map((field) => (
                  <p key={field}>{field}: __________________</p>
                ))}
              </div>

              {assignment.details.sections.map((section) => (
                <section key={section.id} className="mt-10">
                  <h2 className="text-center text-[34px] font-semibold">{section.title}</h2>
                  <h3 className="mt-5 text-[22px] font-semibold">{section.heading}</h3>
                  <p className="text-[16px] italic text-[#666666]">{section.notes}</p>

                  <ol className="mt-5 space-y-4 pl-6 text-[17px] leading-7">
                    {section.questions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ol>
                </section>
              ))}

              <section className="mt-12">
                <h2 className="text-[30px] font-semibold">Answer Key:</h2>
                <ol className="mt-4 space-y-3 pl-6 text-[17px] leading-7">
                  {assignment.details.answerKey.map((answer) => (
                    <li key={answer}>{answer}</li>
                  ))}
                </ol>
              </section>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
