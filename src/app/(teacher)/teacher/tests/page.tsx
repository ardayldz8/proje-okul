import { TestStatus } from "@prisma/client";

import { updateTest, updateTestStatus } from "@/features/test-builder/actions";
import { TestForm } from "@/features/test-builder/components/test-form";
import { getTeacherTestBuilderData } from "@/features/test-builder/queries";
import { requireTeacher } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function TeacherTestsPage() {
  const session = await requireTeacher();

  if (!session.user.profileId) {
    throw new Error("Hoca profili bulunamadi.");
  }

  const { courses, questions, tests } = await getTeacherTestBuilderData(session.user.profileId);

  return (
    <main className="bg-slate-50 px-5 py-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-900 p-8 text-white md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Test Yonetimi</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Testleri olusturun ve yayinlayin</h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">Soru havuzunuzdan test olusturun, yayin durumunu yonetin ve sonuc gorunurlugunu kontrol edin.</p>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
            <SummaryCard label="Test" value={tests.length.toString()} />
            <SummaryCard label="Aktif soru" value={questions.length.toString()} />
            <SummaryCard label="Ders" value={courses.length.toString()} />
          </div>
        </div>

        <TestForm courses={courses} questions={questions} />

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Liste</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Testler</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{tests.length} test</span>
          </div>

          {tests.length > 0 ? (
            <div className="mt-6 space-y-4">
              {tests.map((test) => (
                <article key={test.id} className="rounded-3xl border border-slate-200 p-5 transition hover:border-teal-200 hover:shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1">{test.course.title}</span>
                        <span className={`rounded-full px-3 py-1 ${getStatusClass(test.status)}`}>{formatStatus(test.status)}</span>
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">{test._count.testQuestions} soru</span>
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700">{test._count.attempts} deneme</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">{test.durationMinutes ? `${test.durationMinutes} dk` : "Suresiz"}</span>
                      </div>
                      <h3 className="mt-4 text-lg font-black text-slate-950">{test.title}</h3>
                      {test.description ? <p className="mt-2 text-sm text-slate-600">{test.description}</p> : null}
                    </div>
                    <form action={updateTestStatus} className="flex flex-wrap gap-2">
                      <input name="testId" type="hidden" value={test.id} />
                      <select className="rounded-2xl border border-slate-300 px-3 py-2 text-sm font-semibold" defaultValue={test.status} name="status">
                        <option value={TestStatus.DRAFT}>Taslak</option>
                        <option value={TestStatus.ACTIVE}>Aktif</option>
                        <option value={TestStatus.ARCHIVED}>Arsiv</option>
                      </select>
                      <button className="rounded-2xl bg-indigo-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-900" type="submit">
                        Guncelle
                      </button>
                    </form>
                  </div>

                  <details className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <summary className="cursor-pointer text-sm font-bold text-slate-700">Testi Duzenle</summary>
                    <form action={updateTest} className="mt-4 space-y-4">
                      <input name="testId" type="hidden" value={test.id} />
                      <div className="grid gap-4 md:grid-cols-3">
                        <Field defaultValue={test.title} label="Test adi" name="title" required />
                        <label className="space-y-2 text-sm font-medium text-slate-700">
                          <span>Ders</span>
                          <select className="w-full rounded-xl border border-slate-300 px-4 py-3" defaultValue={test.courseId} name="courseId" required>
                            {courses.map((course) => (
                              <option key={course.id} value={course.id}>
                                {course.title}
                              </option>
                            ))}
                          </select>
                        </label>
                        <Field defaultValue={test.durationMinutes?.toString() ?? ""} label="Sure (dakika)" name="durationMinutes" type="number" />
                      </div>
                      <label className="space-y-2 text-sm font-medium text-slate-700">
                        <span>Aciklama</span>
                        <textarea className="min-h-20 w-full rounded-xl border border-slate-300 px-4 py-3" defaultValue={test.description ?? ""} name="description" />
                      </label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-slate-700">
                          <span>Durum</span>
                          <select className="w-full rounded-xl border border-slate-300 px-4 py-3" defaultValue={test.status} name="status" required>
                            <option value={TestStatus.DRAFT}>Taslak</option>
                            <option value={TestStatus.ACTIVE}>Aktif</option>
                            <option value={TestStatus.ARCHIVED}>Arsiv</option>
                          </select>
                        </label>
                        <label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                          <input defaultChecked={test.showResultImmediately} name="showResultImmediately" type="checkbox" />
                          Sonucu aninda goster
                        </label>
                      </div>
                      <p className="text-xs text-slate-500">Not: Test sorulari bu formdan degismez. Mevcut sonuc kayitlarini bozmamak icin soru seti ayri akista yonetilmelidir.</p>
                      <button className="rounded-2xl bg-indigo-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-900" type="submit">
                        Degisiklikleri Kaydet
                      </button>
                    </form>
                  </details>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">Henuz test olusturulmadi.</div>
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

function formatStatus(status: TestStatus) {
  return {
    [TestStatus.DRAFT]: "Taslak",
    [TestStatus.ACTIVE]: "Aktif",
    [TestStatus.ARCHIVED]: "Arsiv",
  }[status];
}

function getStatusClass(status: TestStatus) {
  return {
    [TestStatus.DRAFT]: "bg-slate-100 text-slate-700",
    [TestStatus.ACTIVE]: "bg-emerald-50 text-emerald-700",
    [TestStatus.ARCHIVED]: "bg-amber-50 text-amber-700",
  }[status];
}

function Field({ defaultValue, label, name, required = false, type = "text" }: { defaultValue: string; label: string; name: string; required?: boolean; type?: string }) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input className="w-full rounded-xl border border-slate-300 px-4 py-3" defaultValue={defaultValue} name={name} required={required} type={type} />
    </label>
  );
}
