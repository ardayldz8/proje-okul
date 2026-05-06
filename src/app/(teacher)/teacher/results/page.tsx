import Link from "next/link";

import { getTeacherResults } from "@/features/results/queries";
import { getTeacherProfile } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function TeacherResultsPage() {
  const teacher = await getTeacherProfile();
  const results = await getTeacherResults(teacher.id);
  const averageScore = results.length > 0 ? Math.round(results.reduce((sum, result) => sum + (result.score ?? 0), 0) / results.length) : 0;

  return (
    <main className="bg-slate-50 px-5 py-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-900 p-8 text-white md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Sonuc Takibi</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Sinava Giren Ogrenciler</h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">Kendi testlerinize ait tamamlanan denemeleri, ortalama performansi ve puan dagilimini buradan izleyin.</p>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
            <SummaryCard label="Toplam sonuc" value={results.length.toString()} />
            <SummaryCard label="Ortalama puan" value={averageScore.toString()} />
            <SummaryCard label="Son kayit" value={results[0]?.completedAt ? formatDate(results[0].completedAt) : "-"} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Liste</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Tum Sonuclar</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{results.length} sonuc</span>
          </div>

          {results.length > 0 ? (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Ogrenci</th>
                    <th className="px-4 py-3 font-semibold">Test</th>
                    <th className="px-4 py-3 font-semibold">Ders</th>
                    <th className="px-4 py-3 font-semibold">Puan</th>
                    <th className="px-4 py-3 font-semibold">Dogru/Yanlis/Bos</th>
                    <th className="px-4 py-3 font-semibold">Sure</th>
                    <th className="px-4 py-3 font-semibold">Tarih</th>
                    <th className="px-4 py-3 font-semibold">Detay</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-t border-slate-200 align-top transition hover:bg-slate-50/80">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-950">{result.student.fullName}</p>
                        <p className="mt-1 text-xs text-slate-500">{result.student.email}</p>
                        <p className="mt-1 text-xs text-slate-500">{result.student.gradeLevel}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{result.test.title}</td>
                      <td className="px-4 py-3 text-slate-700">{result.test.course.title}</td>
                      <td className="px-4 py-3 font-black text-slate-950">{Math.round(result.score ?? 0)}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {result.correctCount}/{result.wrongCount}/{result.emptyCount}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{formatDuration(result.durationSeconds)}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(result.completedAt)}</td>
                      <td className="px-4 py-3">
                        <Link className="rounded-2xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-900 transition hover:bg-slate-50" href={`/teacher/results/${result.id}`}>
                          Incele
                        </Link>
                      </td>
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

function formatDuration(seconds: number | null) {
  if (!seconds) {
    return "-";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes} dk ${remainingSeconds} sn`;
}
