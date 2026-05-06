import Link from "next/link";
import { BarChart3, BookOpenCheck, ClipboardList, Users } from "lucide-react";

import { getTeacherDashboardData } from "@/features/teacher-dashboard/queries";
import { getTeacherProfile } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
  const teacher = await getTeacherProfile();
  const dashboard = await getTeacherDashboardData(teacher.id);
  const stats = [
    { label: "Aktif Soru", value: dashboard.stats.questionCount, href: "/teacher/questions", icon: BookOpenCheck, tone: "teal" },
    { label: "Toplam Test", value: dashboard.stats.testCount, href: "/teacher/tests", icon: ClipboardList, tone: "indigo" },
    { label: "Sinav Denemesi", value: dashboard.stats.completedAttemptCount, href: "/teacher/results", icon: BarChart3, tone: "rose" },
    { label: "Ogrenci", value: dashboard.stats.studentCount, href: "/teacher/students", icon: Users, tone: "amber" },
  ] as const;

  return (
    <main className="bg-slate-50 px-5 py-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-900 p-8 text-white md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Canli ozet</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Merhaba, {teacher.fullName}</h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">Soru havuzu, testler ve ogrenci sonuclarinizin guncel ozeti burada toplanir.</p>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-4 md:p-8">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <QuickAction title="Soru Havuzu" description="Sorularinizi listeleyin, ekleyin ve duzenleyin." href="/teacher/questions" icon={BookOpenCheck} />
          <QuickAction title="Test Yonetimi" description="Soru havuzundan yeni testler olusturun." href="/teacher/tests" icon={ClipboardList} />
          <QuickAction title="Sonuclar" description="Sinava giren ogrencileri ve puanlari inceleyin." href="/teacher/results" icon={BarChart3} />
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Rapor</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Son Test Sonuclari</h2>
              <p className="mt-2 text-sm text-slate-600">Tamamlanan son 5 test denemesi.</p>
            </div>
            <Link className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-slate-50" href="/teacher/results">
              Tumunu Gor
            </Link>
          </div>

          {dashboard.recentAttempts.length > 0 ? (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Ogrenci</th>
                    <th className="px-4 py-3 font-semibold">Test</th>
                    <th className="px-4 py-3 font-semibold">Ders</th>
                    <th className="px-4 py-3 font-semibold">Puan</th>
                    <th className="px-4 py-3 font-semibold">D/Y/B</th>
                    <th className="px-4 py-3 font-semibold">Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentAttempts.map((attempt) => (
                    <tr key={attempt.id} className="border-t border-slate-200 transition hover:bg-slate-50/80">
                      <td className="px-4 py-3 text-slate-900">{attempt.student.fullName}</td>
                      <td className="px-4 py-3 text-slate-700">{attempt.test.title}</td>
                      <td className="px-4 py-3 text-slate-700">{attempt.test.course.title}</td>
                      <td className="px-4 py-3 font-black text-slate-950">{Math.round(attempt.score ?? 0)}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {attempt.correctCount}/{attempt.wrongCount}/{attempt.emptyCount}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(attempt.completedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">Henuz tamamlanan test sonucu yok.</div>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, href, icon: Icon, tone }: { label: string; value: number; href: string; icon: typeof BookOpenCheck; tone: "teal" | "indigo" | "rose" | "amber" }) {
  const toneClass = {
    teal: "bg-teal-50 text-teal-700",
    indigo: "bg-indigo-50 text-indigo-700",
    rose: "bg-rose-50 text-rose-700",
    amber: "bg-amber-50 text-amber-700",
  }[tone];

  return (
    <Link className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md" href={href}>
      <div className={`grid h-11 w-11 place-items-center rounded-2xl ${toneClass}`}>
        <Icon aria-hidden className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-black text-slate-950">{value}</p>
    </Link>
  );
}

function QuickAction({ title, description, href, icon: Icon }: { title: string; description: string; href: string; icon: typeof BookOpenCheck }) {
  return (
    <Link className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-md" href={href}>
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white transition group-hover:bg-teal-700">
        <Icon aria-hidden className="h-5 w-5" />
      </div>
      <h2 className="mt-5 text-xl font-black text-slate-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </Link>
  );
}

function formatDate(date: Date | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
