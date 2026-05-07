"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdBanner } from "@/components/AdBanner";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Home,
  LogOut,
  Settings,
  Target,
  Users,
  XCircle,
} from "lucide-react";

type DashboardStudent = {
  fullName: string;
  gradeLevel: string;
};

type DashboardStats = {
  averageScore: number;
  completedTestCount: number;
  inProgressTestCount: number;
  missingTopicCount: number;
  coachStatus: string;
};

export type StudentDashboardClientProps = {
  student: DashboardStudent;
  stats: DashboardStats;
  classes: string[];
  notifications: string[];
};

const menuItems = [
  { label: "Ana Sayfa", icon: Home, href: "/student/dashboard", active: true },
  { label: "Sınıflarım", icon: Users, href: "/student/classes" },
  { label: "Derslerim", icon: BookOpen, href: "/student/courses" },
  { label: "Testlerim", icon: ClipboardList, href: "/student/tests" },
  { label: "Sonuçlarım", icon: BarChart3, href: "/student/results" },
  { label: "Eksik Konularım", icon: Target, href: "/student/missing-topics" },
  { label: "Yanlış Sorularım", icon: XCircle, href: "/student/wrong-questions" },
  { label: "Koç İstekleri", icon: Users, href: "/student/coach-requests" },
  { label: "Ayarlar", icon: Settings, href: "/student/settings" },
];

