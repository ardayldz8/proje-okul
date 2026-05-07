import { notFound } from "next/navigation";

import { StudentEmptyState, StudentPanelFrame, StudentPanelHeader } from "@/components/student-panel-frame";
import { getStudentById } from "@/features/student-portal/queries";
import { requireStudentSession } from "@/lib/student-session";

export default async function CoachRequestsPage() {
  const sessionStudent = await requireStudentSession();
  const student = await getStudentById(sessionStudent.id);

  if (!student) {
    notFound();
  }

  return (
    <StudentPanelFrame activeHref="/student/coach-requests" studentName={student.fullName}>
      <StudentPanelHeader title="Koç İstekleri" subtitle="Gönderdiğin koçluk isteklerini takip et." />
      <section className="mt-6">
        <StudentEmptyState
          title="Koç istek sistemi yakında"
          text="Koçluk isteği gönderme ve takip özelliği bir sonraki güncellemede aktif olacak."
        />
      </section>
    </StudentPanelFrame>
  );
}
