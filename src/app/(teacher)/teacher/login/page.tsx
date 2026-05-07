import Link from "next/link";
import { ArrowLeft, UserRoundCheck } from "lucide-react";

import { TeacherLoginForm } from "@/features/auth/components/teacher-login-form";

export default function TeacherLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#140814] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(147,31,65,0.48),transparent_34%),radial-gradient(circle_at_83%_72%,rgba(13,148,136,0.36),transparent_38%),linear-gradient(135deg,#260718_0%,#3a0d22_42%,#062b30_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:56px_56px] opacity-20" />

      <section className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-7 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-8">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white" href="/">
          <ArrowLeft aria-hidden className="h-4 w-4" />
          Ana sayfaya dön
        </Link>

        <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#b61f52] to-[#5f0826] text-white shadow-[0_16px_36px_-10px_rgba(132,21,57,0.75)]">
          <UserRoundCheck aria-hidden className="h-8 w-8" strokeWidth={1.7} />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">Öğretmen / Koç Girişi</h1>
        <p className="mt-3 text-sm leading-6 text-white/65">
          Yönetim paneline giriş yaparak testleri, soru havuzunu ve öğrenci sonuçlarını takip et.
        </p>
        <TeacherLoginForm />
      </section>
    </main>
  );
}
