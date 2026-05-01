import { Difficulty } from "@prisma/client";

import { deactivateQuestion } from "@/features/question-bank/actions";
import { QuestionForm } from "@/features/question-bank/components/question-form";
import { getTeacherQuestionBank } from "@/features/question-bank/queries";
import { requireTeacher } from "@/lib/authorization";

export const dynamic = "force-dynamic";

type TeacherQuestionsPageProps = {
  searchParams: Promise<{ courseId?: string; difficulty?: string }>;
};

export default async function TeacherQuestionsPage({ searchParams }: TeacherQuestionsPageProps) {
  const session = await requireTeacher();
  const filters = await searchParams;
  const difficulty = filters.difficulty && Object.values(Difficulty).includes(filters.difficulty as Difficulty) ? (filters.difficulty as Difficulty) : undefined;

  if (!session.user.profileId) {
    throw new Error("Hoca profili bulunamadi.");
  }

  const { courses, questions } = await getTeacherQuestionBank(session.user.profileId, {
    courseId: filters.courseId,
    difficulty,
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">Soru Havuzu</h1>
          <p className="mt-4 text-slate-600">Kendi sorularinizi ekleyin, filtreleyin ve pasife alin.</p>
        </div>

        <QuestionForm courses={courses} />

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Ders filtresi</span>
              <select className="w-full rounded-xl border border-slate-300 px-4 py-3" defaultValue={filters.courseId ?? ""} name="courseId">
                <option value="">Tum dersler</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Zorluk filtresi</span>
              <select className="w-full rounded-xl border border-slate-300 px-4 py-3" defaultValue={difficulty ?? ""} name="difficulty">
                <option value="">Tum zorluklar</option>
                <option value={Difficulty.EASY}>Kolay</option>
                <option value={Difficulty.MEDIUM}>Orta</option>
                <option value={Difficulty.HARD}>Zor</option>
              </select>
            </label>
            <button className="self-end rounded-full bg-indigo-950 px-5 py-3 font-semibold text-white" type="submit">
              Filtrele
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-950">Sorular</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{questions.length} soru</span>
          </div>

          {questions.length > 0 ? (
            <div className="mt-6 space-y-4">
              {questions.map((question) => (
                <article key={question.id} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                        <span>{question.course.title}</span>
                        <span>{formatDifficulty(question.difficulty)}</span>
                        {question.topic ? <span>{question.topic}</span> : null}
                      </div>
                      <h3 className="mt-3 font-semibold text-slate-950">{question.questionText}</h3>
                      <p className="mt-3 text-sm text-slate-600">Dogru cevap: {question.correctOption}</p>
                    </div>
                    <form action={deactivateQuestion}>
                      <input name="questionId" type="hidden" value={question.id} />
                      <button className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700" type="submit">
                        Pasife Al
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">Filtreye uygun aktif soru bulunmuyor.</div>
          )}
        </div>
      </section>
    </main>
  );
}

function formatDifficulty(difficulty: Difficulty) {
  const labels = {
    [Difficulty.EASY]: "Kolay",
    [Difficulty.MEDIUM]: "Orta",
    [Difficulty.HARD]: "Zor",
  };

  return labels[difficulty];
}
