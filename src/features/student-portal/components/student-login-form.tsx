"use client";

import { useState } from "react";
import { useActionState } from "react";

import { loginStudentPortal, registerStudentPortal, type StudentPortalAuthState } from "@/features/student-portal/actions";

const initialAuthState: StudentPortalAuthState = {};

export function StudentLoginForm({ next }: { next?: string }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, loginAction, isLoginPending] = useActionState(loginStudentPortal, initialAuthState);
  const [registerState, registerAction, isRegisterPending] = useActionState(registerStudentPortal, initialAuthState);
  const isPending = isLoginPending || isRegisterPending;
  const activeError = mode === "login" ? loginState.error : registerState.error;

  return (
    <form className="mt-8 space-y-6">
      <input name="next" type="hidden" value={next ?? ""} />

      <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
        <button className={`rounded-[1rem] px-4 py-3 text-sm font-bold transition ${mode === "login" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`} onClick={() => setMode("login")} type="button">
          Giris Yap
        </button>
        <button className={`rounded-[1rem] px-4 py-3 text-sm font-bold transition ${mode === "register" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`} onClick={() => setMode("register")} type="button">
          Kayit Ol
        </button>
      </div>

      {mode === "register" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-slate-700" htmlFor="fullName">
            Ad soyad
          </label>
          <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none ring-teal-700 transition placeholder:text-slate-400 focus:ring-2" id="fullName" name="fullName" placeholder="Adiniz soyadiniz" required={mode === "register"} type="text" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700" htmlFor="gradeLevel">
              Sinif seviyesi
            </label>
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none ring-teal-700 transition placeholder:text-slate-400 focus:ring-2" id="gradeLevel" name="gradeLevel" placeholder="8. Sinif" required={mode === "register"} type="text" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700" htmlFor="schoolName">
              Okul
            </label>
          <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none ring-teal-700 transition placeholder:text-slate-400 focus:ring-2" id="schoolName" name="schoolName" placeholder="Opsiyonel" type="text" />
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700" htmlFor="email">
          E-posta
        </label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none ring-teal-700 transition placeholder:text-slate-400 focus:ring-2"
          id="email"
          name="email"
          placeholder="ogrenci@example.com"
          required
          type="email"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700" htmlFor="password">
          Sifre
        </label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none ring-teal-700 transition placeholder:text-slate-400 focus:ring-2"
          id="password"
          name="password"
          placeholder="En az 8 karakter"
          required
          type="password"
        />
      </div>

      <div aria-live="polite" className="space-y-3">
        {activeError ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{activeError}</p> : null}
      </div>

      <div className="space-y-3">
        <button className="w-full rounded-2xl bg-indigo-950 px-5 py-3.5 font-bold text-white transition hover:bg-indigo-900 disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} formAction={mode === "login" ? loginAction : registerAction} type="submit">
          {mode === "login" ? (isLoginPending ? "Giris yapiliyor..." : "Giris Yap") : isRegisterPending ? "Kayit olusturuluyor..." : "Kayit Ol"}
        </button>
        <p className="text-sm leading-6 text-slate-500">
          {mode === "login" ? "Hesabin varsa giris yapip ogrenci dashboardina gec." : "Yeni hesap olusturdugunda ogrenci dashboardina yonlendirilirsin."}
        </p>
      </div>
    </form>
  );
}
