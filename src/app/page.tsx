import Link from "next/link";
import { ArrowRight, GraduationCap, UserRoundCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#140814] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(147,31,65,0.42),transparent_34%),radial-gradient(circle_at_83%_72%,rgba(13,148,136,0.48),transparent_38%),linear-gradient(135deg,#260718_0%,#3a0d22_42%,#062b30_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:56px_56px] opacity-25" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-10 grid grid-cols-8 gap-3 opacity-20">
          {Array.from({ length: 48 }).map((_, index) => (
            <span key={index} className="h-1 w-1 rounded-full bg-white" />
          ))}
        </div>
        <div className="absolute -right-28 -top-24 h-72 w-72 rounded-[45%_55%_58%_42%] border border-white/10 bg-white/5 blur-[1px] sm:h-96 sm:w-96" />
        <div className="absolute -bottom-24 -left-28 h-80 w-80 rounded-[60%_40%_45%_55%] border border-teal-200/15 bg-teal-200/8 sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute bottom-8 right-12 grid grid-cols-9 gap-2 opacity-15">
          {Array.from({ length: 54 }).map((_, index) => (
            <span key={index} className="h-1 w-1 rounded-full bg-teal-100" />
          ))}
        </div>
        <div className="absolute left-1/2 top-1/2 h-64 w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/8 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid w-full max-w-[19rem] grid-cols-1 gap-5 sm:max-w-[22rem] lg:max-w-[46rem] lg:grid-cols-2 lg:gap-7">
          <Link
            href="/login"
            className="group flex min-h-[25rem] flex-col items-center rounded-[2rem] border border-white/75 bg-gradient-to-b from-white/95 to-[#edfafa]/95 px-7 py-8 text-center shadow-[0_28px_70px_-20px_rgba(0,0,0,0.55),0_0_42px_-22px_rgba(20,184,166,0.9)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_82px_-22px_rgba(0,0,0,0.62),0_0_52px_-20px_rgba(20,184,166,0.95)] sm:min-h-[26.5rem] sm:px-8 sm:py-9"
          >
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-700 text-white shadow-[0_16px_36px_-10px_rgba(13,148,136,0.75)] ring-[12px] ring-teal-100/80 transition duration-300 group-hover:scale-105">
              <GraduationCap aria-hidden className="h-9 w-9" strokeWidth={1.65} />
            </div>
            <h2 className="mt-9 text-2xl font-bold leading-tight tracking-tight text-slate-950">Öğrenci Girişi</h2>
            <div className="mt-4 h-1 w-10 rounded-full bg-gradient-to-r from-teal-600 to-cyan-500" />
            <p className="mt-6 max-w-[13.5rem] text-[0.95rem] leading-7 text-slate-600">
              Hesabına giriş yap, seviyeni seç ve test çözmeye devam et.
            </p>
            <div className="mt-auto flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_-16px_rgba(13,148,136,0.95)] transition duration-300 group-hover:from-teal-500 group-hover:to-cyan-500">
              <span>Giriş Yap</span>
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
            </div>
          </Link>

          <Link
            href="/teacher/login"
            className="group flex min-h-[25rem] flex-col items-center rounded-[2rem] border border-white/75 bg-gradient-to-b from-white/95 to-[#fbf5f7]/95 px-7 py-8 text-center shadow-[0_28px_70px_-20px_rgba(0,0,0,0.55),0_0_42px_-22px_rgba(132,21,57,0.85)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_82px_-22px_rgba(0,0,0,0.62),0_0_52px_-20px_rgba(132,21,57,0.95)] sm:min-h-[26.5rem] sm:px-8 sm:py-9"
          >
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#b61f52] to-[#5f0826] text-white shadow-[0_16px_36px_-10px_rgba(132,21,57,0.75)] ring-[12px] ring-rose-100/80 transition duration-300 group-hover:scale-105">
              <UserRoundCheck aria-hidden className="h-9 w-9" strokeWidth={1.65} />
            </div>
            <h2 className="mt-9 text-2xl font-bold leading-tight tracking-tight text-slate-950">Öğretmen / Koç Girişi</h2>
            <div className="mt-4 h-1 w-10 rounded-full bg-gradient-to-r from-[#8f123a] to-[#c23263]" />
            <p className="mt-6 max-w-[14rem] text-[0.95rem] leading-7 text-slate-600">
              Soru havuzunu, testleri ve öğrenci sonuçlarını tek panelden yönet.
            </p>
            <div className="mt-auto flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-[#8f123a] to-[#5f0826] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_-16px_rgba(132,21,57,0.95)] transition duration-300 group-hover:from-[#a91645] group-hover:to-[#6d0a2d]">
              <span>Giriş Yap</span>
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
            </div>
          </Link>
        </div>

        <div className="mt-9 flex justify-center">
          <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-center text-sm leading-snug text-white/78 shadow-[0_18px_48px_-22px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:px-7">
            <span>Henüz hesabın yok mu?</span>
            <Link href="/register" className="inline-flex items-center gap-2 font-semibold text-teal-200 transition hover:text-white">
              <span>Üye Ol</span>
              <ArrowRight aria-hidden className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
