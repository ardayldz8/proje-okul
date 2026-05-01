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

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <Link className="text-sm font-semibold text-teal-700" href="/teacher/results">
            Sonuclara don
          </Link>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Sonuc Detayi</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">{result.test.title}</h1>
          <p className="mt-4 text-slate-600">{result.test.description ?? `${result.test.course.title} testi sonucu.`}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Puan" value={Math.round(result.score ?? 0).toString()} />
          <StatCard label="Dogru" value={result.correctCount.toString()} />
          <StatCard label="Yanlis" value={result.wrongCount.toString()} />
          <StatCard label="Bos" value={result.emptyCount.toString()} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Ogrenci</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="font-semibold text-slate-950">{result.student.fullName}</p>
              <p>{result.student.email}</p>
              {result.student.phone ? <p>{result.student.phone}</p> : null}
              <p>{result.student.gradeLevel}</p>
              {result.student.schoolName ? <p>{result.student.schoolName}</p> : null}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Test Bilgisi</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <Info label="Ders" value={result.test.course.title} />
              <Info label="Test suresi" value={result.test.durationMinutes ? `${result.test.durationMinutes} dk` : "Suresiz"} />
              <Info label="Baslangic" value={formatDate(result.startedAt)} />
              <Info label="Bitis" value={formatDate(result.completedAt)} />
              <Info label="Cozum suresi" value={formatDuration(result.durationSeconds)} />
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-950">Cevap Detaylari</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{result.answers.length} cevap</span>
          </div>

          <div className="mt-6 space-y-4">
            {result.answers.map((answer, index) => (
              <article key={answer.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <p className="text-sm font-semibold text-teal-700">Soru {index + 1}</p>
                    <h3 className="mt-2 font-semibold text-slate-950">{answer.question.questionText}</h3>
                    <div className="mt-4 grid gap-2 text-sm text-slate-700">
                      <Option label="A" text={answer.question.optionA} correct={answer.question.correctOption === "A"} selected={answer.selectedOption === "A"} />
                      <Option label="B" text={answer.question.optionB} correct={answer.question.correctOption === "B"} selected={answer.selectedOption === "B"} />
                      <Option label="C" text={answer.question.optionC} correct={answer.question.correctOption === "C"} selected={answer.selectedOption === "C"} />
                      <Option label="D" text={answer.question.optionD} correct={answer.question.correctOption === "D"} selected={answer.selectedOption === "D"} />
                    </div>
                    {answer.question.explanation ? <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{answer.question.explanation}</p> : null}
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${answer.isCorrect ? "bg-emerald-50 text-emerald-700" : answer.selectedOption ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"}`}>
                    {answer.isCorrect ? "Dogru" : answer.selectedOption ? "Yanlis" : "Bos"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function Option({ label, text, correct, selected }: { label: string; text: string; correct: boolean; selected: boolean }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${correct ? "border-emerald-200 bg-emerald-50" : selected ? "border-red-200 bg-red-50" : "border-slate-200"}`}>
      <span className="font-semibold">{label})</span> {text}
      {correct ? <span className="ml-2 text-xs font-semibold text-emerald-700">Dogru cevap</span> : null}
      {selected ? <span className="ml-2 text-xs font-semibold text-slate-700">Ogrenci secimi</span> : null}
    </div>
  );
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
