"use client";

import { useActionState } from "react";

import { requestStudentOtp, startStudentAttempt, type RequestOtpState, type StartAttemptState } from "@/features/student-test/actions";

type TeacherOption = {
  id: string;
  fullName: string;
};

type StudentStartFormProps = {
  testId: string;
  teachers: TeacherOption[];
};

const initialState: RequestOtpState = {};
const initialStartState: StartAttemptState = {};

export function StudentStartForm({ testId, teachers }: StudentStartFormProps) {
  const [otpState, requestOtpAction, isOtpPending] = useActionState(requestStudentOtp, initialState);
  const [startState, startAttemptAction, isStartPending] = useActionState(startStudentAttempt, initialStartState);

  return (
    <form className="mt-8 space-y-5">
      <input name="testId" type="hidden" value={testId} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Ad soyad" name="fullName" placeholder="Adiniz soyadiniz" required />
        <Field label="E-posta" name="email" placeholder="ornek@mail.com" required type="email" />
        <Field label="Telefon" name="phone" placeholder="Opsiyonel" />
        <Field label="Sinif seviyesi" name="gradeLevel" placeholder="8. Sinif" required />
        <Field label="Okul" name="schoolName" placeholder="Opsiyonel" />

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Bagli oldugu hoca</span>
          <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none ring-teal-700 transition focus:ring-2" name="teacherId">
            <option value="">Secilmedi</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.fullName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <Checkbox label="KVKK Aydinlatma Metni'ni okudum ve onayliyorum." name="kvkkAccepted" />
        <Checkbox label="Gizlilik Politikasi'ni okudum ve onayliyorum." name="privacyAccepted" />
        <Checkbox label="Kullanim Kosullari'ni okudum ve onayliyorum." name="termsAccepted" />
      </div>

      <Field label="Dogrulama kodu" name="otpCode" placeholder="6 haneli kod" />

      {otpState.error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{otpState.error}</p> : null}
      {otpState.message ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{otpState.message}</p> : null}
      {startState.error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{startState.error}</p> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <button className="rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60" disabled={isOtpPending || isStartPending} formAction={requestOtpAction} type="submit">
          {isOtpPending ? "Kod gonderiliyor..." : "Dogrulama Kodu Gonder"}
        </button>
        <button className="rounded-full bg-indigo-950 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isOtpPending || isStartPending} formAction={startAttemptAction} type="submit">
          {isStartPending ? "Test baslatiliyor..." : "Testi Baslat"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, placeholder, required = false, type = "text" }: { label: string; name: string; placeholder: string; required?: boolean; type?: string }) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none ring-teal-700 transition focus:ring-2" name={name} placeholder={placeholder} required={required} type={type} />
    </label>
  );
}

function Checkbox({ label, name }: { label: string; name: string }) {
  return (
    <label className="flex gap-3">
      <input className="mt-1 size-4 rounded border-slate-300" name={name} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}
