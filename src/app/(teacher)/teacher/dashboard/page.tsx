import Link from "next/link";

import { getTeacherDashboardData } from "@/features/teacher-dashboard/queries";
import { getTeacherProfile } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
  const teacher = await getTeacherProfile();
  const dashboard = await getTeacherDashboardData(teacher.id);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Hoca Paneli</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">Merhaba, {teacher.fullName}</h1>
          <p className="mt-4 text-slate-600">Soru havuzu, testler ve ogrenci sonuclarinizin ozeti.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Aktif Soru" value={dashboard.stats.questionCount} href="/teacher/questions" />
          <StatCard label="Toplam Test" value={dashboard.stats.testCount} href="/teacher/tests" />
          <StatCard label="Sinav Denemesi" value={dashboard.stats.completedAttemptCount} href="/teacher/results" />
          <StatCard label="Ogrenci" value={dashboard.stats.studentCount} href="/teacher/students" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <QuickAction title="Soru Havuzu" description="Sorularinizi listeleyin, ekleyin ve duzenleyin." href="/teacher/questions" />
          <QuickAction title="Test Yonetimi" description="Soru havuzundan yeni testler olusturun." href="/teacher/tests" />
          <QuickAction title="Sonuclar" description="Sinava giren ogrencileri ve puanlari inceleyin." href="/teacher/results" />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Son Test Sonuclari</h2>
              <p className="mt-2 text-sm text-slate-600">Tamamlanan son 5 test denemesi.</p>
            </div>
            <Link className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900" href="/teacher/results">
              Tumunu Gor
            </Link>
          </div>

          {dashboard.recentAttempts.length > 0 ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full border-collapse text-left text-sm">
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
                    <tr key={attempt.id} className="border-t border-slate-200">
                      <td className="px-4 py-3 text-slate-900">{attempt.student.fullName}</td>
                      <td className="px-4 py-3 text-slate-700">{attempt.test.title}</td>
                      <td className="px-4 py-3 text-slate-700">{attempt.test.course.title}</td>
                      <td className="px-4 py-3 font-semibold text-slate-950">{Math.round(attempt.score ?? 0)}</td>
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

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md" href={href}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-bold text-slate-950">{value}</p>
    </Link>
  );
}

function QuickAction({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-700" href={href}>
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
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
