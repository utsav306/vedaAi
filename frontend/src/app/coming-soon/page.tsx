import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#dedede] px-4">
      <section className="w-full max-w-xl rounded-3xl border border-[#d0d0d0] bg-[#f6f6f6] p-8 text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7d7d7d]">VedaAI</p>
        <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.02em] text-[#232323]">Coming Soon</h1>
        <p className="mt-3 text-[14px] text-[#666666]">
          This page is not available yet. We are building it and it will be live soon.
        </p>

        <div className="mt-6 flex items-center justify-center gap-2">
          <Link
            href="/assignment"
            className="inline-flex h-10 items-center rounded-full bg-[#18191B] px-5 text-[13px] font-medium text-white transition hover:brightness-110"
          >
            Go to Assignments
          </Link>
        </div>
      </section>
    </main>
  );
}
