import Link from "next/link";

import { getTeacherResults } from "@/features/results/queries";
import { getTeacherProfile } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function TeacherResultsPage() {
  const teacher = await getTeacherProfile();
  const results = await getTeacherResults(teacher.id);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Sonuc Takibi</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">Sinava Giren Ogrenciler</h1>
          <p className="mt-4 text-slate-600">Kendi testlerinize ait tamamlanan denemeleri ve puan dagilimini inceleyin.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-950">Tum Sonuclar</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{results.length} sonuc</span>
          </div>

          {results.length > 0 ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full border-collapse text-left text-sm">
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
                    <tr key={result.id} className="border-t border-slate-200 align-top">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-950">{result.student.fullName}</p>
                        <p className="mt-1 text-xs text-slate-500">{result.student.email}</p>
                        <p className="mt-1 text-xs text-slate-500">{result.student.gradeLevel}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{result.test.title}</td>
                      <td className="px-4 py-3 text-slate-700">{result.test.course.title}</td>
                      <td className="px-4 py-3 font-semibold text-slate-950">{Math.round(result.score ?? 0)}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {result.correctCount}/{result.wrongCount}/{result.emptyCount}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{formatDuration(result.durationSeconds)}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(result.completedAt)}</td>
                      <td className="px-4 py-3">
                        <Link className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-900" href={`/teacher/results/${result.id}`}>
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
