import Link from "next/link";

import { Advertisement } from "@/components/advertisement";
import { getActiveCourses } from "@/features/courses/queries";

export const dynamic = "force-dynamic";

export default async function OnlineTestPage() {
  const courses = await getActiveCourses();
  const totalTests = courses.reduce((sum, course) => sum + course._count.tests, 0);

  return (
    <main className="bg-slate-50 px-5 py-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#190715] via-slate-900 to-[#05272c] p-8 text-white md:p-10">
            <Link className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/88 transition hover:bg-white/15" href="/">
              Ana sayfaya don
            </Link>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Ders Secimi</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Cozmek istedigin dersi sec.</h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">Aktif dersleri, bu derslerdeki yayinlanan testleri ve ogrenci akisinin bir sonraki adimini buradan gorebilirsin.</p>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
            <SummaryCard label="Aktif ders" value={courses.length.toString()} />
            <SummaryCard label="Toplam test" value={totalTests.toString()} />
            <SummaryCard label="Akis" value="3 adim" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Liste</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Dersler</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{courses.length} ders</span>
          </div>

          {courses.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <Link key={course.id} className="group rounded-[2rem] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-sm" href={`/online-test/${course.slug}`}>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Ders</p>
                  <h3 className="mt-3 text-2xl font-black text-slate-950">{course.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{course.description ?? "Bu ders icin aktif testleri goruntuleyin."}</p>
                  <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700">{course._count.tests} aktif test</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">Online akis</span>
                  </div>
                  <p className="mt-7 text-sm font-bold text-slate-950 transition group-hover:text-teal-700">Testleri gor</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">Su anda aktif ders bulunmuyor.</div>
          )}
        </div>

        <Advertisement placement="course-list" />
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
