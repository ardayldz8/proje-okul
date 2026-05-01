import { getTeacherStudents } from "@/features/results/queries";
import { getTeacherProfile } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function TeacherStudentsPage() {
  const teacher = await getTeacherProfile();
  const students = await getTeacherStudents(teacher.id);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Ogrenci Takibi</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">Tanimli Ogrenciler</h1>
          <p className="mt-4 text-slate-600">Size atanmis veya test baslangicinda sizi secmis ogrencileri takip edin.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-950">Ogrenciler</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{students.length} ogrenci</span>
          </div>

          {students.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {students.map(({ id, assignedAt, student }) => {
                const latestAttempt = student.attempts[0];
                const completedAttempts = student.attempts.filter((attempt) => attempt.status === "COMPLETED");

                return (
                  <article key={id} className="rounded-2xl border border-slate-200 p-5">
                    <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-950">{student.fullName}</h3>
                          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">{student.gradeLevel}</span>
                        </div>
                        <div className="mt-3 grid gap-1 text-sm text-slate-600">
                          <p>{student.email}</p>
                          {student.phone ? <p>{student.phone}</p> : null}
                          {student.schoolName ? <p>{student.schoolName}</p> : null}
                          <p>Atanma tarihi: {formatDate(assignedAt)}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                        <p className="font-semibold text-slate-950">Test Ozeti</p>
                        <p className="mt-2">Tamamlanan deneme: {completedAttempts.length}</p>
                        {latestAttempt ? (
                          <div className="mt-3 border-t border-slate-200 pt-3">
                            <p className="font-medium text-slate-900">Son test: {latestAttempt.test.title}</p>
                            <p className="mt-1">Ders: {latestAttempt.test.course.title}</p>
                            <p className="mt-1">Puan: {latestAttempt.score === null ? "-" : Math.round(latestAttempt.score)}</p>
                            <p className="mt-1">Tarih: {formatDate(latestAttempt.completedAt)}</p>
                          </div>
                        ) : (
                          <p className="mt-3 text-slate-500">Bu ogrencinin size ait test denemesi yok.</p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">Henuz size tanimli ogrenci yok.</div>
          )}
        </div>
      </section>
    </main>
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
