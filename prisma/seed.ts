import {
  PrismaClient,
  Difficulty,
  TestStatus,
  AttemptStatus,
  UserRole,
} from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const teacherEmail = "hoca@example.com";
  const studentEmail = "ogrenci@example.com";
  const defaultPasswordHash = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: "Admin Kullanici" },
  });

  await prisma.profile.upsert({
    where: { email: adminEmail },
    update: { passwordHash: defaultPasswordHash, isActive: true },
    create: {
      userId: adminUser.id,
      fullName: "Admin Kullanici",
      email: adminEmail,
      passwordHash: defaultPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: teacherEmail },
    update: {},
    create: { email: teacherEmail, name: "Demo Hoca" },
  });

  const teacher = await prisma.profile.upsert({
    where: { email: teacherEmail },
    update: { passwordHash: defaultPasswordHash, isActive: true },
    create: {
      userId: teacherUser.id,
      fullName: "Demo Hoca",
      email: teacherEmail,
      passwordHash: defaultPasswordHash,
      role: UserRole.TEACHER,
    },
  });

  const courseSeeds = [
    {
      title: "Matematik",
      slug: "matematik",
      description: "Temel matematik ve problem cozme testleri.",
    },
    {
      title: "Turkce",
      slug: "turkce",
      description: "Dil bilgisi, paragraf ve anlam bilgisi testleri.",
    },
    {
      title: "Fen Bilgisi",
      slug: "fen-bilgisi",
      description: "Fen konulari icin coktan secmeli testler.",
    },
  ];

  const courses = [];
  for (const [index, course] of courseSeeds.entries()) {
    courses.push(
      await prisma.course.upsert({
        where: { slug: course.slug },
        update: { ...course, displayOrder: index + 1, isActive: true },
        create: { ...course, displayOrder: index + 1, isActive: true },
      }),
    );
  }

  const mathCourse = courses[0];

  const questionTexts = [
    "Demo matematik sorusu 1",
    "Demo matematik sorusu 2",
    "Demo matematik sorusu 3",
    "Demo matematik sorusu 4",
    "Demo matematik sorusu 5",
  ];

  const questions = [];
  for (let index = 0; index < questionTexts.length; index += 1) {
    const qText = questionTexts[index];
    const existing = await prisma.question.findFirst({
      where: {
        courseId: mathCourse.id,
        ownerTeacherId: teacher.id,
        questionText: qText,
      },
      select: { id: true },
    });

    if (existing) {
      questions.push(existing);
    } else {
      const created = await prisma.question.create({
        data: {
          courseId: mathCourse.id,
          ownerTeacherId: teacher.id,
          questionText: qText,
          optionA: "A secenegi",
          optionB: "B secenegi",
          optionC: "C secenegi",
          optionD: "D secenegi",
          correctOption: "A",
          difficulty: Difficulty.MEDIUM,
          topic: "Demo konu",
          explanation: "Demo aciklama",
        },
      });
      questions.push(created);
    }
  }

  const testTitle = "Demo Matematik Testi";
  let test = await prisma.test.findFirst({
    where: {
      title: testTitle,
      courseId: mathCourse.id,
      ownerTeacherId: teacher.id,
    },
  });

  if (test) {
    await prisma.testQuestion.deleteMany({
      where: { testId: test.id },
    });
    await prisma.test.update({
      where: { id: test.id },
      data: {
        description: "Ilk demo test.",
        durationMinutes: 20,
        status: TestStatus.ACTIVE,
        testQuestions: {
          create: questions.map((question, index) => ({
            questionId: question.id,
            orderIndex: index + 1,
            points: 1,
          })),
        },
      },
    });
  } else {
    test = await prisma.test.create({
      data: {
        courseId: mathCourse.id,
        ownerTeacherId: teacher.id,
        title: testTitle,
        description: "Ilk demo test.",
        durationMinutes: 20,
        status: TestStatus.ACTIVE,
        testQuestions: {
          create: questions.map((question, index) => ({
            questionId: question.id,
            orderIndex: index + 1,
            points: 1,
          })),
        },
      },
    });
  }

  const student = await prisma.student.upsert({
    where: { email: studentEmail },
    update: { passwordHash: defaultPasswordHash },
    create: {
      fullName: "Demo Ogrenci",
      email: studentEmail,
      passwordHash: defaultPasswordHash,
      gradeLevel: "8. Sinif",
      schoolName: "Demo Okul",
    },
  });

  await prisma.testAttempt.upsert({
    where: { testId_studentId: { testId: test.id, studentId: student.id } },
    update: {
      status: AttemptStatus.COMPLETED,
      completedAt: new Date(),
      durationSeconds: 320,
      score: 100,
      correctCount: 5,
      wrongCount: 0,
      emptyCount: 0,
      kvkkAcceptedAt: new Date(),
      privacyAcceptedAt: new Date(),
      termsAcceptedAt: new Date(),
    },
    create: {
      testId: test.id,
      studentId: student.id,
      status: AttemptStatus.COMPLETED,
      completedAt: new Date(),
      durationSeconds: 320,
      score: 100,
      correctCount: 5,
      wrongCount: 0,
      emptyCount: 0,
      kvkkAcceptedAt: new Date(),
      privacyAcceptedAt: new Date(),
      termsAcceptedAt: new Date(),
    },
  });

  const attempt = await prisma.testAttempt.findUnique({
    where: { testId_studentId: { testId: test.id, studentId: student.id } },
  });

  if (attempt) {
    await prisma.studentAnswer.deleteMany({
      where: { attemptId: attempt.id },
    });
    await prisma.studentAnswer.createMany({
      data: questions.map((question) => ({
        attemptId: attempt.id,
        questionId: question.id,
        selectedOption: "A",
        isCorrect: true,
      })),
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
