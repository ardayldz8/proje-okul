import { notFound } from "next/navigation";

import { StudentStartForm } from "@/features/student-test/components/student-start-form";
import { getPublicTestStartData } from "@/features/student-test/queries";

export const dynamic = "force-dynamic";

type TestStartPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TestStartPage({ params }: TestStartPageProps) {
  const { id } = await params;
  const { test, teachers } = await getPublicTestStartData(id);

  if (!test) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Test Baslangici</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">{test.title}</h1>
        <p className="mt-4 text-slate-600">{test.description ?? `${test.course.title} dersi icin test baslangic bilgileri.`}</p>

        <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-600 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">Ders: {test.course.title}</div>
          <div className="rounded-2xl bg-slate-50 p-4">Soru: {test._count.testQuestions}</div>
          <div className="rounded-2xl bg-slate-50 p-4">Sure: {test.durationMinutes ? `${test.durationMinutes} dakika` : "Suresiz"}</div>
        </div>

        <StudentStartForm teachers={teachers} testId={test.id} />
      </section>
    </main>
  );
}
