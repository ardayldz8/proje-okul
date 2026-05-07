import { requireTeacher } from "@/lib/authorization";
import { getTeacherTestBuilderData } from "@/features/test-builder/queries";
import { TeacherPanelFrame } from "@/components/teacher-panel-frame";
import { TestsClient } from "./_components/tests-client";

export const dynamic = "force-dynamic";

export default async function TeacherTestsPage() {
  const session = await requireTeacher();
  const teacherId = session.user.profileId!;
  const teacherName = session.user.name ?? "Koç";
  const { courses, tests } = await getTeacherTestBuilderData(teacherId);

  return (
    <TeacherPanelFrame activeHref="/teacher/tests" teacherName={teacherName}>
      <TestsClient courses={courses} tests={tests} />
    </TeacherPanelFrame>
  );
}
