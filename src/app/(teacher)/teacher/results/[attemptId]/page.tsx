import Link from "next/link";
import { notFound } from "next/navigation";

import { getTeacherResultDetail } from "@/features/results/queries";
import { getTeacherProfile } from "@/lib/authorization";

export const dynamic = "force-dynamic";

type TeacherResultDetailPageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function TeacherResultDetailPage({ params }: TeacherResultDetailPageProps) {
  const teacher = await getTeacherProfile();
  const { attemptId } = await params;
  const result = await getTeacherResultDetail(teacher.id, attemptId);

  if (!result) {
    notFound();
  }

  const score = Math.round(result.score ?? 0);
  const totalQuestions = result.correctCount + result.wrongCount + result.emptyCount;

  return (
    <main className="bg-slate-50 px-5 py-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-900 p-8 text-white md:p-10">
            <Link className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/88 transition hover:bg-white/15" href="/teacher/results">
              Sonuclara don
            </Link>

            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Sonuc Detayi</p>
                <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{result.test.title}</h1>
                <p className="mt-4 max-w-2xl leading-7 text-white/72">{result.test.description ?? `${result.test.course.title} testi sonucu.`}</p>
                <div className="mt-5 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 font-bold text-white/88">{result.test.course.title}</span>
                  <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 font-bold text-white/88">{result.student.fullName}</span>
                  <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 font-bold text-white/88">{formatDuration(result.durationSeconds)}</span>
                </div>
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
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Ogrenci</p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">Katilimci Bilgileri</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <Info label="Ad soyad" value={result.student.fullName} />
              <Info label="E-posta" value={result.student.email} />
              {result.student.phone ? <Info label="Telefon" value={result.student.phone} /> : null}
              <Info label="Seviye" value={result.student.gradeLevel} />
              {result.student.schoolName ? <Info label="Okul" value={result.student.schoolName} /> : null}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Test</p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">Cozum Bilgileri</h2>
            <div className="mt-5 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <Info label="Ders" value={result.test.course.title} />
              <Info label="Test suresi" value={result.test.durationMinutes ? `${result.test.durationMinutes} dk` : "Suresiz"} />
              <Info label="Baslangic" value={formatDate(result.startedAt)} />
              <Info label="Bitis" value={formatDate(result.completedAt)} />
              <Info label="Cozum suresi" value={formatDuration(result.durationSeconds)} />
              <Info label="Puan" value={score.toString()} />
            </div>
          </section>
        </div>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Inceleme</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Cevap Detaylari</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{result.answers.length} cevap</span>
          </div>

          <div className="mt-6 space-y-4">
            {result.answers.map((answer, index) => {
              const status = getAnswerStatus(answer.isCorrect, answer.selectedOption);

              return (
                <article key={answer.id} className="rounded-3xl border border-slate-200 p-5 transition hover:border-slate-300 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-3xl">
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Soru {index + 1}</p>
                      <h3 className="mt-3 text-lg font-black text-slate-950">{answer.questionTextSnapshot ?? answer.question.questionText}</h3>

                      <div className="mt-5 grid gap-3 text-sm text-slate-700">
                        <Option label="A" text={answer.optionASnapshot ?? answer.question.optionA} correct={(answer.correctOptionSnapshot ?? answer.question.correctOption) === "A"} selected={answer.selectedOption === "A"} />
                        <Option label="B" text={answer.optionBSnapshot ?? answer.question.optionB} correct={(answer.correctOptionSnapshot ?? answer.question.correctOption) === "B"} selected={answer.selectedOption === "B"} />
                        <Option label="C" text={answer.optionCSnapshot ?? answer.question.optionC} correct={(answer.correctOptionSnapshot ?? answer.question.correctOption) === "C"} selected={answer.selectedOption === "C"} />
                        <Option label="D" text={answer.optionDSnapshot ?? answer.question.optionD} correct={(answer.correctOptionSnapshot ?? answer.question.correctOption) === "D"} selected={answer.selectedOption === "D"} />
                      </div>

                      {answer.explanationSnapshot ?? answer.question.explanation ? (
                        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                          <p className="font-bold text-slate-900">Aciklama</p>
                          <p className="mt-2 leading-6">{answer.explanationSnapshot ?? answer.question.explanation}</p>
                        </div>
                      ) : null}
                    </div>

                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}

function ResultCard({ label, value, tone }: { label: string; value: string; tone: "slate" | "green" | "red" | "amber" }) {
  const toneClass = {
    slate: "bg-slate-50 text-slate-950",
    green: "bg-emerald-50 text-emerald-900",
    red: "bg-red-50 text-red-900",
    amber: "bg-amber-50 text-amber-900",
  }[tone];

  return (
    <div className={`rounded-2xl p-4 ${toneClass}`}>
      <p className="text-sm font-bold opacity-65">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 font-bold text-slate-900">{value}</p>
    </div>
  );
}

function Option({ label, text, correct, selected }: { label: string; text: string; correct: boolean; selected: boolean }) {
  const toneClass = correct ? "border-emerald-200 bg-emerald-50" : selected ? "border-red-200 bg-red-50" : "border-slate-200 bg-white";

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <div className="flex flex-wrap items-start gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">{label}</span>
        <div className="min-w-0 flex-1">
          <p className="leading-6 text-slate-800">{text}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {correct ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">Dogru cevap</span> : null}
            {selected ? <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-800">Ogrenci secimi</span> : null}
          </div>
        </div>
      </div>
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

function formatDate(date: Date | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatDuration(seconds: number | null) {
  if (!seconds) {
    return "-";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes} dk ${remainingSeconds} sn`;
}
