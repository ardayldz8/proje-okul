import { BookOpen, BarChart3, Users, Trophy } from "lucide-react";

import { TeacherPanelFrame, TeacherPanelHeader } from "@/components/teacher-panel-frame";
import { getTeacherStudents } from "@/features/results/queries";
import { requireTeacher } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function TeacherStudentsPage() {
  const session = await requireTeacher();
  const teacherId = session.user.profileId!;
  const teacherName = session.user.name ?? "Koç";
  const assignments = await getTeacherStudents(teacherId);

  const totalStudents = assignments.length;
  const totalAttempts = assignments.reduce((sum, a) => sum + a.student.attempts.length, 0);
  const allScores = assignments.flatMap((a) => a.student.attempts.map((att) => att.score ?? 0)).filter((s) => s > 0);
  const averageScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

  return (
    <TeacherPanelFrame activeHref="/teacher/students" teacherName={teacherName}>
      <TeacherPanelHeader title="Sınıflar & Öğrenciler" subtitle="Öğrencilerini görüntüle ve performanslarını takip et." />

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard icon={Users} label="Toplam Öğrenci" value={totalStudents.toString()} tone="teal" />
        <StatCard icon={BookOpen} label="Toplam Deneme" value={totalAttempts.toString()} tone="rose" />
        <StatCard icon={Trophy} label="Ortalama Puan" value={averageScore.toString()} tone="violet" />
        <StatCard icon={BarChart3} label="Bu Ay Katılan" value="-" tone="orange" />
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-5">
        <h2 className="text-lg font-bold">Öğrencilerim</h2>
        <p className="mt-2 text-sm leading-6 text-white/56">Sana atanmış öğrenciler ve son denemeleri.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {assignments.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/14 bg-white/6 p-8 text-center text-sm text-white/55 sm:col-span-2 xl:col-span-3">
              Henüz atanmış öğrenci yok.
            </div>
          ) : (
            assignments.map((assignment) => {
              const student = assignment.student;
              const latestAttempt = student.attempts[0];
              return (
                <article key={assignment.id} className="rounded-3xl border border-white/10 bg-white/7 p-4 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/10">
                  <div className="flex items-start gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8f123a] to-[#5f0826] text-sm font-bold">
                      {student.fullName
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((p) => p[0]?.toUpperCase())
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold">{student.fullName}</h3>
                      <p className="mt-1 text-xs text-white/50">{student.gradeLevel}</p>
                      <p className="text-xs text-white/50">{student.email}</p>
                      {student.schoolName ? <p className="text-xs text-white/50">{student.schoolName}</p> : null}
                    </div>
                  </div>
                  {latestAttempt ? (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/6 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">{latestAttempt.test.title}</span>
                        <span className={`font-bold ${(latestAttempt.score ?? 0) >= 75 ? "text-teal-300" : "text-amber-300"}`}>{latestAttempt.score ?? 0}</span>
                      </div>
                      <p className="mt-1 text-xs text-white/45">{latestAttempt.test.course.title}</p>
                      <p className="text-xs text-white/45">{latestAttempt.completedAt ? new Date(latestAttempt.completedAt).toLocaleDateString("tr-TR") : "-"}</p>
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-white/45">Henüz deneme yok.</p>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>
    </TeacherPanelFrame>
  );
}

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof Users; label: string; value: string; tone: "teal" | "rose" | "violet" | "orange" }) {
  const toneClass = {
    teal: "from-teal-500/30 to-cyan-500/10 text-teal-200",
    rose: "from-[#c23263]/35 to-[#5f0826]/20 text-rose-100",
    violet: "from-violet-500/28 to-violet-500/10 text-violet-200",
    orange: "from-orange-500/30 to-orange-500/10 text-orange-200",
  }[tone];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${toneClass} ring-1 ring-white/10`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-white/55">{label}</p>
          <p className="mt-0.5 text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
