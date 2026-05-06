import { getTeacherStudents } from "@/features/results/queries";
import { getTeacherProfile } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function TeacherStudentsPage() {
  const teacher = await getTeacherProfile();
  const students = await getTeacherStudents(teacher.id);
  const totalCompletedAttempts = students.reduce(
    (sum, { student }) => sum + student.attempts.filter((attempt) => attempt.status === "COMPLETED").length,
    0,
  );

  return (
    <main className="bg-slate-50 px-5 py-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-900 p-8 text-white md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Ogrenci Takibi</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Tanimli Ogrenciler</h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">Size atanmis veya test baslangicinda sizi secmis ogrencilerin ilerlemesini ve son denemelerini takip edin.</p>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
            <SummaryCard label="Ogrenci" value={students.length.toString()} />
            <SummaryCard label="Tamamlanan deneme" value={totalCompletedAttempts.toString()} />
            <SummaryCard label="Son atama" value={students[0]?.assignedAt ? formatDate(students[0].assignedAt) : "-"} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Liste</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Ogrenciler</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{students.length} ogrenci</span>
          </div>

          {students.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {students.map(({ id, assignedAt, student }) => {
                const completedAttempts = student.attempts.filter((attempt) => attempt.status === "COMPLETED");
                const latestAttempt = completedAttempts[0] ?? student.attempts[0] ?? null;

                return (
                  <article key={id} className="rounded-3xl border border-slate-200 p-5 transition hover:border-teal-200 hover:shadow-sm">
                    <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-slate-950">{student.fullName}</h3>
                          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">{student.gradeLevel}</span>
                        </div>
                        <div className="mt-3 grid gap-1 text-sm text-slate-600">
                          <p>{student.email}</p>
                          {student.phone ? <p>{student.phone}</p> : null}
                          {student.schoolName ? <p>{student.schoolName}</p> : null}
                          <p>Atanma tarihi: {formatDate(assignedAt)}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                        <p className="font-bold text-slate-950">Test Ozeti</p>
                        <p className="mt-2">Tamamlanan deneme: {completedAttempts.length}</p>
                        {latestAttempt ? (
                          <div className="mt-3 border-t border-slate-200 pt-3">
                            <p className="font-bold text-slate-900">Son test: {latestAttempt.test.title}</p>
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

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
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
