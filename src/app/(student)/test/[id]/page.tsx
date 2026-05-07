import { notFound, redirect } from "next/navigation";

import { TestSolvingClient } from "@/app/(student)/test/[id]/test-solving-client";
import { getAttemptForSolving } from "@/features/student-test/queries";
import { requireStudentSession } from "@/lib/student-session";

export const dynamic = "force-dynamic";

type TestSolvingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TestSolvingPage({ params }: TestSolvingPageProps) {
  const { id } = await params;
  const [student, attempt] = await Promise.all([
    requireStudentSession(),
    getAttemptForSolving(id),
  ]);

  if (!attempt) {
    notFound();
  }

  if (attempt.studentId !== student.id) {
    redirect("/student/tests");
  }

  const questions = attempt.test.testQuestions.map((tq) => ({
    id: tq.question.id,
    text: tq.question.questionText,
    options: {
      A: tq.question.optionA,
      B: tq.question.optionB,
      C: tq.question.optionC,
      D: tq.question.optionD,
    } as const,
  }));

  return (
    <TestSolvingClient
      attemptId={attempt.id}
      courseTitle={attempt.test.course.title}
      durationMinutes={attempt.test.durationMinutes}
      questions={questions}
      remainingSeconds={attempt.remainingSeconds}
      testTitle={attempt.test.title}
    />
  );
}
