import { requireTeacher } from "@/lib/authorization";
import { getTeacherQuestionBank } from "@/features/question-bank/queries";
import { TeacherPanelFrame } from "@/components/teacher-panel-frame";
import { QuestionsClient } from "./_components/questions-client";

export const dynamic = "force-dynamic";

export default async function TeacherQuestionsPage() {
  const session = await requireTeacher();
  const teacherId = session.user.profileId!;
  const teacherName = session.user.name ?? "Koç";
  const { courses, questions } = await getTeacherQuestionBank(teacherId);

  return (
    <TeacherPanelFrame activeHref="/teacher/questions" teacherName={teacherName}>
      <QuestionsClient courses={courses} questions={questions} />
    </TeacherPanelFrame>
  );
}
