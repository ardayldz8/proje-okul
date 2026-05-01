import { assignTeacherStudent, createCourse, createTeacher, removeTeacherStudent, updateCourse, updateTeacher } from "@/features/admin/actions";
import { getAdminDashboardData } from "@/features/admin/queries";
import { requireAdmin } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const { teachers, courses, students, assignments } = await getAdminDashboardData();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Admin</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">Admin Paneli</h1>
          <p className="mt-4 text-slate-600">Hoca hesaplari, dersler ve hoca-ogrenci eslestirmelerini MVP seviyesinde yonetin.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Hoca" value={teachers.length} />
          <StatCard label="Aktif Ders" value={courses.filter((course) => course.isActive).length} />
          <StatCard label="Ogrenci" value={students.length} />
          <StatCard label="Eslestirme" value={assignments.length} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <CreateTeacherForm />
          <CreateCourseForm />
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-950">Hocalar</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{teachers.length} kayit</span>
          </div>

          <div className="mt-6 grid gap-4">
            {teachers.map((teacher) => (
              <article key={teacher.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">{teacher.fullName}</h3>
                    <p className="mt-1 text-sm text-slate-600">{teacher.email}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {teacher._count.ownedQuestions} soru / {teacher._count.ownedTests} test / {teacher._count.teacherStudents} ogrenci
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${teacher.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {teacher.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>

                <details className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-700">Hocayi Duzenle</summary>
                  <form action={updateTeacher} className="mt-4 grid gap-4 md:grid-cols-2">
                    <input name="teacherId" type="hidden" value={teacher.id} />
                    <Field defaultValue={teacher.fullName} label="Ad soyad" name="fullName" required />
                    <Field defaultValue={teacher.email} label="E-posta" name="email" required type="email" />
                    <Field label="Yeni sifre" name="password" placeholder="Bos birakilirsa degismez" type="password" />
                    <label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                      <input defaultChecked={teacher.isActive} name="isActive" type="checkbox" />
                      Aktif hesap
                    </label>
                    <button className="rounded-full bg-indigo-950 px-5 py-3 text-sm font-semibold text-white md:col-span-2" type="submit">
                      Hocayi Kaydet
                    </button>
                  </form>
                </details>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-950">Dersler</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{courses.length} kayit</span>
          </div>

          <div className="mt-6 grid gap-4">
            {courses.map((course) => (
              <article key={course.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">{course.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">/{course.slug}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Sira {course.displayOrder} / {course._count.questions} soru / {course._count.tests} test
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${course.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {course.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>

                <details className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-700">Dersi Duzenle</summary>
                  <form action={updateCourse} className="mt-4 grid gap-4 md:grid-cols-2">
                    <input name="courseId" type="hidden" value={course.id} />
                    <Field defaultValue={course.title} label="Ders adi" name="title" required />
                    <Field defaultValue={course.slug} label="Slug" name="slug" required />
                    <Field defaultValue={course.iconName ?? ""} label="Ikon adi" name="iconName" />
                    <Field defaultValue={course.displayOrder.toString()} label="Sira" name="displayOrder" type="number" />
                    <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
                      <span>Aciklama</span>
                      <textarea className="min-h-20 w-full rounded-xl border border-slate-300 px-4 py-3" defaultValue={course.description ?? ""} name="description" />
                    </label>
                    <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                      <input defaultChecked={course.isActive} name="isActive" type="checkbox" />
                      Aktif ders
                    </label>
                    <button className="rounded-full bg-indigo-950 px-5 py-3 text-sm font-semibold text-white" type="submit">
                      Dersi Kaydet
                    </button>
                  </form>
                </details>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">Hoca-Ogrenci Eslestirme</h2>
          <form action={assignTeacherStudent} className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Hoca</span>
              <select className="w-full rounded-xl border border-slate-300 px-4 py-3" name="teacherId" required>
                <option value="">Hoca sec</option>
                {teachers
                  .filter((teacher) => teacher.isActive)
                  .map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.fullName}
                    </option>
                  ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Ogrenci</span>
              <select className="w-full rounded-xl border border-slate-300 px-4 py-3" name="studentId" required>
                <option value="">Ogrenci sec</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.fullName} - {student.email}
                  </option>
                ))}
              </select>
            </label>
            <Field label="Not" name="note" placeholder="Opsiyonel" />
            <button className="self-end rounded-full bg-indigo-950 px-5 py-3 text-sm font-semibold text-white" type="submit">
              Eslestir
            </button>
          </form>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Hoca</th>
                  <th className="px-4 py-3 font-semibold">Ogrenci</th>
                  <th className="px-4 py-3 font-semibold">Not</th>
                  <th className="px-4 py-3 font-semibold">Tarih</th>
                  <th className="px-4 py-3 font-semibold">Islem</th>
                </tr>
              </thead>
              <tbody>
                {assignments.length > 0 ? (
                  assignments.map((assignment) => (
                    <tr key={assignment.id} className="border-t border-slate-200">
                      <td className="px-4 py-3 text-slate-900">{assignment.teacher.fullName}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {assignment.student.fullName}
                        <p className="mt-1 text-xs text-slate-500">{assignment.student.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{assignment.note ?? "-"}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(assignment.assignedAt)}</td>
                      <td className="px-4 py-3">
                        <form action={removeTeacherStudent}>
                          <input name="assignmentId" type="hidden" value={assignment.id} />
                          <button className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700" type="submit">
                            Kaldir
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-6 text-slate-600" colSpan={5}>
                      Henuz hoca-ogrenci eslestirmesi yok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function CreateTeacherForm() {
  return (
    <form action={createTeacher} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Yeni Hoca</h2>
      <Field label="Ad soyad" name="fullName" required />
      <Field label="E-posta" name="email" required type="email" />
      <Field label="Sifre" name="password" required type="password" />
      <button className="rounded-full bg-indigo-950 px-5 py-3 text-sm font-semibold text-white" type="submit">
        Hoca Olustur
      </button>
    </form>
  );
}

function CreateCourseForm() {
  return (
    <form action={createCourse} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Yeni Ders</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Ders adi" name="title" required />
        <Field label="Slug" name="slug" placeholder="matematik" required />
        <Field label="Ikon adi" name="iconName" placeholder="Opsiyonel" />
        <Field label="Sira" name="displayOrder" type="number" />
      </div>
      <label className="space-y-2 text-sm font-medium text-slate-700">
        <span>Aciklama</span>
        <textarea className="min-h-20 w-full rounded-xl border border-slate-300 px-4 py-3" name="description" placeholder="Opsiyonel" />
      </label>
      <button className="rounded-full bg-indigo-950 px-5 py-3 text-sm font-semibold text-white" type="submit">
        Ders Olustur
      </button>
    </form>
  );
}

function Field({ defaultValue, label, name, placeholder, required = false, type = "text" }: { defaultValue?: string; label: string; name: string; placeholder?: string; required?: boolean; type?: string }) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input className="w-full rounded-xl border border-slate-300 px-4 py-3" defaultValue={defaultValue} name={name} placeholder={placeholder} required={required} type={type} />
    </label>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
