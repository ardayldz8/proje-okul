"use client";

import { useActionState } from "react";

import { startStudentAttempt, type StartAttemptState } from "@/features/student-test/actions";

type TeacherOption = {
  id: string;
  fullName: string;
};

type StudentStartFormProps = {
  testId: string;
  teachers: TeacherOption[];
};

const initialState: StartAttemptState = {};

export function StudentStartForm({ testId, teachers }: StudentStartFormProps) {
  const [state, formAction, isPending] = useActionState(startStudentAttempt, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input name="testId" type="hidden" value={testId} />

      <label className="space-y-2 text-sm font-medium text-slate-700">
        <span>Bağlı olduğu hoca (opsiyonel)</span>
        <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none ring-teal-700 transition focus:ring-2" name="teacherId">
          <option value="">Seçilmedi</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.fullName}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <Checkbox label="KVKK Aydinlatma Metni'ni okudum ve onayliyorum." name="kvkkAccepted" />
        <Checkbox label="Gizlilik Politikasi'ni okudum ve onayliyorum." name="privacyAccepted" />
        <Checkbox label="Kullanim Kosullari'ni okudum ve onayliyorum." name="termsAccepted" />
      </div>

      {state.error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}

      <button className="w-full rounded-full bg-indigo-950 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} type="submit">
        {isPending ? "Test baslatiliyor..." : "Testi Baslat"}
      </button>
    </form>
  );
}

function Checkbox({ label, name }: { label: string; name: string }) {
  return (
    <label className="flex gap-3">
      <input className="mt-1 size-4 rounded border-slate-300" name={name} required type="checkbox" />
      <span>{label}</span>
    </label>
  );
}
