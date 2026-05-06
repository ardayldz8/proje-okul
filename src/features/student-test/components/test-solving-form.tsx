"use client";

import { useMemo, useState } from "react";

import { completeStudentAttempt } from "@/features/student-test/actions";

type TestQuestion = {
  orderIndex: number;
  question: {
    id: string;
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
  };
};

type TestSolvingFormProps = {
  attemptId: string;
  questions: TestQuestion[];
};

const options = [
  { label: "A", key: "optionA" },
  { label: "B", key: "optionB" },
  { label: "C", key: "optionC" },
  { label: "D", key: "optionD" },
] as const;

export function TestSolvingForm({ attemptId, questions }: TestSolvingFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinishOpen, setIsFinishOpen] = useState(false);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const unansweredCount = questions.length - answeredCount;
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <>
      <form action={completeStudentAttempt} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]" id="test-solving-form">
        <input name="attemptId" type="hidden" value={attemptId} />

        <div className="space-y-5">
          {questions.map((testQuestion) => {
            const selectedValue = answers[testQuestion.question.id];

            return (
              <fieldset key={testQuestion.question.id} className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6" id={`question-${testQuestion.orderIndex}`}>
                <legend className="rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">Soru {testQuestion.orderIndex}</legend>
                <p className="mt-4 text-lg font-bold leading-8 text-slate-950">{testQuestion.question.questionText}</p>

                <div className="mt-5 grid gap-3">
                  {options.map((option) => {
                    const isSelected = selectedValue === option.label;
                    const optionText = testQuestion.question[option.key];

                    return (
                      <label
                        key={option.label}
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                          isSelected ? "border-teal-500 bg-teal-50 shadow-[0_16px_40px_-30px_rgba(13,148,136,0.85)]" : "border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          checked={isSelected}
                          className="sr-only"
                          name={`answer-${testQuestion.question.id}`}
                          onChange={() => setAnswers((current) => ({ ...current, [testQuestion.question.id]: option.label }))}
                          type="radio"
                          value={option.label}
                        />
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-black ${isSelected ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700"}`}>{option.label}</span>
                        <span className="pt-1 text-sm leading-6 text-slate-700 md:text-base">{optionText}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Ilerleme</p>
                <p className="mt-2 text-3xl font-black text-slate-950">%{progressPercent}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right text-sm font-semibold text-slate-600">
                <p>{answeredCount} cevaplandi</p>
                <p>{unansweredCount} bos</p>
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all" style={{ width: `${progressPercent}%` }} />
            </div>

            <div className="mt-5 grid grid-cols-5 gap-2">
              {questions.map((testQuestion) => {
                const isAnswered = Boolean(answers[testQuestion.question.id]);

                return (
                  <a
                    key={testQuestion.question.id}
                    className={`grid h-10 place-items-center rounded-xl text-sm font-black transition ${isAnswered ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    href={`#question-${testQuestion.orderIndex}`}
                  >
                    {testQuestion.orderIndex}
                  </a>
                );
              })}
            </div>

            <button className="mt-6 w-full rounded-2xl bg-indigo-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-indigo-900" onClick={() => setIsFinishOpen(true)} type="button">
              Testi Bitir
            </button>

            <p className="mt-4 text-xs leading-5 text-slate-500">Bitirme onayindan sonra cevaplar server action ile kaydedilir ve sonuc ekranina yonlendirilirsiniz.</p>
          </div>
        </aside>
      </form>

      {isFinishOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white p-6 shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Testi Bitir</p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">Cevaplari gondermek istiyor musunuz?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {answeredCount} soru cevaplandi, {unansweredCount} soru bos kaldi. Onayladiginizda test tamamlanir ve cevaplariniz degistirilemez.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50" onClick={() => setIsFinishOpen(false)} type="button">
                Devam Et
              </button>
              <button className="rounded-2xl bg-indigo-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-900" form="test-solving-form" type="submit">
                Onayla ve Bitir
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
