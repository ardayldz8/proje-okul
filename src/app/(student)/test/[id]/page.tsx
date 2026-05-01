import { notFound } from "next/navigation";

import { completeStudentAttempt } from "@/features/student-test/actions";
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
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Test Cozme</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">{attempt.test.title}</h1>
          <p className="mt-4 text-slate-600">{attempt.test.description ?? `${attempt.test.course.title} testi.`}</p>

          <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-600 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">Ders: {attempt.test.course.title}</div>
            <div className="rounded-2xl bg-slate-50 p-4">Soru: {attempt.test.testQuestions.length}</div>
            <div className="rounded-2xl bg-slate-50 p-4">Kalan sure: {attempt.remainingSeconds === null ? "Suresiz" : `${Math.ceil(attempt.remainingSeconds / 60)} dk`}</div>
          </div>
        </div>

        <form action={completeStudentAttempt} className="space-y-4">
          <input name="attemptId" type="hidden" value={attempt.id} />
          {attempt.test.testQuestions.map((testQuestion) => (
            <fieldset key={testQuestion.question.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <legend className="text-sm font-semibold text-teal-700">Soru {testQuestion.orderIndex}</legend>
              <p className="mt-3 text-lg font-semibold text-slate-950">{testQuestion.question.questionText}</p>
              <div className="mt-5 grid gap-3">
                <Option label="A" name={`answer-${testQuestion.question.id}`} value="A" text={testQuestion.question.optionA} />
                <Option label="B" name={`answer-${testQuestion.question.id}`} value="B" text={testQuestion.question.optionB} />
                <Option label="C" name={`answer-${testQuestion.question.id}`} value="C" text={testQuestion.question.optionC} />
                <Option label="D" name={`answer-${testQuestion.question.id}`} value="D" text={testQuestion.question.optionD} />
              </div>
            </fieldset>
          ))}

          <button className="w-full rounded-full bg-indigo-950 px-5 py-3 font-semibold text-white" type="submit">
            Testi Bitir
          </button>
        </form>
      </section>
    </main>
  );
}

function Option({ label, name, value, text }: { label: string; name: string; value: string; text: string }) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-teal-700">
      <input name={name} type="radio" value={value} />
      <span className="font-semibold text-slate-700">{label})</span>
      <span className="text-slate-700">{text}</span>
    </label>
  );
}
