import { requireTeacher } from "@/lib/authorization";
import { getTeacherTestBuilderData } from "@/features/test-builder/queries";
import { TeacherPanelFrame } from "@/components/teacher-panel-frame";
import { TestCreateClient } from "./_components/test-create-client";

export const dynamic = "force-dynamic";

export default async function TestCreatePage() {
  const session = await requireTeacher();
  const teacherId = session.user.profileId!;
  const teacherName = session.user.name ?? "Koç";
  const { courses, questions } = await getTeacherTestBuilderData(teacherId);

  return (
    <TeacherPanelFrame activeHref="/teacher/tests" teacherName={teacherName}>
      <TestCreateClient courses={courses} questions={questions} />
    </TeacherPanelFrame>
  );
}
