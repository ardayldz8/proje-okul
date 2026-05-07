import Link from "next/link";
import { BookOpen, CalendarDays, ClipboardList, FileText, Plus, Trophy, Users } from "lucide-react";

import { TeacherNotificationBell } from "@/components/teacher-notification-bell";
import { TeacherPanelFrame } from "@/components/teacher-panel-frame";
import { getTeacherDashboardData } from "@/features/teacher-dashboard/queries";
import { requireTeacher } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
  const session = await requireTeacher();
  const teacherId = session.user.profileId!;
  const teacherName = session.user.name ?? "Koç";
  const { stats, recentAttempts } = await getTeacherDashboardData(teacherId);

  const statItems = [
    { label: "Aktif Soru", value: stats.questionCount.toLocaleString("tr-TR"), description: "Toplam soru havuzunuz", icon: BookOpen, tone: "rose" as const, change: "" },
    { label: "Test", value: stats.testCount.toLocaleString("tr-TR"), description: "Oluşturulan testler", icon: ClipboardList, tone: "violet" as const, change: "" },
    { label: "Öğrenci", value: stats.studentCount.toLocaleString("tr-TR"), description: "Toplam öğrenciniz", icon: Users, tone: "teal" as const, change: "" },
    { label: "Deneme", value: stats.completedAttemptCount.toLocaleString("tr-TR"), description: "Yapılan denemeler", icon: Trophy, tone: "rose" as const, change: "" },
  ];

  const quickActions = [
    { title: "Test Oluştur", description: "Yeni test oluştur ve yayınla", icon: Plus, tone: "rose" as const, href: "/teacher/tests/create" },
    { title: "Soru Ekle", description: "Soru havuzuna yeni soru ekle", icon: BookOpen, tone: "teal" as const, href: "/teacher/questions" },
    { title: "Sınıfa Yerleştir", description: "Öğrencileri sınıflara ata", icon: Users, tone: "violet" as const, href: "/teacher/students" },
  ];

  return (
    <TeacherPanelFrame activeHref="/teacher/dashboard" teacherName={teacherName}>
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Merhaba, {teacherName}</h1>
          <p className="mt-2 text-sm text-white/64">Bugün öğrencilerin için ne hazırlamak istersin?</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm shadow-sm">
            <CalendarDays aria-hidden className="h-4 w-4 text-white/70" />
            <div>
              <p className="font-semibold">
                {new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="text-xs text-white/50">
                {new Date().toLocaleDateString("tr-TR", { weekday: "long" })}
              </p>
            </div>
          </div>
          <TeacherNotificationBell />
        </div>
      </header>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className="mt-7">
        <h2 className="text-lg font-bold">Hızlı İşlemler</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {quickActions.map((action) => (
            <a key={action.title} href={action.href} className="group flex items-center justify-between gap-4 rounded-3xl border border-white/12 bg-white/8 p-4 text-left shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/12">
              <div className="flex items-center gap-4">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${toneClass(action.tone)} ring-1 ring-white/10`}>
                  <action.icon aria-hidden className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="mt-1 text-xs text-white/50">{action.description}</p>
                </div>
              </div>
              <span className="text-2xl text-white/55 transition group-hover:translate-x-1 group-hover:text-white">›</span>
            </a>
          ))}
        </div>
      </section>

      <div className="mt-7 grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <section className="rounded-3xl border border-white/12 bg-white/8 p-4 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FileText aria-hidden className="h-5 w-5 text-white/78" />
              <h2 className="font-bold">Son Denemeler</h2>
            </div>
            <Link href="/teacher/results" className="rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/12 hover:text-white">
              Tümünü Gör
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="text-xs text-white/45">
                <tr className="border-b border-white/10">
                  <th className="py-3 font-semibold">Test Adı</th>
                  <th className="py-3 font-semibold">Ders</th>
                  <th className="py-3 font-semibold">Öğrenci</th>
                  <th className="py-3 font-semibold">Puan</th>
                  <th className="py-3 font-semibold">D/Y/B</th>
                  <th className="py-3 font-semibold">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {recentAttempts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-sm text-white/55">
                      Henüz tamamlanmış deneme yok.
                    </td>
                  </tr>
                ) : (
                  recentAttempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b border-white/8 text-white/74 last:border-0">
                      <td className="py-3 font-medium text-white/88">{attempt.test.title}</td>
                      <td className="py-3">{attempt.test.course.title}</td>
                      <td className="py-3">{attempt.student.fullName}</td>
                      <td className={`py-3 font-semibold ${(attempt.score ?? 0) >= 75 ? "text-teal-300" : "text-orange-300"}`}>{attempt.score ?? 0}</td>
                      <td className="py-3">{attempt.correctCount} / {attempt.wrongCount} / {attempt.emptyCount}</td>
                      <td className="py-3">{attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString("tr-TR") : "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-white/12 bg-white/8 p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy aria-hidden className="h-5 w-5 text-white/78" />
              <h2 className="font-bold">Performans Özeti</h2>
            </div>
            <span className="rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-xs text-white/65">Bu Ay</span>
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 text-sm text-white/55">
            <p>Performans verileri yakında burada görünecek.</p>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/7 p-4">
            <p className="text-xs text-white/45">Genel Başarı Ortalaması</p>
            <div className="mt-1 flex items-end justify-between">
              <p className="text-2xl font-bold">
                {recentAttempts.length > 0
                  ? Math.round(recentAttempts.reduce((sum, a) => sum + (a.score ?? 0), 0) / recentAttempts.length)
                  : 0}
              </p>
              <p className="text-sm font-semibold text-teal-300">-</p>
            </div>
          </div>
        </section>
      </div>
    </TeacherPanelFrame>
  );
}

function StatCard({ label, value, description, icon: Icon, tone, change }: { label: string; value: string; description: string; icon: typeof BookOpen; tone: "rose" | "violet" | "teal"; change: string }) {
  const toneClass = tone === "teal" ? "from-teal-500/30 to-cyan-500/10 text-teal-200" : tone === "violet" ? "from-violet-500/28 to-violet-500/10 text-violet-200" : "from-[#c23263]/35 to-[#5f0826]/20 text-rose-100";

  return (
    <div className="rounded-3xl border border-white/12 bg-white/8 p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/11">
      <div className="flex items-start gap-4">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${toneClass} ring-1 ring-white/10`}>
          <Icon aria-hidden className="h-6 w-6" strokeWidth={1.7} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white/72">{label}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
          <p className="mt-1 text-xs text-white/45">{description}</p>
        </div>
      </div>
      {change ? (
        <div className="mt-5 rounded-2xl border border-white/8 bg-white/6 px-3 py-2 text-xs text-white/55">
          <span className="font-semibold text-teal-300">{change}</span> Bu ay
        </div>
      ) : null}
    </div>
  );
}

function toneClass(tone: "rose" | "teal" | "violet") {
  return tone === "teal" ? "from-teal-500/30 to-cyan-500/10 text-teal-200" : tone === "violet" ? "from-violet-500/28 to-violet-500/10 text-violet-200" : "from-[#c23263]/35 to-[#5f0826]/20 text-rose-100";
}
