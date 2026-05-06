import { PrismaClient, Difficulty, TestStatus, AttemptStatus, UserRole } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

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
  const defaultPasswordHash = await bcrypt.hash(adminPassword, 12);
  const studentPasswordHash = await bcrypt.hash(adminPassword, 12);

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
    { title: "Matematik", slug: "matematik", description: "Temel matematik ve problem cozme testleri." },
    { title: "Turkce", slug: "turkce", description: "Dil bilgisi, paragraf ve anlam bilgisi testleri." },
    { title: "Fen Bilgisi", slug: "fen-bilgisi", description: "Fen konulari icin coktan secmeli testler." },
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
  const questions = [];
  for (let index = 1; index <= 5; index += 1) {
    questions.push(
      await prisma.question.create({
        data: {
          courseId: mathCourse.id,
          ownerTeacherId: teacher.id,
          questionText: `Demo matematik sorusu ${index}`,
          optionA: "A secenegi",
          optionB: "B secenegi",
          optionC: "C secenegi",
          optionD: "D secenegi",
          correctOption: "A",
          difficulty: Difficulty.MEDIUM,
          topic: "Demo konu",
          explanation: "Demo aciklama",
        },
      }),
    );
  }

  const test = await prisma.test.create({
    data: {
      courseId: mathCourse.id,
      ownerTeacherId: teacher.id,
      title: "Demo Matematik Testi",
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

  const student = await prisma.student.upsert({
    where: { email: "ogrenci@example.com" },
    update: {
      passwordHash: studentPasswordHash,
      fullName: "Demo Ogrenci",
      gradeLevel: "8. Sinif",
      schoolName: "Demo Okul",
    },
    create: {
      fullName: "Demo Ogrenci",
      email: "ogrenci@example.com",
      passwordHash: studentPasswordHash,
      gradeLevel: "8. Sinif",
      schoolName: "Demo Okul",
    },
  });

  await prisma.testAttempt.upsert({
    where: { testId_studentId: { testId: test.id, studentId: student.id } },
    update: {},
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
      answers: {
        create: questions.map((question) => ({
          questionId: question.id,
          selectedOption: "A",
          isCorrect: true,
        })),
      },
    },
  });
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
