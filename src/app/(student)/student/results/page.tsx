import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { BarChart3, BookOpen, ClipboardList, Home, LogOut, Settings, Target, Trophy, Users, XCircle } from "lucide-react";
import { notFound } from "next/navigation";

import { getStudentResultsData } from "@/features/student-portal/queries";
import { requireStudentSession } from "@/lib/student-session";

const menuItems = [
  { label: "Ana Sayfa", icon: Home, href: "/student/dashboard" },
  { label: "Sınıflarım", icon: Users, href: "/student/classes" },
  { label: "Derslerim", icon: BookOpen, href: "/student/courses" },
  { label: "Testlerim", icon: ClipboardList, href: "/student/tests" },
  { label: "Sonuçlarım", icon: BarChart3, href: "/student/results", active: true },
  { label: "Eksik Konularım", icon: Target, href: "/student/missing-topics" },
  { label: "Yanlış Sorularım", icon: XCircle, href: "/student/wrong-questions" },
  { label: "Koç İstekleri", icon: Users, href: "/student/coach-requests" },
  { label: "Ayarlar", icon: Settings, href: "/student/settings" },
];

export default async function StudentResultsPage() {
  const sessionStudent = await requireStudentSession();
  const data = await getStudentResultsData(sessionStudent.id);

  if (!data.student) {
    notFound();
  }

  return (
    <StudentShell studentName={data.student.fullName}>
      <Header title="Sonuçlarım" subtitle="Tamamladığın testlerin puanlarını ve gelişimini incele." />
      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <Stat icon={BarChart3} label="Ortalama Puan" value={String(data.stats.averageScore)} />
        <Stat icon={Trophy} label="En Yüksek" value={String(data.stats.highestScore)} />
        <Stat icon={ClipboardList} label="Tamamlanan Test" value={String(data.stats.completedCount)} />
        <Stat icon={Target} label="Genel Başarı" value={`%${data.stats.successRate}`} />
      </section>
      <div className="mt-6">
        <AdBanner placement="results" />
      </div>
      <section className="mt-6 rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <h2 className="text-lg font-bold">Test Geçmişi</h2>
        {data.results.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-xs text-white/45"><tr className="border-b border-white/10"><th className="py-3">Test</th><th>Ders</th><th>Puan</th><th>Tarih</th><th /></tr></thead>
              <tbody>{data.results.map((result) => <tr key={result.id} className="border-b border-white/8 text-white/72 last:border-0"><td className="py-4">{result.test}</td><td><Badge>{result.course}</Badge></td><td className="font-bold text-teal-300">{result.score}</td><td>{result.date}</td><td><Link className="font-semibold text-teal-200 transition hover:text-white" href={`/test/${result.id}/result`}>Detay</Link></td></tr>)}</tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/7 p-6 text-sm text-white/58">Henüz tamamlanmış test sonucun yok.</div>
        )}
      </section>
    </StudentShell>
  );
}

function StudentShell({ children, studentName }: { children: React.ReactNode; studentName: string }) {
  return <main className="relative min-h-screen overflow-hidden bg-[#06111f] text-white"><Background /><div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-4 p-3 lg:flex-row lg:p-4"><Sidebar studentName={studentName} /><section className="flex-1 rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-4 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-6">{children}</section></div></main>;
}

function Background() { return <><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_16%,rgba(13,148,136,0.42),transparent_28%),radial-gradient(circle_at_70%_60%,rgba(194,50,99,0.36),transparent_28%),linear-gradient(135deg,#1c0613_0%,#071426_44%,#052d35_100%)]" /><div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:64px_64px] opacity-25" /></>; }

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
function Stat({ icon: Icon, label, value }: { icon: typeof BarChart3; label: string; value: string }) { return <article className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-400/14 text-teal-100 ring-1 ring-teal-200/15"><Icon className="h-5 w-5" /></div><p className="mt-4 text-sm text-white/55">{label}</p><p className="mt-1 text-3xl font-bold">{value}</p></article>; }
function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-lg border border-teal-200/15 bg-teal-400/16 px-2.5 py-1 text-[10px] font-semibold text-teal-100">{children}</span>; }
