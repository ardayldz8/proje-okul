import { notFound } from "next/navigation";

import { getAttemptResult } from "@/features/student-test/queries";

export const dynamic = "force-dynamic";

type TestResultPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TestResultPage({ params }: TestResultPageProps) {
  const { id } = await params;
  const result = await getAttemptResult(id);

  if (!result) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Sonuc</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">{result.test.title}</h1>
          <p className="mt-4 text-slate-600">{result.test.course.title} testi tamamlandi.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <ResultCard label="Puan" value={Math.round(result.score ?? 0).toString()} />
            <ResultCard label="Dogru" value={result.correctCount.toString()} />
            <ResultCard label="Yanlis" value={result.wrongCount.toString()} />
            <ResultCard label="Bos" value={result.emptyCount.toString()} />
          </div>
        </div>

        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">Sonuc sayfasi reklam alani placeholder</div>

        <div className="space-y-4">
          {result.answers.map((answer, index) => (
            <article key={`${answer.question.questionText}-${index}`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-semibold text-slate-950">Soru {index + 1}</h2>
                <span className={answer.isCorrect ? "rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700" : "rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700"}>
                  {answer.isCorrect ? "Dogru" : answer.selectedOption ? "Yanlis" : "Bos"}
                </span>
              </div>
              <p className="mt-3 text-slate-700">{answer.question.questionText}</p>
              <dl className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <div>Seciminiz: {answer.selectedOption ?? "Bos"}</div>
                <div>Dogru cevap: {answer.question.correctOption}</div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
