import { requireTeacher } from "@/lib/authorization";
import { getTeacherResults } from "@/features/results/queries";
import { TeacherPanelFrame } from "@/components/teacher-panel-frame";
import { ResultsClient } from "./_components/results-client";

export const dynamic = "force-dynamic";

export default async function TeacherResultsPage() {
  const session = await requireTeacher();
  const teacherId = session.user.profileId!;
  const teacherName = session.user.name ?? "Koç";
  const rawResults = await getTeacherResults(teacherId);

  const results = rawResults.map((r) => ({
    id: r.id,
    studentName: r.student.fullName,
    gradeLevel: r.student.gradeLevel,
    testTitle: r.test.title,
    courseTitle: r.test.course.title,
    score: r.score,
    correctCount: r.correctCount,
    wrongCount: r.wrongCount,
    emptyCount: r.emptyCount,
    completedAt: r.completedAt,
  }));

  return (
    <TeacherPanelFrame activeHref="/teacher/results" teacherName={teacherName}>
      <ResultsClient results={results} />
    </TeacherPanelFrame>
  );
}
