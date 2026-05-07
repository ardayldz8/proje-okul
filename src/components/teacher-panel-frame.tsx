import type { ReactNode } from "react";
import Link from "next/link";
import { BarChart3, BookOpen, ClipboardList, LayoutDashboard, LogOut, Settings, Users, type LucideIcon } from "lucide-react";

type MenuItem = { label: string; icon: LucideIcon; href: string; active?: boolean; badge?: string };

const baseMenuItems: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/teacher/dashboard" },
  { label: "Soru Havuzu", icon: BookOpen, href: "/teacher/questions" },
  { label: "Testler", icon: ClipboardList, href: "/teacher/tests" },
  { label: "Sınıflar", icon: Users, href: "/teacher/students", badge: "3" },
  { label: "Sonuçlar & Raporlar", icon: BarChart3, href: "/teacher/results" },
  { label: "Ayarlar", icon: Settings, href: "/teacher/settings" },
];

export function TeacherPanelFrame({ activeHref, children, teacherName }: { activeHref: string; children: ReactNode; teacherName: string }) {
  const initials = teacherName.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "K";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0710] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_20%,rgba(147,31,65,0.5),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(13,148,136,0.32),transparent_32%),radial-gradient(circle_at_74%_48%,rgba(194,50,99,0.34),transparent_24%),linear-gradient(135deg,#270716_0%,#120d1d_42%,#06272d_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:64px_64px] opacity-25" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-4 p-3 lg:flex-row lg:p-4">
        <aside className="rounded-[1.75rem] border border-white/12 bg-white/8 p-4 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.9)] backdrop-blur-2xl lg:flex lg:w-64 lg:shrink-0 lg:flex-col">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-white/16 to-white/6 ring-1 ring-white/15">
              <LayoutDashboard aria-hidden className="h-6 w-6 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-base font-bold uppercase leading-tight tracking-[0.25em]">Koç</p>
              <p className="text-base font-bold uppercase leading-tight tracking-[0.25em] text-white/80">Paneli</p>
            </div>
          </div>
          <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
            {baseMenuItems.map((item) => {
              const active = item.href === activeHref;
              return (
                <Link
                  key={item.label}
                  className={`flex min-w-max items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition lg:w-full ${active ? "border border-rose-300/18 bg-gradient-to-r from-[#8f123a]/55 to-[#5f0826]/35 text-white shadow-[0_16px_42px_-24px_rgba(194,50,99,0.9)]" : "text-white/68 hover:bg-white/8 hover:text-white"}`}
                  href={item.href}
                >
                  <item.icon aria-hidden className="h-4 w-4" strokeWidth={1.8} />
                  <span>{item.label}</span>
                  {item.badge ? <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-[#c23263] px-1.5 text-[10px] font-bold text-white">{item.badge}</span> : null}
                </Link>
              );
            })}
          </nav>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:mt-auto lg:grid-cols-1">
            <div className="rounded-2xl border border-white/12 bg-white/8 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#b61f52] to-[#5f0826] text-sm font-bold">{initials}</div>
                <div>
                  <p className="text-sm font-semibold">{teacherName}</p>
                </div>
              </div>
            </div>
            <Link
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 px-4 py-3 text-sm font-semibold text-white/72 transition hover:bg-white/10 hover:text-white"
              href="/api/auth/signout?callbackUrl=/"
              prefetch={false}
            >
              <LogOut aria-hidden className="h-4 w-4" strokeWidth={1.8} />
              Çıkış Yap
            </Link>
          </div>
        </aside>
        <section className="flex-1 rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-4 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-6 lg:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}

export function TeacherPanelHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-white/64">{subtitle}</p>
    </header>
  );
}

export function TeacherEmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/8 p-8 text-center shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-white/58">{text}</p>
    </div>
  );
}
