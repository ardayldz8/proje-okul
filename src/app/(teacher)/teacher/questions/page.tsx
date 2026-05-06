import { Difficulty } from "@prisma/client";

import { deactivateQuestion, updateQuestion } from "@/features/question-bank/actions";
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
    <main className="bg-slate-50 px-5 py-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-900 p-8 text-white md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Soru Havuzu</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Sorularinizi yonetin</h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">Kendi sorularinizi ekleyin, ders ve zorluk seviyesine gore filtreleyin, gerektiginde pasife alin.</p>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
            <SummaryCard label="Aktif soru" value={questions.length.toString()} />
            <SummaryCard label="Ders" value={courses.length.toString()} />
            <SummaryCard label="Filtre" value={difficulty ? formatDifficulty(difficulty) : filters.courseId ? "Ders" : "Tum"} />
          </div>
        </div>

        <QuestionForm courses={courses} />

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Filtre</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">Soru listesini daralt</h2>
          </div>
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
            <button className="self-end rounded-2xl bg-indigo-950 px-5 py-3 font-bold text-white transition hover:bg-indigo-900" type="submit">
              Filtrele
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Liste</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Sorular</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{questions.length} soru</span>
          </div>

          {questions.length > 0 ? (
            <div className="mt-6 space-y-4">
              {questions.map((question) => (
                <article key={question.id} className="rounded-3xl border border-slate-200 p-5 transition hover:border-teal-200 hover:shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1">{question.course.title}</span>
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700">{formatDifficulty(question.difficulty)}</span>
                        {question.topic ? <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">{question.topic}</span> : null}
                      </div>
                      <h3 className="mt-4 font-bold leading-7 text-slate-950">{question.questionText}</h3>
                      <p className="mt-3 inline-flex rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">Dogru cevap: {question.correctOption}</p>
                    </div>
                    <form action={deactivateQuestion}>
                      <input name="questionId" type="hidden" value={question.id} />
                      <button className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50" type="submit">
                        Pasife Al
                      </button>
                    </form>
                  </div>

                  <details className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <summary className="cursor-pointer text-sm font-bold text-slate-700">Soruyu Duzenle</summary>
                    <form action={updateQuestion} className="mt-4 space-y-4">
                      <input name="questionId" type="hidden" value={question.id} />
                      <div className="grid gap-4 md:grid-cols-3">
                        <label className="space-y-2 text-sm font-medium text-slate-700">
                          <span>Ders</span>
                          <select className="w-full rounded-xl border border-slate-300 px-4 py-3" defaultValue={question.courseId} name="courseId" required>
                            {courses.map((course) => (
                              <option key={course.id} value={course.id}>
                                {course.title}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="space-y-2 text-sm font-medium text-slate-700">
                          <span>Zorluk</span>
                          <select className="w-full rounded-xl border border-slate-300 px-4 py-3" defaultValue={question.difficulty} name="difficulty" required>
                            <option value={Difficulty.EASY}>Kolay</option>
                            <option value={Difficulty.MEDIUM}>Orta</option>
                            <option value={Difficulty.HARD}>Zor</option>
                          </select>
                        </label>
                        <Field defaultValue={question.topic ?? ""} label="Konu" name="topic" />
                      </div>
                      <label className="space-y-2 text-sm font-medium text-slate-700">
                        <span>Soru metni</span>
                        <textarea className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3" defaultValue={question.questionText} name="questionText" required />
                      </label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field defaultValue={question.optionA} label="A sikki" name="optionA" required />
                        <Field defaultValue={question.optionB} label="B sikki" name="optionB" required />
                        <Field defaultValue={question.optionC} label="C sikki" name="optionC" required />
                        <Field defaultValue={question.optionD} label="D sikki" name="optionD" required />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-slate-700">
                          <span>Dogru sik</span>
                          <select className="w-full rounded-xl border border-slate-300 px-4 py-3" defaultValue={question.correctOption} name="correctOption" required>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </label>
                        <Field defaultValue={question.explanation ?? ""} label="Aciklama" name="explanation" />
                      </div>
                      <button className="rounded-2xl bg-indigo-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-900" type="submit">
                        Degisiklikleri Kaydet
                      </button>
                    </form>
                  </details>
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

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function Field({ defaultValue, label, name, required = false }: { defaultValue: string; label: string; name: string; required?: boolean }) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input className="w-full rounded-xl border border-slate-300 px-4 py-3" defaultValue={defaultValue} name={name} required={required} />
    </label>
  );
}