export function StudentDashboardClient({ student, stats, classes, notifications }: StudentDashboardClientProps) {
  const firstName = student.fullName.split(" ")[0] || student.fullName;
  const today = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());
  const weekday = new Intl.DateTimeFormat("tr-TR", { weekday: "long" }).format(new Date());

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06111f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_16%,rgba(13,148,136,0.42),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(20,184,166,0.25),transparent_28%),radial-gradient(circle_at_70%_60%,rgba(194,50,99,0.36),transparent_28%),linear-gradient(135deg,#1c0613_0%,#071426_44%,#052d35_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:64px_64px] opacity-25" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-4 p-3 lg:flex-row lg:p-4">
        <Sidebar student={student} />

        <section className="flex-1 rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-4 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-6">
          <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Merhaba, {firstName}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/64">Bugünkü ilerlemeni tek bakışta gör, sınıflarına hızlıca ulaş ve yeni bildirimleri sağ üstten takip et.</p>
              <div className="mt-4 inline-flex rounded-full border border-teal-200/18 bg-teal-400/12 px-4 py-2 text-xs font-bold text-teal-50 shadow-[0_0_28px_-16px_rgba(20,184,166,0.9)]">Sınıf seviyen: {student.gradeLevel}</div>
            </div>
            <div className="flex flex-wrap items-start gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm shadow-[0_18px_42px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                <CalendarDays aria-hidden className="h-4 w-4 text-teal-200" />
                <div>
                  <p className="font-semibold">{today}</p>
                  <p className="text-xs text-white/50">{weekday}</p>
                </div>
              </div>
              <NotificationBell notifications={notifications} />
            </div>
          </header>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={BarChart3} label="Ortalama Puan" value={String(stats.averageScore)} suffix="%" description="Tamamlanan test ortalaması" tone="rose" />
            <StatCard icon={ClipboardCheck} label="Tamamlanan Test" value={String(stats.completedTestCount)} suffix="Adet" description={`${stats.inProgressTestCount} test devam ediyor`} tone="teal" />
            <StatCard icon={Target} label="Eksik Konu" value={String(stats.missingTopicCount)} suffix="Konu" description="Yanlış cevaplardan hesaplandı" tone="amber" />
            <StatCard icon={Users} label="Koç Durumu" value={stats.coachStatus} description="Atanmış koç ilişkisi" tone="violet" />
          </section>

          <div className="mt-6">
            <AdBanner placement="student-dashboard" />
          </div>

          <section className="mt-6 rounded-3xl border border-teal-200/15 bg-teal-400/10 p-5 shadow-[0_18px_56px_-34px_rgba(20,184,166,0.75)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#8f123a]/28 text-pink-200 ring-1 ring-white/10">
                    <Users aria-hidden className="h-4 w-4" />
                  </div>
                  <h2 className="font-bold">Sınıflarım</h2>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {classes.length > 0 ? classes.map((className) => <Badge key={className} tone="teal">{className}</Badge>) : <Badge tone="muted">Henüz atanmış sınıf/koç yok</Badge>}
                </div>
              </div>
              <Link className="inline-flex w-fit items-center gap-2 rounded-2xl border border-teal-200/20 bg-teal-400/14 px-5 py-3 text-sm font-semibold text-teal-100 transition hover:bg-teal-400/20" href="/student/classes">
                Sınıflarımı Gör <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function NotificationBell({ notifications }: { notifications: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const visibleNotifications = notifications.length > 0 ? notifications : ["Şu anda yeni bildirimin yok."];

  return (
    <div className="relative self-start lg:self-auto">
      <button className="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/12 bg-white/8 text-white shadow-[0_18px_42px_-24px_rgba(20,184,166,0.9)] backdrop-blur-xl transition hover:border-teal-200/30 hover:bg-white/12" type="button" aria-label="Bildirimleri aç" onClick={() => setIsOpen((open) => !open)}>
        <Bell aria-hidden className="h-5 w-5 text-teal-100" strokeWidth={1.9} />
        {notifications.length > 0 ? <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#c23263] text-[10px] font-bold text-white shadow-[0_0_18px_rgba(194,50,99,0.85)]">{notifications.length}</span> : null}
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-14 z-30 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-white/14 bg-[#071426]/88 p-3 shadow-[0_24px_80px_-30px_rgba(20,184,166,0.75)] backdrop-blur-2xl">
          <div className="mb-2 flex items-center justify-between px-2">
            <p className="text-sm font-bold text-white">Bildirimler</p>
            <span className="rounded-full border border-[#8f123a]/40 bg-[#8f123a]/24 px-2 py-0.5 text-[10px] font-bold text-rose-100">{notifications.length} yeni</span>
          </div>
          <div className="space-y-2">
            {visibleNotifications.map((notification) => (
              <div key={notification} className="rounded-2xl border border-white/8 bg-white/7 px-3 py-3 text-sm text-white/76 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-teal-200/20 hover:bg-teal-400/10">
                {notification}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Sidebar({ student }: { student: DashboardStudent }) {
  const router = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const initials = student.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "Ö";

  return (
    <>
      <aside className="rounded-[1.75rem] border border-white/12 bg-white/8 p-4 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.9)] backdrop-blur-2xl lg:flex lg:w-64 lg:shrink-0 lg:flex-col">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-teal-400/24 to-[#8f123a]/24 ring-1 ring-white/15">
            <BookOpen aria-hidden className="h-6 w-6 text-teal-100" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-base font-bold uppercase leading-tight tracking-[0.16em]">Öğrenci</p>
            <p className="text-base font-bold uppercase leading-tight tracking-[0.16em] text-white/80">Paneli</p>
          </div>
        </div>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
          {menuItems.map((item) => (
            <Link key={item.label} className={`flex min-w-max items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition lg:w-full ${item.active ? "border border-teal-200/18 bg-gradient-to-r from-teal-500/32 to-[#8f123a]/32 text-white shadow-[0_16px_42px_-24px_rgba(20,184,166,0.8)]" : "text-white/68 hover:bg-white/8 hover:text-white"}`} href={item.href}>
              <item.icon aria-hidden className="h-4 w-4" strokeWidth={1.8} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:mt-auto lg:grid-cols-1">
          <div className="rounded-2xl border border-white/12 bg-white/8 p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#b61f52] to-teal-600 text-sm font-bold">{initials}</div>
              <div>
                <p className="text-sm font-semibold">{student.fullName}</p>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 px-4 py-3 text-sm font-semibold text-white/72 transition hover:bg-white/10 hover:text-white" type="button" onClick={() => setIsLogoutOpen(true)}>
            <LogOut aria-hidden className="h-4 w-4" strokeWidth={1.8} />
            Çıkış Yap
          </button>
        </div>
      </aside>
      {isLogoutOpen ? <LogoutModal onCancel={() => setIsLogoutOpen(false)} onConfirm={() => router.push("/student/logout")} /> : null}
    </>
  );
}

function LogoutModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-white/15 bg-[#071426]/92 p-6 shadow-[0_28px_90px_-28px_rgba(20,184,166,0.85)] backdrop-blur-2xl">
        <h2 className="text-2xl font-bold">Çıkış yapmak istiyor musun?</h2>
        <p className="mt-3 text-sm leading-6 text-white/62">Oturumun kapatılacak ve ana sayfaya yönlendirileceksin.</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button className="rounded-2xl border border-white/10 bg-white/8 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/12 hover:text-white" type="button" onClick={onCancel}>Vazgeç</button>
          <button className="rounded-2xl border border-teal-200/20 bg-gradient-to-r from-teal-500/35 to-[#8f123a]/35 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_-26px_rgba(20,184,166,0.95)] transition hover:from-teal-500/45 hover:to-[#8f123a]/45" type="button" onClick={onConfirm}>Çıkış Yap</button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, suffix, description, tone }: { icon: typeof BookOpen; label: string; value: string; suffix?: string; description: string; tone: "rose" | "teal" | "amber" | "violet" }) {
  const toneClass = {
    rose: "from-[#c23263]/35 to-[#5f0826]/20 text-rose-100",
    teal: "from-teal-500/32 to-cyan-500/10 text-teal-100",
    amber: "from-amber-500/28 to-orange-500/10 text-amber-100",
    violet: "from-violet-500/28 to-violet-500/10 text-violet-100",
  }[tone];

  return (
    <article className="rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${toneClass} ring-1 ring-white/10`}>
        <Icon aria-hidden className="h-5 w-5" />
      </div>
      <p className="mt-4 text-xs text-white/55">{label}</p>
      <div className="mt-1 flex items-end gap-1">
        <p className={`font-bold tracking-tight ${value.length > 4 ? "text-2xl" : "text-3xl"}`}>{value}</p>
        {suffix ? <span className="pb-1 text-xs font-bold text-teal-200">{suffix}</span> : null}
      </div>
      <p className="mt-2 text-xs text-white/48">{description}</p>
    </article>
  );
}

function Badge({ children, tone }: { children: ReactNode; tone: string }) {
  const toneClass =
    tone === "teal"
      ? "border-teal-200/15 bg-teal-400/16 text-teal-100"
      : tone === "amber"
        ? "border-amber-300/15 bg-amber-400/14 text-amber-100"
        : tone === "muted"
          ? "border-white/10 bg-white/8 text-white/55"
          : "border-rose-300/15 bg-[#8f123a]/35 text-rose-100";

  return <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold ${toneClass}`}>{children}</span>;
}
