import { notFound } from "next/navigation";

import { StudentEmptyState, StudentPanelFrame, StudentPanelHeader } from "@/components/student-panel-frame";
import { getStudentById } from "@/features/student-portal/queries";
import { requireStudentSession } from "@/lib/student-session";

export default async function AnnouncementsPage() {
  const sessionStudent = await requireStudentSession();
  const student = await getStudentById(sessionStudent.id);

  if (!student) {
    notFound();
  }

  return (
    <StudentPanelFrame activeHref="/student/announcements" studentName={student.fullName}>
      <StudentPanelHeader title="Duyurular" subtitle="Koçlarından ve sistemden gelen duyuruları takip et." />
      <section className="mt-6">
        <StudentEmptyState
          title="Henüz duyuru yok"
          text="Yeni duyuru olduğunda burada görünecek."
        />
      </section>
    </StudentPanelFrame>
  );
}
