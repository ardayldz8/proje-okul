"use client";

import { useActionState } from "react";

import { createQuestion, type QuestionActionState } from "@/features/question-bank/actions";

const DIFFICULTIES = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
} as const;

type CourseOption = { id: string; title: string };

const initialState: QuestionActionState = {};

export function QuestionForm({ courses }: { courses: CourseOption[] }) {
  const [state, formAction, isPending] = useActionState(createQuestion, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Soru girisi</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Yeni Soru Ekle</h2>
        <p className="mt-1 text-sm text-slate-600">MVP&apos;de 4 sikli ve tek dogru cevapli soru eklenir.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Ders</span>
          <select className="w-full rounded-xl border border-slate-300 px-4 py-3" name="courseId" required>
            <option value="">Ders sec</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Zorluk</span>
          <select className="w-full rounded-xl border border-slate-300 px-4 py-3" name="difficulty" required>
            <option value={DIFFICULTIES.EASY}>Kolay</option>
            <option value={DIFFICULTIES.MEDIUM}>Orta</option>
            <option value={DIFFICULTIES.HARD}>Zor</option>
          </select>
        </label>

        <Field label="Konu" name="topic" placeholder="Opsiyonel" />
      </div>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        <span>Soru metni</span>
        <textarea className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3" name="questionText" placeholder="Soru metnini yazin" required />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="A sikki" name="optionA" placeholder="A secenegi" required />
        <Field label="B sikki" name="optionB" placeholder="B secenegi" required />
        <Field label="C sikki" name="optionC" placeholder="C secenegi" required />
        <Field label="D sikki" name="optionD" placeholder="D secenegi" required />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Dogru sik</span>
          <select className="w-full rounded-xl border border-slate-300 px-4 py-3" name="correctOption" required>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </label>
        <Field label="Aciklama" name="explanation" placeholder="Opsiyonel" />
      </div>

      {state.error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
      {state.message ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{state.message}</p> : null}

      <button className="rounded-2xl bg-indigo-950 px-5 py-3 font-bold text-white transition hover:bg-indigo-900 disabled:opacity-60" disabled={isPending} type="submit">
        {isPending ? "Ekleniyor..." : "Soruyu Ekle"}
      </button>
    </form>
  );
}

function Field({ label, name, placeholder, required = false }: { label: string; name: string; placeholder: string; required?: boolean }) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input className="w-full rounded-xl border border-slate-300 px-4 py-3" name={name} placeholder={placeholder} required={required} />
    </label>
  );
}
