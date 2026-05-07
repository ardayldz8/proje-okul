import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, ClipboardList, Home, LogOut, Settings, Target, Users, XCircle } from "lucide-react";
import { notFound } from "next/navigation";

import { getStudentTestsData } from "@/features/student-portal/queries";
import { requireStudentSession } from "@/lib/student-session";

const menuItems = [
  { label: "Ana Sayfa", icon: Home, href: "/student/dashboard" },
  { label: "Sınıflarım", icon: Users, href: "/student/classes" },
  { label: "Derslerim", icon: BookOpen, href: "/student/courses" },
  { label: "Testlerim", icon: ClipboardList, href: "/student/tests", active: true },
  { label: "Sonuçlarım", icon: BarChart3, href: "/student/results" },
  { label: "Eksik Konularım", icon: Target, href: "/student/missing-topics" },
  { label: "Yanlış Sorularım", icon: XCircle, href: "/student/wrong-questions" },
  { label: "Koç İstekleri", icon: Users, href: "/student/coach-requests" },
  { label: "Ayarlar", icon: Settings, href: "/student/settings" },
];

export default async function StudentTestsPage() {
  const sessionStudent = await requireStudentSession();
  const data = await getStudentTestsData(sessionStudent.id);

  if (!data.student) {
    notFound();
  }

  return (
    <StudentShell studentName={data.student.fullName}>
      <Header title="Testlerim" subtitle="Aktif, devam eden ve tamamlanan testlerini takip et." />
      <section className="mt-6 space-y-4">
        {data.tests.length > 0 ? (
          data.tests.map((test) => (
            <article key={`${test.status}-${test.id}`} className="grid gap-4 rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl md:grid-cols-[1fr_180px_170px] md:items-center">
              <div>
                <h2 className="text-lg font-bold">{test.title}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone={test.status === "Tamamlandı" ? "teal" : test.status === "Devam Ediyor" ? "amber" : "muted"}>{test.status}</Badge>
                  <Badge tone="rose">{test.course}</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-white/50">İlerleme</p>
                <div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-teal-300 to-cyan-400" style={{ width: `${test.progress}%` }} /></div>
              </div>
              <Link className="inline-flex justify-center gap-2 rounded-2xl border border-teal-200/15 bg-teal-400/12 px-4 py-3 text-sm font-semibold text-teal-100 transition hover:bg-teal-400/18" href={test.href}>{test.action}<ArrowRight className="h-4 w-4" /></Link>
            </article>
          ))
        ) : (
          <EmptyState title="Henüz test yok" text="Aktif veya atanmış test olduğunda burada görünecek." />
        )}
      </section>
    </StudentShell>
  );
}

function StudentShell({ children, studentName }: { children: React.ReactNode; studentName: string }) {
  return <main className="relative min-h-screen overflow-hidden bg-[#06111f] text-white"><Background /><div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-4 p-3 lg:flex-row lg:p-4"><Sidebar studentName={studentName} /><section className="flex-1 rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-4 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-6">{children}</section></div></main>;
}

function Background() {
  return <><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_16%,rgba(13,148,136,0.42),transparent_28%),radial-gradient(circle_at_70%_60%,rgba(194,50,99,0.36),transparent_28%),linear-gradient(135deg,#1c0613_0%,#071426_44%,#052d35_100%)]" /><div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:64px_64px] opacity-25" /></>;
}

function Sidebar({ studentName }: { studentName: string }) {
  const initials = studentName.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "Ö";

  return (
    <aside className="rounded-[1.75rem] border border-white/12 bg-white/8 p-4 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.9)] backdrop-blur-2xl lg:flex lg:w-64 lg:shrink-0 lg:flex-col">
      <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-teal-400/24 to-[#8f123a]/24 ring-1 ring-white/15"><BookOpen aria-hidden className="h-6 w-6 text-teal-100" strokeWidth={1.8} /></div><div><p className="text-base font-bold uppercase leading-tight tracking-[0.16em]">Öğrenci</p><p className="text-base font-bold uppercase leading-tight tracking-[0.16em] text-white/80">Paneli</p></div></div>
      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">{menuItems.map((item) => <Link key={item.label} className={`flex min-w-max items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition lg:w-full ${item.active ? "border border-teal-200/18 bg-gradient-to-r from-teal-500/32 to-[#8f123a]/32 text-white shadow-[0_16px_42px_-24px_rgba(20,184,166,0.8)]" : "text-white/68 hover:bg-white/8 hover:text-white"}`} href={item.href}><item.icon aria-hidden className="h-4 w-4" strokeWidth={1.8} />{item.label}</Link>)}</nav>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:mt-auto lg:grid-cols-1"><div className="rounded-2xl border border-white/12 bg-white/8 p-3"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#b61f52] to-teal-600 text-sm font-bold">{initials}</div><div><p className="text-sm font-semibold">{studentName}</p></div></div></div><Link className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 px-4 py-3 text-sm font-semibold text-white/72 transition hover:bg-white/10 hover:text-white" href="/student/logout"><LogOut aria-hidden className="h-4 w-4" strokeWidth={1.8} />Çıkış Yap</Link></div>
    </aside>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) { return <header><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1><p className="mt-2 text-sm text-white/64">{subtitle}</p></header>; }
function Badge({ children, tone }: { children: React.ReactNode; tone: string }) { const toneClass = tone === "teal" ? "border-teal-200/15 bg-teal-400/16 text-teal-100" : tone === "amber" ? "border-amber-300/15 bg-amber-400/14 text-amber-100" : tone === "muted" ? "border-white/10 bg-white/8 text-white/55" : "border-rose-300/15 bg-[#8f123a]/35 text-rose-100"; return <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold ${toneClass}`}>{children}</span>; }
function EmptyState({ title, text }: { title: string; text: string }) { return <div className="rounded-3xl border border-white/10 bg-white/8 p-8 text-center shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl"><h2 className="text-xl font-bold">{title}</h2><p className="mt-2 text-sm text-white/58">{text}</p></div>; }
