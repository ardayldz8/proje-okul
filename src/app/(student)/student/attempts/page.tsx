import Link from "next/link";

import { getStudentDashboardData } from "@/features/student-portal/queries";
import { requireStudentSession } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export default async function StudentAttemptsPage() {
  const student = await requireStudentSession();
  const dashboard = await getStudentDashboardData(student.id);

  return (
    <main className="bg-slate-50 px-5 py-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-900 p-8 text-white md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Deneme Gecmisi</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Tum Denemelerin</h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">Devam eden testlerini surdur, tamamlanan denemelerinin puanlarini ve sonuc gorunurlugunu tek ekranda takip et.</p>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-4 md:p-8">
            <SummaryCard label="Toplam" value={dashboard.attempts.length.toString()} />
            <SummaryCard label="Tamamlanan" value={dashboard.stats.completedAttemptCount.toString()} />
            <SummaryCard label="Devam eden" value={dashboard.stats.inProgressAttemptCount.toString()} />
            <SummaryCard label="Ort. puan" value={dashboard.stats.averageScore.toString()} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Liste</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Denemeler</h2>
            </div>
            <Link className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-slate-50" href="/online-test">
              Yeni Test Baslat
            </Link>
          </div>

          {dashboard.attempts.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {dashboard.attempts.map((attempt) => (
                <article key={attempt.id} className="rounded-3xl border border-slate-200 p-5 transition hover:border-teal-200 hover:shadow-sm md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-3xl">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{attempt.test.course.title}</p>
                      <h3 className="mt-3 text-2xl font-black text-slate-950">{attempt.test.title}</h3>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{attempt.test.ownerTeacher.fullName}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">Baslangic: {formatDate(attempt.startedAt)}</span>
                        <span className={`rounded-full px-3 py-1 ${attempt.test.showResultImmediately ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {attempt.test.showResultImmediately ? "Sonuc aninda" : "Sonuc sonra"}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={attempt.status} />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <Info label="Puan" value={attempt.status === "COMPLETED" ? Math.round(attempt.score ?? 0).toString() : "-"} />
                    <Info label="Dogru" value={attempt.status === "COMPLETED" ? attempt.correctCount.toString() : "-"} />
                    <Info label="Yanlis" value={attempt.status === "COMPLETED" ? attempt.wrongCount.toString() : "-"} />
                    <Info label="Bos" value={attempt.status === "COMPLETED" ? attempt.emptyCount.toString() : "-"} />
                    <Info label="Sure" value={formatDuration(attempt.durationSeconds)} />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {attempt.status === "IN_PROGRESS" ? (
                      <Link className="rounded-2xl bg-indigo-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-900" href={`/test/${attempt.id}`}>
                        Denemeye Don
                      </Link>
                    ) : (
                      <Link className="rounded-2xl bg-indigo-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-900" href={`/test/${attempt.id}/result`}>
                        Sonucu Incele
                      </Link>
                    )}
                    <Link className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50" href={`/online-test/${attempt.test.course.slug}`}>
                      Bu Derste Yeni Testler
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">Henuz bir denemeniz bulunmuyor.</div>
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

function formatDate(date: Date | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatDuration(seconds: number | null) {
  if (!seconds) {
    return "-";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes} dk ${remainingSeconds} sn`;
}
