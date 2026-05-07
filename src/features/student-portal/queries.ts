import { AttemptStatus, TestStatus } from "@prisma/client";

import { db } from "@/lib/db";

export async function getStudentById(studentId: string) {
  return db.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      gradeLevel: true,
      schoolName: true,
    },
  });
}

export async function getStudentDashboardData(studentId: string) {
  const now = new Date();
  const [student, completedAttempts, inProgressAttempts, wrongTopics, teacherLinks, activeTests] = await Promise.all([
    getStudentById(studentId),
    db.testAttempt.findMany({
      where: {
        studentId,
        status: AttemptStatus.COMPLETED,
      },
      select: {
        score: true,
      },
    }),
    db.testAttempt.count({
      where: {
        studentId,
        status: AttemptStatus.IN_PROGRESS,
      },
    }),
    db.studentAnswer.findMany({
      where: {
        isCorrect: false,
        attempt: {
          studentId,
          status: AttemptStatus.COMPLETED,
        },
        question: {
          topic: { not: null },
        },
      },
      distinct: ["questionId"],
      select: {
        question: {
          select: {
            topic: true,
          },
        },
      },
    }),
    db.teacherStudent.findMany({
      where: { studentId },
      orderBy: { assignedAt: "desc" },
      take: 4,
      select: {
        teacher: {
          select: {
            fullName: true,
          },
        },
      },
    }),
    db.test.findMany({
      where: {
        status: TestStatus.ACTIVE,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gt: now } }] }],
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        title: true,
      },
    }),
  ]);

  const scoredAttempts = completedAttempts.filter((attempt) => typeof attempt.score === "number");
  const averageScore = scoredAttempts.length
    ? Math.round(scoredAttempts.reduce((total, attempt) => total + (attempt.score ?? 0), 0) / scoredAttempts.length)
    : 0;
  const topics = new Set(wrongTopics.map((answer) => answer.question.topic).filter(Boolean));

  return {
    student,
    stats: {
      averageScore,
      completedTestCount: completedAttempts.length,
      inProgressTestCount: inProgressAttempts,
      missingTopicCount: topics.size,
      coachStatus: teacherLinks.length > 0 ? "Aktif" : "Yok",
    },
    classes: teacherLinks.map((link) => `${link.teacher.fullName} Koçluğu`),
    notifications: activeTests.map((test) => `${test.title} testi aktif`),
  };
}

function activeTestWhere(now: Date) {
  return {
    status: TestStatus.ACTIVE,
    OR: [{ startsAt: null }, { startsAt: { lte: now } }],
    AND: [{ OR: [{ endsAt: null }, { endsAt: { gt: now } }] }],
  };
}

export async function getStudentTestsData(studentId: string) {
  const now = new Date();
  const [student, attempts, availableTests] = await Promise.all([
    getStudentById(studentId),
    db.testAttempt.findMany({
      where: { studentId },
      orderBy: { startedAt: "desc" },
      select: {
        id: true,
        status: true,
        score: true,
        test: {
          select: {
            id: true,
            title: true,
            course: { select: { title: true } },
            _count: { select: { testQuestions: true } },
          },
        },
        _count: { select: { answers: true } },
      },
    }),
    db.test.findMany({
      where: {
        ...activeTestWhere(now),
        attempts: { none: { studentId } },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        title: true,
        course: { select: { title: true } },
        _count: { select: { testQuestions: true } },
      },
    }),
  ]);

  return {
    student,
    tests: [
      ...attempts.map((attempt) => {
        const questionCount = attempt.test._count.testQuestions;
        const answeredCount = attempt._count.answers;
        const progress = attempt.status === AttemptStatus.COMPLETED ? 100 : questionCount > 0 ? Math.min(Math.round((answeredCount / questionCount) * 100), 100) : 0;

        return {
          id: attempt.id,
          title: attempt.test.title,
          course: attempt.test.course.title,
          status: attempt.status === AttemptStatus.COMPLETED ? "Tamamlandı" : "Devam Ediyor",
          progress,
          href: attempt.status === AttemptStatus.COMPLETED ? `/test/${attempt.id}/result` : `/test/${attempt.id}`,
          action: attempt.status === AttemptStatus.COMPLETED ? "Sonucu Gör" : "Teste Devam Et",
        };
      }),
      ...availableTests.map((test) => ({
        id: test.id,
        title: test.title,
        course: test.course.title,
        status: "Başlanmadı",
        progress: 0,
        href: `/test/${test.id}/start`,
        action: "Teste Başla",
      })),
    ],
  };
}

