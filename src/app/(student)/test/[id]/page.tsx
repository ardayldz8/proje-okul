import { notFound } from "next/navigation";

import { TestSolvingForm } from "@/features/student-test/components/test-solving-form";
import { getAttemptForSolving } from "@/features/student-test/queries";

export const dynamic = "force-dynamic";

type TestAttemptPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TestAttemptPage({ params }: TestAttemptPageProps) {
  const { id } = await params;
  const attempt = await getAttemptForSolving(id);

  if (!attempt) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Test Cozme</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950">{attempt.test.title}</h1>
              <p className="mt-4 text-slate-600">{attempt.test.description ?? `${attempt.test.course.title} testi.`}</p>
            </div>
            <div className="rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4 text-sm font-bold text-teal-800">
              Kalan sure: {attempt.remainingSeconds === null ? "Suresiz" : `${Math.ceil(attempt.remainingSeconds / 60)} dk`}
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-600 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">Ders: {attempt.test.course.title}</div>
            <div className="rounded-2xl bg-slate-50 p-4">Soru: {attempt.test.testQuestions.length}</div>
            <div className="rounded-2xl bg-slate-50 p-4">Durum: Devam ediyor</div>
          </div>
        </div>

        <TestSolvingForm attemptId={attempt.id} questions={attempt.test.testQuestions} />
      </section>
    </main>
  );
}
