import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AssignmentsContent from "@/features/assignments/components/AssignmentsContent";
import { mockAssignments } from "@/features/assignments/data/mockAssignments";

export default function AssignmentPage() {
  return (
    <main className="h-screen overflow-hidden bg-transparent p-2">
      <section className="mx-auto flex h-full max-w-[1700px] gap-2.5 rounded-xl bg-transparent p-2">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-transparent p-2">
          <div className="shrink-0">
            <Navbar />
          </div>
          <AssignmentsContent assignments={mockAssignments} />
        </div>
      </section>
    </main>
  );
}
