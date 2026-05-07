"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, UserRoundCheck, UserPlus } from "lucide-react";

import { registerTeacherAccount, type TeacherRegisterState } from "@/features/auth/actions";
import { registerStudentPortal, type StudentAuthState } from "@/features/student-portal/actions";

type AccountType = "student" | "teacher";

const gradeLevels = ["5. Sınıf", "6. Sınıf", "7. Sınıf", "8. Sınıf", "9. Sınıf", "10. Sınıf", "11. Sınıf", "12. Sınıf"];
const initialState: StudentAuthState = {};
const initialTeacherState: TeacherRegisterState = {};

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<AccountType>("student");
  const [studentState, studentFormAction, isStudentPending] = useActionState(registerStudentPortal, initialState);
  const [teacherState, teacherFormAction, isTeacherPending] = useActionState(registerTeacherAccount, initialTeacherState);
  const isStudent = accountType === "student";
  const state = isStudent ? studentState : teacherState;
  const isPending = isStudent ? isStudentPending : isTeacherPending;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#140814] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(147,31,65,0.42),transparent_34%),radial-gradient(circle_at_83%_72%,rgba(13,148,136,0.48),transparent_38%),linear-gradient(135deg,#260718_0%,#3a0d22_42%,#062b30_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:56px_56px] opacity-20" />

      <div className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-8">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white" href="/">
          <ArrowLeft aria-hidden className="h-4 w-4" />
          Ana sayfaya dön
        </Link>

        <div className={`mt-8 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-[0_16px_36px_-10px_rgba(13,148,136,0.65)] ${isStudent ? "bg-gradient-to-br from-teal-500 to-cyan-700" : "bg-gradient-to-br from-[#b61f52] to-[#5f0826]"}`}>
          <UserPlus aria-hidden className="h-8 w-8" strokeWidth={1.7} />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">Üye Ol</h1>
        <p className="mt-3 text-sm leading-6 text-white/65">Hesap türünü seç ve bilgilerini doldurarak devam et.</p>

        <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/6 p-2">
          <button
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              isStudent
                ? "bg-teal-400/18 text-teal-50 shadow-[0_12px_32px_-20px_rgba(20,184,166,0.95)]"
                : "text-white/60 hover:bg-white/8 hover:text-white"
            }`}
            type="button"
            onClick={() => setAccountType("student")}
          >
            <GraduationCap aria-hidden className="h-4 w-4" />
            Öğrenci
          </button>
          <button
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              !isStudent
                ? "bg-[#8f123a]/35 text-white shadow-[0_12px_32px_-20px_rgba(194,50,99,0.95)]"
                : "text-white/60 hover:bg-white/8 hover:text-white"
            }`}
            type="button"
            onClick={() => setAccountType("teacher")}
          >
            <UserRoundCheck aria-hidden className="h-4 w-4" />
            Öğretmen / Koç
          </button>
        </div>

        <form action={isStudent ? studentFormAction : teacherFormAction} className="mt-7 space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ad Soyad" name="fullName" placeholder="Adın soyadın" required />
            <Field label="E-posta" name="email" placeholder="ornek@mail.com" required type="email" />
            <Field label="Şifre" name="password" placeholder="Şifreni gir" required type="password" />
            <Field label="Şifre Tekrar" name="passwordConfirm" placeholder="Şifreni tekrar gir" required type="password" />

            {isStudent ? (
              <label className="block space-y-2 text-sm font-medium text-white/80 sm:col-span-2">
                <span>Sınıf Seviyesi</span>
                <select className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3.5 text-white outline-none transition focus:border-teal-300/45 focus:bg-white/14 focus:ring-2 focus:ring-teal-300/20" name="gradeLevel" defaultValue="" required>
                  <option className="bg-[#140814]" value="" disabled>
                    Sınıf seç
                  </option>
                  {gradeLevels.map((grade) => (
                    <option className="bg-[#140814]" key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <>
                <Field label="Branş / Alan" name="branch" placeholder="Matematik" />
                <Field label="Kurum / Okul Adı" name="schoolName" placeholder="Kurum adı" />
              </>
            )}
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm leading-6 text-white/70">
            <input className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 accent-teal-500" name="termsAccepted" required type="checkbox" />
            <span>KVKK ve Kullanım Koşulları&apos;nı okudum, kabul ediyorum.</span>
          </label>

          <button
            className={`w-full rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isStudent
                ? "bg-gradient-to-r from-teal-600 to-cyan-600 shadow-[0_14px_28px_-16px_rgba(13,148,136,0.95)] hover:from-teal-500 hover:to-cyan-500"
                : "bg-gradient-to-r from-[#8f123a] to-[#5f0826] shadow-[0_14px_28px_-16px_rgba(132,21,57,0.95)] hover:from-[#a91645] hover:to-[#6d0a2d]"
            }`}
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Kayıt oluşturuluyor..." : isStudent ? "Öğrenci Hesabı Oluştur" : "Öğretmen Girişine Git"}
          </button>
        </form>

        {state.error ? <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/12 px-4 py-3 text-center text-xs leading-5 text-red-100">{state.error}</p> : null}
        {!isStudent ? <p className="mt-4 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-center text-xs leading-5 text-white/55">Öğretmen hesabı oluşturulduktan sonra giriş ekranına yönlendirileceksin.</p> : null}

        <p className="mt-6 text-center text-sm text-white/65">
          Zaten hesabın var mı?{" "}
          <Link className="font-semibold text-teal-200 transition hover:text-white" href="/login">
            Giriş Yap
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({ label, name, placeholder, required = false, type = "text" }: { label: string; name: string; placeholder: string; required?: boolean; type?: string }) {
  return (
    <label className="block space-y-2 text-sm font-medium text-white/80">
      <span>{label}</span>
      <input
        className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3.5 text-white outline-none transition placeholder:text-white/35 focus:border-teal-300/45 focus:bg-white/14 focus:ring-2 focus:ring-teal-300/20"
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}
