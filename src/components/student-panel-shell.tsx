"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, GraduationCap, Home, LogOut, UserRound } from "lucide-react";

import { logoutStudentPortal } from "@/features/student-portal/actions";

const navigation = [
  { label: "Dashboard", href: "/student/dashboard", icon: BarChart3 },
  { label: "Denemeler", href: "/student/attempts", icon: ClipboardList },
  { label: "Teste Basla", href: "/online-test", icon: GraduationCap },
];

function getPageTitle(pathname: string) {
  const current = navigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return current?.label ?? "Ogrenci Paneli";
}

export function StudentPanelShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/student/login") {
    return children;
  }

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-950 lg:flex">
      <aside className="border-b border-white/10 bg-slate-950 px-4 py-4 text-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
        <div className="flex items-center justify-between gap-4 lg:block">
          <Link className="flex items-center gap-3" href="/student/dashboard">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-teal-300 to-cyan-600 text-slate-950 shadow-[0_18px_42px_-24px_rgba(45,212,191,0.95)]">
              <UserRound aria-hidden className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-xs font-bold uppercase tracking-[0.24em] text-teal-100/70">Testoria</span>
              <span className="block text-lg font-black tracking-tight text-white">Ogrenci Paneli</span>
            </span>
          </Link>

          <Link className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden" href="/">
            Ana Sayfa
          </Link>
        </div>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-9 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                className={`flex min-w-max items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition lg:w-full ${
                  isActive
                    ? "border border-teal-200/20 bg-gradient-to-r from-teal-400/22 to-cyan-500/12 text-white shadow-[0_18px_48px_-28px_rgba(45,212,191,0.85)]"
                    : "text-white/62 hover:bg-white/8 hover:text-white"
                }`}
                href={item.href}
              >
                <item.icon aria-hidden className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 hidden rounded-3xl border border-white/10 bg-white/7 p-4 text-sm leading-6 text-white/58 lg:block">
          <p className="font-semibold text-white">Panel akislari</p>
          <p className="mt-2">Denemeleriniz, tanimli hocalariniz ve sonuc gecmisiniz gercek ogrenci verileriyle gosterilir.</p>
        </div>

        <div className="mt-6 hidden gap-3 lg:grid">
          <Link className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/62 transition hover:bg-white/8 hover:text-white" href="/">
            <Home aria-hidden className="h-4 w-4" />
            Ana sayfaya don
          </Link>
          <form action={logoutStudentPortal}>
            <button className="flex w-full items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-left text-sm font-semibold text-white/62 transition hover:bg-white/8 hover:text-white" type="submit">
              <LogOut aria-hidden className="h-4 w-4" />
              Cikis yap
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1 bg-slate-50">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Ogrenci Paneli</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{pageTitle}</h1>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">Kisisel veri modu</div>
          </div>
        </header>

        <div>{children}</div>
      </div>
    </div>
  );
}
