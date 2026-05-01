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
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">Test Yonetimi</h1>
          <p className="mt-4 text-slate-600">Soru havuzunuzdan test olusturun ve test durumlarini yonetin.</p>
        </div>

        <TestForm courses={courses} questions={questions} />

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-950">Testler</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{tests.length} test</span>
          </div>

          {tests.length > 0 ? (
            <div className="mt-6 space-y-4">
              {tests.map((test) => (
                <article key={test.id} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                        <span>{test.course.title}</span>
                        <span>{formatStatus(test.status)}</span>
                        <span>{test._count.testQuestions} soru</span>
                        <span>{test._count.attempts} deneme</span>
                        <span>{test.durationMinutes ? `${test.durationMinutes} dk` : "Suresiz"}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-slate-950">{test.title}</h3>
                      {test.description ? <p className="mt-2 text-sm text-slate-600">{test.description}</p> : null}
                    </div>
                    <form action={updateTestStatus} className="flex gap-2">
                      <input name="testId" type="hidden" value={test.id} />
                      <select className="rounded-full border border-slate-300 px-3 py-2 text-sm" defaultValue={test.status} name="status">
                        <option value={TestStatus.DRAFT}>Taslak</option>
                        <option value={TestStatus.ACTIVE}>Aktif</option>
                        <option value={TestStatus.ARCHIVED}>Arsiv</option>
                      </select>
                      <button className="rounded-full bg-indigo-950 px-4 py-2 text-sm font-semibold text-white" type="submit">
                        Guncelle
                      </button>
                    </form>
                  </div>

                  <details className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-700">Testi Duzenle</summary>
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
                      <button className="rounded-full bg-indigo-950 px-5 py-3 text-sm font-semibold text-white" type="submit">
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

function formatStatus(status: TestStatus) {
  return {
    [TestStatus.DRAFT]: "Taslak",
    [TestStatus.ACTIVE]: "Aktif",
    [TestStatus.ARCHIVED]: "Arsiv",
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
