import { notFound } from "next/navigation";

import { StudentEmptyState, StudentPanelFrame, StudentPanelHeader } from "@/components/student-panel-frame";
import { getStudentClassesData } from "@/features/student-portal/queries";
import { requireStudentSession } from "@/lib/student-session";

export default async function StudentClassesPage() {
  const sessionStudent = await requireStudentSession();
  const data = await getStudentClassesData(sessionStudent.id);

  if (!data.student) {
    notFound();
  }

  return (
    <StudentPanelFrame activeHref="/student/classes" studentName={data.student.fullName}>
      <StudentPanelHeader title="Sınıflarım" subtitle="Kayıtlı olduğun koç/sınıf ilişkilerini takip et." />
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {data.classes.length > 0 ? data.classes.map((classItem) => (
          <article key={classItem.id} className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div><h2 className="text-xl font-bold">{classItem.title}</h2><p className="mt-2 text-sm text-white/55">Koç: {classItem.coach}</p><p className="mt-1 text-xs text-white/42">{classItem.coachEmail}</p></div>
              <Badge>{classItem.studentCount} öğrenci</Badge>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info label="Atanma tarihi" value={classItem.assignedAt} />
              <Info label="Koç test sayısı" value={String(classItem.testCount)} />
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/6 p-4"><p className="text-xs text-white/45">Not</p><p className="mt-1 text-sm font-semibold text-white/82">{classItem.note ?? "Bu koçluk ilişkisi için not eklenmemiş."}</p></div>
          </article>
        )) : <StudentEmptyState title="Henüz sınıf/koç yok" text="Bir öğretmen seni sınıfına eklediğinde burada görünecek." />}
      </section>
    </StudentPanelFrame>
  );
}

function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-lg border border-teal-200/15 bg-teal-400/16 px-2.5 py-1 text-[10px] font-semibold text-teal-100">{children}</span>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-white/6 p-4"><p className="text-xs text-white/45">{label}</p><p className="mt-1 text-sm font-semibold text-white/82">{value}</p></div>; }