export async function getStudentResultsData(studentId: string) {
  const [student, attempts] = await Promise.all([
    getStudentById(studentId),
    db.testAttempt.findMany({
      where: {
        studentId,
        status: AttemptStatus.COMPLETED,
      },
      orderBy: { completedAt: "desc" },
      select: {
        id: true,
        score: true,
        correctCount: true,
        wrongCount: true,
        emptyCount: true,
        completedAt: true,
        test: {
          select: {
            title: true,
            course: { select: { title: true } },
          },
        },
      },
    }),
  ]);

  const scores = attempts.map((attempt) => Math.round(attempt.score ?? 0));
  const averageScore = scores.length ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length) : 0;
  const highestScore = scores.length ? Math.max(...scores) : 0;
  const totalCorrect = attempts.reduce((total, attempt) => total + attempt.correctCount, 0);
  const totalAnswered = attempts.reduce((total, attempt) => total + attempt.correctCount + attempt.wrongCount + attempt.emptyCount, 0);
  const successRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return {
    student,
    stats: {
      averageScore,
      highestScore,
      completedCount: attempts.length,
      successRate,
    },
    results: attempts.map((attempt) => ({
      id: attempt.id,
      test: attempt.test.title,
      course: attempt.test.course.title,
      score: Math.round(attempt.score ?? 0),
      date: attempt.completedAt ? new Intl.DateTimeFormat("tr-TR").format(attempt.completedAt) : "-",
    })),
  };
}

export async function getStudentClassesData(studentId: string) {
  const [student, classes] = await Promise.all([
    getStudentById(studentId),
    db.teacherStudent.findMany({
      where: { studentId },
      orderBy: { assignedAt: "desc" },
      select: {
        id: true,
        assignedAt: true,
        note: true,
        teacher: {
          select: {
            fullName: true,
            email: true,
            _count: { select: { teacherStudents: true, ownedTests: true } },
          },
        },
      },
    }),
  ]);

  return {
    student,
    classes: classes.map((item) => ({
      id: item.id,
      title: `${item.teacher.fullName} Koçluğu`,
      coach: item.teacher.fullName,
      coachEmail: item.teacher.email,
      studentCount: item.teacher._count.teacherStudents,
      testCount: item.teacher._count.ownedTests,
      assignedAt: new Intl.DateTimeFormat("tr-TR").format(item.assignedAt),
      note: item.note,
    })),
  };
}

export async function getStudentMissingTopicsData(studentId: string) {
  const [student, wrongAnswers] = await Promise.all([
    getStudentById(studentId),
    db.studentAnswer.findMany({
      where: {
        isCorrect: false,
        attempt: { studentId, status: AttemptStatus.COMPLETED },
        question: { topic: { not: null } },
      },
      select: {
        question: {
          select: {
            topic: true,
            course: { select: { title: true } },
          },
        },
      },
    }),
  ]);

  const byTopic = new Map<string, { title: string; course: string; count: number }>();

  for (const answer of wrongAnswers) {
    const topic = answer.question.topic;
    if (!topic) continue;
    const key = `${answer.question.course.title}:${topic}`;
    const existing = byTopic.get(key);
    byTopic.set(key, { title: topic, course: answer.question.course.title, count: (existing?.count ?? 0) + 1 });
  }

  const maxCount = Math.max(...Array.from(byTopic.values()).map((topic) => topic.count), 1);

  return {
    student,
    topics: Array.from(byTopic.values())
      .sort((a, b) => b.count - a.count)
      .map((topic) => ({ ...topic, missing: Math.max(Math.round((topic.count / maxCount) * 100), 20) })),
  };
}

export async function getStudentWrongQuestionsData(studentId: string) {
  const [student, answers] = await Promise.all([
    getStudentById(studentId),
    db.studentAnswer.findMany({
      where: {
        isCorrect: false,
        attempt: { studentId, status: AttemptStatus.COMPLETED },
      },
      orderBy: { answeredAt: "desc" },
      take: 24,
      select: {
        id: true,
        selectedOption: true,
        questionTextSnapshot: true,
        correctOptionSnapshot: true,
        explanationSnapshot: true,
        question: {
          select: {
            questionText: true,
            correctOption: true,
            explanation: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
          },
        },
      },
    }),
  ]);

  return {
    student,
    questions: answers.map((answer) => {
      const correctOption = answer.correctOptionSnapshot ?? answer.question.correctOption;
      const selectedOption = answer.selectedOption;
      const options = {
        A: answer.question.optionA,
        B: answer.question.optionB,
        C: answer.question.optionC,
        D: answer.question.optionD,
      } as const;

      return {
        id: answer.id,
        preview: answer.questionTextSnapshot ?? answer.question.questionText,
        correct: options[correctOption as keyof typeof options] ?? correctOption,
        yours: selectedOption ? (options[selectedOption as keyof typeof options] ?? selectedOption) : "Boş",
        explanation: answer.explanationSnapshot ?? answer.question.explanation ?? "Bu soru icin aciklama eklenmemis.",
      };
    }),
  };
}

export async function getStudentCoursesData(studentId: string) {
  const [student, courses, attempts] = await Promise.all([
    getStudentById(studentId),
    db.course.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        _count: { select: { tests: true } },
      },
    }),
    db.testAttempt.findMany({
      where: {
        studentId,
        status: AttemptStatus.COMPLETED,
      },
      select: {
        test: {
          select: {
            courseId: true,
          },
        },
      },
    }),
  ]);

  const completedCountByCourse = new Map<string, number>();
  for (const attempt of attempts) {
    const courseId = attempt.test.courseId;
    completedCountByCourse.set(courseId, (completedCountByCourse.get(courseId) ?? 0) + 1);
  }

  return {
    student,
    courses: courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      testCount: course._count.tests,
      completedCount: completedCountByCourse.get(course.id) ?? 0,
    })),
  };
}
