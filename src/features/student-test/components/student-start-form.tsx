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
  student: {
    fullName: string;
    email: string;
    gradeLevel: string;
    schoolName: string | null;
  };
};

const initialStartState: StartAttemptState = {};

export function StudentStartForm({ testId, teachers, student }: StudentStartFormProps) {
  const [startState, startAttemptAction, isStartPending] = useActionState(startStudentAttempt, initialStartState);

  return (
    <form className="mt-8 space-y-6">
      <input name="testId" type="hidden" value={testId} />

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Ogrenci Bilgileri</p>
        <h3 className="mt-2 text-xl font-black text-slate-950">Kayitli hesap</h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Info label="Ad soyad" value={student.fullName} />
          <Info label="E-posta" value={student.email} />
          <Info label="Sinif seviyesi" value={student.gradeLevel} />
          <Info label="Okul" value={student.schoolName ?? "-"} />

          <label className="space-y-2 text-sm font-bold text-slate-700 md:col-span-2">
            <span>Bagli oldugu hoca</span>
            <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-950 outline-none ring-teal-700 transition focus:ring-2" name="teacherId">
              <option value="">Secilmedi</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.fullName}
                </option>
              ))}
            </select>
            <p className="text-xs font-medium text-slate-500">Sistemde aktif olan hocalar listelenir. Secim opsiyoneldir.</p>
          </label>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 md:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Onaylar</p>
        <h3 className="mt-2 text-xl font-black text-slate-950">Yasal dogrulama</h3>

        <fieldset className="mt-5 space-y-3 text-sm text-slate-700">
          <Checkbox label="KVKK Aydinlatma Metni'ni okudum ve onayliyorum." name="kvkkAccepted" />
          <Checkbox label="Gizlilik Politikasi'ni okudum ve onayliyorum." name="privacyAccepted" />
          <Checkbox label="Kullanim Kosullari'ni okudum ve onayliyorum." name="termsAccepted" />
        </fieldset>
      </section>

      <div aria-live="polite" className="space-y-3">
        {startState.error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{startState.error}</p> : null}
      </div>

      <div className="grid gap-3">
        <button className="rounded-2xl bg-indigo-950 px-5 py-3.5 font-bold text-white transition hover:bg-indigo-900 disabled:cursor-not-allowed disabled:opacity-60" disabled={isStartPending} formAction={startAttemptAction} type="submit">
          {isStartPending ? "Test baslatiliyor..." : "Testi Baslat"}
        </button>
      </div>
    </form>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 font-bold text-slate-900">{value}</p>
    </div>
  );
}

function Checkbox({ label, name }: { label: string; name: string }) {
  return (
    <label className="flex gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
      <input className="mt-1 size-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700" name={name} type="checkbox" />
      <span className="leading-6">{label}</span>
    </label>
  );
}
