import Link from "next/link";
import { ArrowRight, BookOpenCheck, GraduationCap, ShieldCheck, UserRound, UserRoundCheck } from "lucide-react";

import { Advertisement } from "@/components/advertisement";

const benefits = [
  {
    title: "Ogrenci hesabi ile test",
    description: "Ogrenciler hesap olusturup giris yaparak testlere ulasir ve gecmisini takip eder.",
    icon: GraduationCap,
  },
  {
    title: "Hoca icin kontrol paneli",
    description: "Sorular, testler ve sonuc takibi tek panelde toplanir.",
    icon: BookOpenCheck,
  },
  {
    title: "Guvenli sonuc akisi",
    description: "Attempt erisimi imzali cookie ve server-side kontrollerle korunur.",
    icon: ShieldCheck,
  },
];

const metrics = [
  { label: "Ders", value: "3+" },
  { label: "Demo soru", value: "5+" },
  { label: "Panel", value: "4" },
];

const authPaths = [
  {
    title: "Ogrenci Girisi",
    description: "Hesabinla gir, dashboard uzerinden deneme gecmisini ve yeni testlerini takip et.",
    href: "/student/login",
    icon: UserRound,
    tone: "teal",
  },
  {
    title: "Hoca Girisi",
    description: "Soru havuzu, testler, ogrenciler ve sonuclar icin hoca paneline gir.",
    href: "/teacher/login",
    icon: UserRoundCheck,
    tone: "rose",
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#100713] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(20,184,166,0.28),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(194,50,99,0.32),transparent_34%),linear-gradient(135deg,#190715_0%,#111827_48%,#05272c_100%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:58px_58px] opacity-20" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-white/8 px-5 py-3 shadow-[0_18px_70px_-42px_rgba(0,0,0,0.95)] backdrop-blur-xl">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-700 text-slate-950 shadow-[0_16px_38px_-20px_rgba(45,212,191,0.95)]">
              <BookOpenCheck aria-hidden className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.28em] text-white/90">Testoria</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-semibold text-white/68">
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white" href="/student/login">
              Ogrenci Paneli
            </Link>
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white" href="/teacher/login">
              Hoca Girisi
            </Link>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-teal-200/20 bg-teal-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-teal-100 shadow-[0_18px_44px_-30px_rgba(45,212,191,0.95)]">
              Ogrenci ve hoca icin tek giris noktasi
            </p>
            <h1 className="mt-7 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              Dogru girisle basla, takibi panelden yonet.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
              Ogrenciler hesaplariyla girip dashboard uzerinden test secimine ve deneme gecmisine ulasir. Hocalar kendi panellerinden soru, test ve ogrenci sonuc yonetimini yapar.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4 text-sm font-bold text-slate-950 shadow-[0_22px_54px_-28px_rgba(45,212,191,0.95)] transition hover:-translate-y-0.5 hover:from-teal-300 hover:to-cyan-500" href="/student/login">
                Ogrenci girisine git
                <ArrowRight aria-hidden className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-white/14 bg-white/8 px-6 py-4 text-sm font-bold text-white shadow-[0_22px_54px_-34px_rgba(0,0,0,0.95)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/12" href="/teacher/login">
                Hoca girisine git
                <ArrowRight aria-hidden className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-xl">
                  <p className="text-2xl font-black text-white">{metric.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/48">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-4 lg:grid-cols-2">
              {authPaths.map((path) => (
                <PortalCard
                  key={path.title}
                  description={path.description}
                  href={path.href}
                  icon={path.icon}
                  label="Giris"
                  title={path.title}
                  tone={path.tone}
                />
              ))}
            </div>

            <div className="rounded-[2rem] border border-white/12 bg-white/10 p-6 shadow-[0_24px_74px_-34px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">Akis</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Test secimi dashboard uzerinden de surer</h2>
              <p className="mt-4 text-sm leading-7 text-white/58">Ogrenci giris yaptiktan sonra dashboard icinden yeni teste gecebilir. Hoca ise kendi panelinden test ve sonuclari yonetir. Public test listeleme sadece giris oncesi kesif katmani olarak kalir.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="rounded-2xl border border-white/14 bg-white/8 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/12" href="/student/dashboard">
                  Ogrenci dashboard
                </Link>
                <Link className="rounded-2xl border border-white/14 bg-white/8 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/12" href="/teacher/dashboard">
                  Hoca dashboard
                </Link>
              </div>
            </div>

            <Advertisement placement="home" />
          </div>
        </div>

        <section className="relative z-10 grid gap-4 pb-10 md:grid-cols-3">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_56px_-36px_rgba(0,0,0,0.95)] backdrop-blur-xl">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-teal-200/18 bg-teal-400/12 text-teal-100">
                <benefit.icon aria-hidden className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-white">{benefit.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/58">{benefit.description}</p>
            </article>
          ))}
        </section>

        <footer className="relative z-10 flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>Testoria MVP - online test, soru yonetimi ve sonuc takibi.</p>
          <nav className="flex flex-wrap gap-4">
            <Link className="transition hover:text-white" href="/kvkk">KVKK</Link>
            <Link className="transition hover:text-white" href="/gizlilik-politikasi">Gizlilik</Link>
            <Link className="transition hover:text-white" href="/kullanim-kosullari">Kullanim Kosullari</Link>
            <Link className="transition hover:text-white" href="/iletisim">Iletisim</Link>
          </nav>
        </footer>
      </section>
    </main>
  );
}

function PortalCard({ className, description, href, icon: Icon, label, title, tone }: { className?: string; description: string; href: string; icon: typeof GraduationCap; label: string; title: string; tone: "teal" | "rose" | "indigo" }) {
  const styles = {
    teal: "from-teal-400/20 to-cyan-500/10 text-teal-100 ring-teal-200/20",
    rose: "from-[#c23263]/24 to-[#5f0826]/14 text-rose-100 ring-rose-200/20",
    indigo: "from-indigo-400/24 to-cyan-500/12 text-cyan-100 ring-cyan-200/18",
  }[tone];

  return (
    <Link className={`group min-h-80 rounded-[2rem] border border-white/12 bg-white/10 p-6 shadow-[0_24px_74px_-34px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/[0.13] ${className ?? ""}`} href={href}>
      <div className={`grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br ${styles} ring-1`}>
        <Icon aria-hidden className="h-8 w-8" strokeWidth={1.75} />
      </div>
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-white/45">{label}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-white">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-white/58">{description}</p>
      <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white">
        Devam et
        <ArrowRight aria-hidden className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
