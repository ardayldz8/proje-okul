import Link from "next/link";

import { Advertisement } from "@/components/advertisement";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-700">Online Test Platformu</p>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Ders sec, testi coz, sonucunu aninda gor.</h1>
          <p className="text-lg leading-8 text-slate-600">
            Ogrenciler uyelik acmadan teste baslayabilir. Hocalar soru havuzu, testler ve ogrenci sonuclarini tek panelden takip eder.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link className="rounded-full bg-indigo-950 px-6 py-3 text-center font-semibold text-white" href="/online-test">
            Online Teste Basla
          </Link>
          <Link className="rounded-full border border-slate-300 px-6 py-3 text-center font-semibold text-slate-900" href="/teacher/login">
            Hoca Girisi
          </Link>
        </div>

        <Advertisement placement="home" />
      </section>
    </main>
  );
}
