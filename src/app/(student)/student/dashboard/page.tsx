import Link from "next/link";
import { BarChart3, ClipboardList, GraduationCap, Users } from "lucide-react";

import { getStudentDashboardData } from "@/features/student-portal/queries";
import { requireStudentSession } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const student = await requireStudentSession();
  const dashboard = await getStudentDashboardData(student.id);
  const recentAttempts = dashboard.attempts.slice(0, 5);
  const stats = [
    { label: "Tamamlanan", value: dashboard.stats.completedAttemptCount, href: "/student/attempts", icon: ClipboardList, tone: "teal" },
    { label: "Ort. puan", value: dashboard.stats.averageScore, href: "/student/attempts", icon: BarChart3, tone: "indigo" },
    { label: "En iyi puan", value: dashboard.stats.bestScore, href: "/student/attempts", icon: GraduationCap, tone: "rose" },
    { label: "Hoca", value: dashboard.stats.teacherCount, href: "/student/attempts", icon: Users, tone: "amber" },
  ] as const;

  return (
    <main className="bg-slate-50 px-5 py-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-900 p-8 text-white md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Kisisel ozet</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Merhaba, {dashboard.student.fullName}</h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">Cozdugun testler, tanimli hocalarin ve son performans ozeti burada toplanir.</p>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-4 md:p-8">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <QuickAction title="Yeni Test" description="Dashboarddan ders secip yeni bir deneme baslat." href="/online-test" icon={GraduationCap} />
          <QuickAction title="Deneme Gecmisi" description="Tum tamamlanan ve devam eden denemelerini gor." href="/student/attempts" icon={ClipboardList} />
          <QuickAction title="Sonuclar" description="Tamamladigin denemelerin puan ve cevap durumlarini incele." href="/student/attempts" icon={BarChart3} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Profil</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Ogrenci Bilgileri</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <Info label="E-posta" value={dashboard.student.email} />
              {dashboard.student.phone ? <Info label="Telefon" value={dashboard.student.phone} /> : null}
              <Info label="Seviye" value={dashboard.student.gradeLevel} />
              {dashboard.student.schoolName ? <Info label="Okul" value={dashboard.student.schoolName} /> : null}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Baglantilar</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">Tanimli Hocalar</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{dashboard.assignedTeachers.length} hoca</span>
            </div>

            {dashboard.assignedTeachers.length > 0 ? (
              <div className="mt-6 grid gap-4">
                {dashboard.assignedTeachers.map((assignment) => (
                  <article key={assignment.id} className="rounded-3xl border border-slate-200 p-5 transition hover:border-teal-200 hover:shadow-sm">
                    <p className="text-lg font-black text-slate-950">{assignment.teacher.fullName}</p>
                    <p className="mt-2 text-sm text-slate-600">{assignment.teacher.email}</p>
                    <p className="mt-2 text-sm text-slate-600">Atanma: {formatDate(assignment.assignedAt)}</p>
                    {assignment.note ? <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">{assignment.note}</p> : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">Henuz size tanimli hoca bulunmuyor.</div>
            )}
          </section>
        </div>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Rapor</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Son Denemeler</h2>
            </div>
            <Link className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-slate-50" href="/student/attempts">
              Tumunu Gor
            </Link>
          </div>

          {recentAttempts.length > 0 ? (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Test</th>
                    <th className="px-4 py-3 font-semibold">Ders</th>
                    <th className="px-4 py-3 font-semibold">Durum</th>
                    <th className="px-4 py-3 font-semibold">Puan</th>
                    <th className="px-4 py-3 font-semibold">Tarih</th>
                    <th className="px-4 py-3 font-semibold">Aksiyon</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttempts.map((attempt) => (
                    <tr key={attempt.id} className="border-t border-slate-200 transition hover:bg-slate-50/80">
                      <td className="px-4 py-3 text-slate-900">{attempt.test.title}</td>
                      <td className="px-4 py-3 text-slate-700">{attempt.test.course.title}</td>
                      <td className="px-4 py-3"><StatusBadge status={attempt.status} /></td>
                      <td className="px-4 py-3 font-black text-slate-950">{attempt.status === "COMPLETED" ? Math.round(attempt.score ?? 0) : "-"}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(attempt.completedAt ?? attempt.startedAt)}</td>
                      <td className="px-4 py-3">
                        <AttemptLink attemptId={attempt.id} status={attempt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">Henuz bir denemeniz bulunmuyor.</div>
          )}
        </section>
      </section>
    </main>
  );
}

function StatCard({ label, value, href, icon: Icon, tone }: { label: string; value: number; href: string; icon: typeof BarChart3; tone: "teal" | "indigo" | "rose" | "amber" }) {
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

function QuickAction({ title, description, href, icon: Icon }: { title: string; description: string; href: string; icon: typeof BarChart3 }) {
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED" }) {
  const config = {
    IN_PROGRESS: { label: "Devam ediyor", className: "bg-amber-50 text-amber-700" },
    COMPLETED: { label: "Tamamlandi", className: "bg-emerald-50 text-emerald-700" },
    ABANDONED: { label: "Birakildi", className: "bg-slate-100 text-slate-600" },
  }[status];

  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${config.className}`}>{config.label}</span>;
}

function AttemptLink({ attemptId, status }: { attemptId: string; status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED" }) {
  if (status === "IN_PROGRESS") {
    return (
      <Link className="rounded-2xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-900 transition hover:bg-slate-50" href={`/test/${attemptId}`}>
        Devam Et
      </Link>
    );
  }

  return (
    <Link className="rounded-2xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-900 transition hover:bg-slate-50" href={`/test/${attemptId}/result`}>
      Incele
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
