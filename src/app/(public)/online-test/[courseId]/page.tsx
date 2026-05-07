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

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Aktif Testler</p>
          <h1 className="text-3xl font-bold text-slate-950">{course.title} dersi icin testler</h1>
          <p className="text-slate-600">{course.description ?? "Aktif testlerden birini secerek baslayin."}</p>
        </div>

        {course.tests.length > 0 ? (
          <div className="space-y-3">
            {course.tests.map((test) => (
              <Link key={test.id} className="block rounded-2xl border border-slate-200 p-5 transition hover:border-teal-700" href={`/test/${test.id}/start`}>
                <h2 className="text-xl font-semibold text-slate-950">{test.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{test.description ?? "Test baslangic sayfasina git."}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                  <span>{test._count.testQuestions} soru</span>
                  <span>{test.durationMinutes ? `${test.durationMinutes} dakika` : "Suresiz"}</span>
                  <span>{test.showResultImmediately ? "Sonuc aninda" : "Sonuc sonra"}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600">Bu ders icin aktif test bulunmuyor.</div>
        )}
      </section>
    </main>
  );
}
