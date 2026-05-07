import { BookOpen } from "lucide-react";
import { notFound } from "next/navigation";

import { StudentEmptyState, StudentPanelFrame, StudentPanelHeader } from "@/components/student-panel-frame";
import { getStudentCoursesData } from "@/features/student-portal/queries";
import { requireStudentSession } from "@/lib/student-session";

export default async function StudentCoursesPage() {
  const sessionStudent = await requireStudentSession();
  const data = await getStudentCoursesData(sessionStudent.id);

  if (!data.student) {
    notFound();
  }

  return (
    <StudentPanelFrame activeHref="/student/courses" studentName={data.student.fullName}>
      <StudentPanelHeader title="Derslerim" subtitle="Aktif dersleri ve çalışma alanlarını görüntüle." />
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.courses.length > 0 ? (
          data.courses.map((course) => (
            <article key={course.id} className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-400/14 text-teal-100 ring-1 ring-teal-200/15">
                  <BookOpen className="h-6 w-6" />
                </div>
                <Badge>{course.testCount} test</Badge>
              </div>
              <h2 className="mt-5 text-xl font-bold">{course.title}</h2>
              <p className="mt-2 text-sm text-white/54">{course.description ?? "Bu derse ait çalışma alanı."}</p>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs text-white/52">
                  <span>Tamamlanan test</span>
                  <span>{course.completedCount} / {course.testCount}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-300 to-cyan-400"
                    style={{ width: `${course.testCount > 0 ? Math.round((course.completedCount / course.testCount) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </article>
          ))
        ) : (
          <StudentEmptyState title="Henüz ders yok" text="Aktif ders eklendiğinde burada görünecek." />
        )}
      </section>
    </StudentPanelFrame>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-lg border border-teal-200/15 bg-teal-400/16 px-2.5 py-1 text-[10px] font-semibold text-teal-100">{children}</span>;
}
