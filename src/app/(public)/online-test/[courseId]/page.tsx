import Link from "next/link";
import { notFound } from "next/navigation";

import { getActiveTestsByCourseSlug } from "@/features/courses/queries";

export const dynamic = "force-dynamic";

type CourseTestsPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseTestsPage({ params }: CourseTestsPageProps) {
  const { courseId } = await params;
  const course = await getActiveTestsByCourseSlug(courseId);

  if (!course) {
    notFound();
  }

  const totalQuestions = course.tests.reduce((sum, test) => sum + test._count.testQuestions, 0);
  const instantResultCount = course.tests.filter((test) => test.showResultImmediately).length;

  return (
    <main className="bg-slate-50 px-5 py-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#190715] via-slate-900 to-[#05272c] p-8 text-white md:p-10">
            <Link className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/88 transition hover:bg-white/15" href="/online-test">
              Derslere don
            </Link>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Aktif Testler</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{course.title} dersi icin testler</h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">{course.description ?? "Aktif testlerden birini secerek ogrenci baslangic ekranina ilerleyin."}</p>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
            <SummaryCard label="Aktif test" value={course.tests.length.toString()} />
            <SummaryCard label="Toplam soru" value={totalQuestions.toString()} />
            <SummaryCard label="Aninda sonuc" value={instantResultCount.toString()} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Liste</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Yayindaki Testler</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{course.tests.length} test</span>
          </div>

          {course.tests.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {course.tests.map((test) => (
                <Link key={test.id} className="group block rounded-[2rem] border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-sm md:p-6" href={`/test/${test.id}/start`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-2xl">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Test</p>
                      <h3 className="mt-3 text-2xl font-black text-slate-950">{test.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-slate-600">{test.description ?? "Test baslangic sayfasina git."}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${test.showResultImmediately ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {test.showResultImmediately ? "Sonuc aninda" : "Sonuc sonra"}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{test._count.testQuestions} soru</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{test.durationMinutes ? `${test.durationMinutes} dakika` : "Suresiz"}</span>
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700">Hesap ile baslangic</span>
                  </div>

                  <p className="mt-7 text-sm font-bold text-slate-950 transition group-hover:text-teal-700">Baslangic ekranina git</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">Bu ders icin aktif test bulunmuyor.</div>
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
