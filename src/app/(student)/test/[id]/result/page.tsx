import Link from "next/link";
import { notFound } from "next/navigation";

import { Advertisement } from "@/components/advertisement";
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

  if (!result.test.showResultImmediately) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8">
        <section className="mx-auto max-w-4xl space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-900 p-8 text-white md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Sonuc Kaydedildi</p>
              <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{result.test.title}</h1>
              <p className="mt-4 max-w-2xl leading-7 text-white/72">
                {result.test.course.title} testi tamamlandi. Sonucunuz ogretmeniniz tarafindan incelendikten sonra paylasilacaktir.
              </p>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
              <ResultCard label="Durum" tone="teal" value="Kaydedildi" />
              <ResultCard label="Cozum suresi" tone="slate" value={formatDuration(result.durationSeconds)} />
              <ResultCard label="Sonuc" tone="amber" value="Gizli" />
            </div>

            <div className="border-t border-slate-200 p-6 md:p-8">
              <Link className="inline-flex rounded-2xl bg-indigo-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-900" href="/online-test">
                Yeni testlere don
              </Link>
            </div>
          </div>

          <Advertisement placement="result" />
        </section>
      </main>
    );
  }

  const score = Math.round(result.score ?? 0);
  const totalQuestions = result.correctCount + result.wrongCount + result.emptyCount;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-900 p-8 text-white md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Sonuc</p>
                <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{result.test.title}</h1>
                <p className="mt-4 max-w-2xl leading-7 text-white/72">{result.test.course.title} testi tamamlandi. Cevap ozetiniz ve soru bazli durumlar asagida yer alir.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/14 bg-white/10 px-6 py-5 text-center shadow-[0_22px_60px_-34px_rgba(45,212,191,0.95)] backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Puan</p>
                <p className="mt-2 text-6xl font-black tracking-tight text-white">{score}</p>
              </div>
            </div>

            <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/12">
              <div className="h-full rounded-full bg-gradient-to-r from-teal-300 to-cyan-400" style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }} />
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 md:p-8">
            <ResultCard label="Toplam soru" tone="slate" value={totalQuestions.toString()} />
            <ResultCard label="Dogru" tone="green" value={result.correctCount.toString()} />
            <ResultCard label="Yanlis" tone="red" value={result.wrongCount.toString()} />
            <ResultCard label="Bos" tone="amber" value={result.emptyCount.toString()} />
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 p-6 sm:flex-row md:p-8">
            <Link className="rounded-2xl bg-indigo-950 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-indigo-900" href="/online-test">
              Yeni testlere don
            </Link>
            <Link className="rounded-2xl border border-slate-300 px-5 py-3 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50" href="/">
              Ana sayfa
            </Link>
          </div>
        </div>

        <Advertisement placement="result" />

        <div className="space-y-4">
          {result.answers.map((answer, index) => {
            const status = getAnswerStatus(answer.isCorrect, answer.selectedOption);

            return (
              <article key={`${answer.question.questionText}-${index}`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-black text-slate-950">Soru {index + 1}</h2>
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${status.className}`}>{status.label}</span>
                </div>
                <p className="mt-4 leading-7 text-slate-700">{answer.questionTextSnapshot ?? answer.question.questionText}</p>
                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <dt className="font-bold text-slate-500">Seciminiz</dt>
                    <dd className="mt-1 text-lg font-black text-slate-950">{answer.selectedOption ?? "Bos"}</dd>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <dt className="font-bold text-emerald-700">Dogru cevap</dt>
                    <dd className="mt-1 text-lg font-black text-emerald-900">{answer.correctOptionSnapshot ?? answer.question.correctOption}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function ResultCard({ label, value, tone }: { label: string; value: string; tone: "slate" | "green" | "red" | "amber" | "teal" }) {
  const toneClass = {
    slate: "bg-slate-50 text-slate-950",
    green: "bg-emerald-50 text-emerald-900",
    red: "bg-red-50 text-red-900",
    amber: "bg-amber-50 text-amber-900",
    teal: "bg-teal-50 text-teal-900",
  }[tone];

  return (
    <div className={`rounded-2xl p-4 ${toneClass}`}>
      <p className="text-sm font-bold opacity-65">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function getAnswerStatus(isCorrect: boolean, selectedOption: string | null) {
  if (isCorrect) {
    return { label: "Dogru", className: "bg-emerald-50 text-emerald-700" };
  }

  if (selectedOption) {
    return { label: "Yanlis", className: "bg-red-50 text-red-700" };
  }

  return { label: "Bos", className: "bg-slate-100 text-slate-600" };
}

function formatDuration(seconds: number | null) {
  if (!seconds) {
    return "-";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes} dk ${remainingSeconds} sn`;
}
