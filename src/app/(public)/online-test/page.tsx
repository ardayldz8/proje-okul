import Link from "next/link";

import { Advertisement } from "@/components/advertisement";
import { getActiveCourses } from "@/features/courses/queries";

export const dynamic = "force-dynamic";

export default async function OnlineTestPage() {
  const courses = await getActiveCourses();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Ders Secimi</p>
          <h1 className="text-3xl font-bold text-slate-950 md:text-5xl">Cozmek istedigin dersi sec.</h1>
          <p className="max-w-2xl text-slate-600">Bu sayfa sonraki adimda veritabanindaki aktif derslere baglanacak.</p>
        </div>

        {courses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {courses.map((course) => (
              <Link key={course.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md" href={`/online-test/${course.slug}`}>
              <h2 className="text-xl font-semibold text-slate-950">{course.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{course.description ?? "Bu ders icin aktif testleri goruntuleyin."}</p>
                <p className="mt-5 text-sm font-semibold text-teal-700">{course._count.tests} aktif test</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">Su anda aktif ders bulunmuyor.</div>
        )}

        <Advertisement placement="course-list" />
      </section>
    </main>
  );
}
