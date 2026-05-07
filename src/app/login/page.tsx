"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, GraduationCap } from "lucide-react";

import { loginStudentPortal, type StudentAuthState } from "@/features/student-portal/actions";

const initialState: StudentAuthState = {};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(loginStudentPortal, initialState);
  const next = searchParams.get("next") ?? "";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#140814] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(147,31,65,0.42),transparent_34%),radial-gradient(circle_at_83%_72%,rgba(13,148,136,0.48),transparent_38%),linear-gradient(135deg,#260718_0%,#3a0d22_42%,#062b30_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:56px_56px] opacity-20" />

      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-7 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-8">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white" href="/">
          <ArrowLeft aria-hidden className="h-4 w-4" />
          Ana sayfaya dön
        </Link>

        <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-700 text-white shadow-[0_16px_36px_-10px_rgba(13,148,136,0.75)]">
          <GraduationCap aria-hidden className="h-8 w-8" strokeWidth={1.7} />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">Öğrenci Girişi</h1>
        <p className="mt-3 text-sm leading-6 text-white/65">Hesabına giriş yaparak testlerine devam et.</p>

        <form action={formAction} className="mt-8 space-y-5">
          <input name="next" type="hidden" value={next} />
          <label className="block space-y-2 text-sm font-medium text-white/80">
            <span>E-posta</span>
            <input
              className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3.5 text-white outline-none transition placeholder:text-white/35 focus:border-teal-300/45 focus:bg-white/14 focus:ring-2 focus:ring-teal-300/20"
              name="email"
              placeholder="ornek@mail.com"
              required
              type="email"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-white/80">
            <span>Şifre</span>
            <input
              className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3.5 text-white outline-none transition placeholder:text-white/35 focus:border-teal-300/45 focus:bg-white/14 focus:ring-2 focus:ring-teal-300/20"
              name="password"
              placeholder="Şifreni gir"
              required
              type="password"
            />
          </label>

          <div className="flex items-center justify-between gap-4 text-sm">
            <Link className="font-medium text-white/60 transition hover:text-white" href="#">
              Şifremi unuttum
            </Link>
          </div>

          <button
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_-16px_rgba(13,148,136,0.95)] transition hover:from-teal-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        {state.error ? <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/12 px-4 py-3 text-center text-xs leading-5 text-red-100">{state.error}</p> : null}

        <p className="mt-6 text-center text-sm text-white/65">
          Hesabın yok mu?{" "}
          <Link className="font-semibold text-teal-200 transition hover:text-white" href="/register">
            Üye Ol
          </Link>
        </p>
      </div>
    </main>
  );
}
