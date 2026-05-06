"use client";

import { Difficulty, TestStatus } from "@prisma/client";
import { useActionState, useMemo, useState } from "react";

import { createTest, type TestActionState } from "@/features/test-builder/actions";

type CourseOption = { id: string; title: string };
type QuestionOption = { id: string; questionText: string; difficulty: Difficulty; courseId: string; course: { title: string } };

const initialState: TestActionState = {};

export function TestForm({ courses, questions }: { courses: CourseOption[]; questions: QuestionOption[] }) {
  const [state, formAction, isPending] = useActionState(createTest, initialState);
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const filteredQuestions = useMemo(() => questions.filter((question) => question.courseId === courseId), [courseId, questions]);

  return (
    <form action={formAction} className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Test olusturma</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Yeni Test Olustur</h2>
        <p className="mt-1 text-sm text-slate-600">Sadece kendi aktif sorularinizdan test olusturabilirsiniz.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Test adi" name="title" placeholder="Ornek: Matematik Deneme 1" required />
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Ders</span>
          <select className="w-full rounded-xl border border-slate-300 px-4 py-3" name="courseId" onChange={(event) => setCourseId(event.target.value)} required value={courseId}>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <Field label="Sure (dakika)" name="durationMinutes" placeholder="Bos ise suresiz" type="number" />
      </div>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        <span>Aciklama</span>
        <textarea className="min-h-20 w-full rounded-xl border border-slate-300 px-4 py-3" name="description" placeholder="Opsiyonel" />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Durum</span>
          <select className="w-full rounded-xl border border-slate-300 px-4 py-3" name="status" required>
            <option value={TestStatus.DRAFT}>Taslak</option>
            <option value={TestStatus.ACTIVE}>Aktif</option>
            <option value={TestStatus.ARCHIVED}>Arsiv</option>
          </select>
        </label>
        <label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
          <input defaultChecked name="showResultImmediately" type="checkbox" />
          Sonucu aninda goster
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-950">Sorular</h3>
        <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-2">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <label key={question.id} className="flex gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 transition hover:border-teal-300 hover:bg-slate-50">
                <input name="questionIds" type="checkbox" value={question.id} />
                <span>
                  <strong>{formatDifficulty(question.difficulty)}:</strong> {question.questionText}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-slate-500">Bu ders icin aktif soru yok.</p>
          )}
        </div>
      </div>

      {state.error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
      {state.message ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{state.message}</p> : null}

      <button className="rounded-2xl bg-indigo-950 px-5 py-3 font-bold text-white transition hover:bg-indigo-900 disabled:opacity-60" disabled={isPending} type="submit">
        {isPending ? "Olusturuluyor..." : "Test Olustur"}
      </button>
    </form>
  );
}

function Field({ label, name, placeholder, required = false, type = "text" }: { label: string; name: string; placeholder: string; required?: boolean; type?: string }) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input className="w-full rounded-xl border border-slate-300 px-4 py-3" name={name} placeholder={placeholder} required={required} type={type} />
    </label>
  );
}

function formatDifficulty(difficulty: Difficulty) {
  return {
    [Difficulty.EASY]: "Kolay",
    [Difficulty.MEDIUM]: "Orta",
    [Difficulty.HARD]: "Zor",
  }[difficulty];
}
