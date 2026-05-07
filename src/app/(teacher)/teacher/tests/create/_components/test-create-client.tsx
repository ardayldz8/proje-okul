"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { Difficulty } from "@prisma/client";

import { createTest } from "@/features/test-builder/actions";
import { TeacherPanelHeader } from "@/components/teacher-panel-frame";

type Course = { id: string; title: string };

type Question = {
  id: string;
  questionText: string;
  difficulty: Difficulty;
  courseId: string;
  course: { title: string };
};

const difficultyLabels: Record<Difficulty, string> = {
  [Difficulty.EASY]: "Kolay",
  [Difficulty.MEDIUM]: "Orta",
  [Difficulty.HARD]: "Zor",
};

export function TestCreateClient({ courses, questions }: { courses: Course[]; questions: Question[] }) {
  const router = useRouter();
  const [lessonFilter, setLessonFilter] = useState("Tümü");
  const [difficultyFilter, setDifficultyFilter] = useState("Tümü");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("tr-TR");
    return questions
      .filter((q) => lessonFilter === "Tümü" || q.course.title === lessonFilter)
      .filter((q) => difficultyFilter === "Tümü" || difficultyLabels[q.difficulty] === difficultyFilter)
      .filter((q) => {
        if (!normalizedSearch) return true;
        return q.questionText.toLocaleLowerCase("tr-TR").includes(normalizedSearch);
      });
  }, [difficultyFilter, lessonFilter, questions, searchTerm]);

  const selectedQuestions = useMemo(() => {
    return selectedQuestionIds.map((id) => questions.find((q) => q.id === id)).filter(Boolean) as Question[];
  }, [questions, selectedQuestionIds]);

  function showToast(message: string) {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 2600);
  }

  function addQuestion(questionId: string) {
    setSelectedQuestionIds((prev) => (prev.includes(questionId) ? prev : [...prev, questionId]));
  }

  function removeQuestion(questionId: string) {
    setSelectedQuestionIds((prev) => prev.filter((id) => id !== questionId));
  }

  function reorderQuestion(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= selectedQuestionIds.length) return;
    setSelectedQuestionIds((prev) => {
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    if (selectedQuestionIds.length === 0) {
      showToast("En az bir soru seçmelisiniz.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    selectedQuestionIds.forEach((id) => formData.append("questionIds", id));
    try {
      const result = await createTest({}, formData);
      if (result.error) {
        showToast(result.error);
      } else {
        showToast(result.message || "Test oluşturuldu.");
        router.push("/teacher/tests");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Bir hata oluştu.";
      showToast(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <TeacherPanelHeader title="Test Oluştur" subtitle="Soru havuzundan soruları seçerek yeni test oluştur." />

      <div className="mt-7 grid gap-4 xl:grid-cols-[0.85fr_1.85fr_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm font-bold">
            <SlidersHorizontal aria-hidden className="h-4 w-4 text-teal-200" />
            Filtreler
          </div>
          <div className="mt-5 space-y-4">
            <FilterSelect label="Ders" value={lessonFilter} onChange={setLessonFilter} options={["Tümü", ...courses.map((c) => c.title)]} />
            <FilterSelect label="Zorluk" value={difficultyFilter} onChange={setDifficultyFilter} options={["Tümü", "Kolay", "Orta", "Zor"]} />
            <label className="block space-y-2 text-sm font-medium text-white/62">
              <span>Arama</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                <input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35" placeholder="Soru başlığı veya konu ara..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                <Search aria-hidden className="h-4 w-4 text-white/45" />
              </div>
            </label>
          </div>
        </aside>

        <section className="rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">Soru Havuzu <span className="ml-2 text-sm text-teal-300">{filteredQuestions.length}</span></h2>
              <p className="mt-1 text-xs text-white/50">Filtrelere uygun sorular</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <QuestionPoolCard key={question.id} question={question} isSelected={selectedQuestionIds.includes(question.id)} onAdd={() => addQuestion(question.id)} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/12 bg-white/6 p-5 text-center text-sm text-white/45">
                Bu filtrelere uygun soru bulunamadı.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">Seçilen Sorular <span className="ml-2 text-sm text-teal-300">{selectedQuestions.length}</span></h2>
              <p className="mt-1 text-xs text-white/50">Teste eklenecek sorular</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {selectedQuestions.length > 0 ? (
              selectedQuestions.map((question, index) => (
                <SelectedQuestionCard key={question.id} index={index} question={question} onRemove={() => removeQuestion(question.id)} onMoveUp={() => reorderQuestion(index, "up")} onMoveDown={() => reorderQuestion(index, "down")} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/12 bg-white/6 p-5 text-center text-sm text-white/45">
                Henüz soru seçilmedi.
              </div>
            )}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-white/70">
            <span>Toplam Soru</span>
            <span className="font-semibold text-white">{selectedQuestions.length} Soru</span>
          </div>
        </section>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.7fr_0.9fr_1.4fr_auto] lg:items-end">
          <Field label="Test Adı" name="title" placeholder="Örn: 8. Sınıf Cebir Testi - 1" required />
          <Field label="Süre (Dakika)" name="durationMinutes" placeholder="40" type="number" />
          <ModalSelect label="Durum" name="status" defaultValue="DRAFT" options={[{ value: "DRAFT", label: "Taslak" }, { value: "ACTIVE", label: "Aktif" }]} />
          <Field label="Açıklama (Opsiyonel)" name="description" placeholder="Test ile ilgili notlarınızı yazabilirsiniz..." />
          <label className="flex items-center gap-2 text-sm text-white/72">
            <input type="checkbox" name="showResultImmediately" defaultChecked className="rounded border-white/20 bg-white/10 accent-rose-500" />
            Sonucu hemen göster
          </label>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-300/18 bg-gradient-to-r from-[#8f123a]/70 to-[#5f0826]/55 px-6 py-3 text-sm font-semibold shadow-[0_16px_42px_-24px_rgba(194,50,99,0.9)] transition hover:from-[#a91645]/75 hover:to-[#6d0a2d]/65 disabled:opacity-50"
            type="submit"
            disabled={isSubmitting}
          >
            <Save aria-hidden className="h-4 w-4" />
            {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>

      {toastMessage ? (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-teal-200/20 bg-[#0f2528]/90 px-5 py-3 text-sm font-semibold text-teal-100 shadow-[0_18px_56px_-28px_rgba(20,184,166,0.85)] backdrop-blur-xl">
          {toastMessage}
        </div>
      ) : null}
    </>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block space-y-2 text-sm font-medium text-white/62">
      <span>{label}</span>
      <select className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition focus:border-rose-300/35 focus:ring-2 focus:ring-rose-300/15" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option className="bg-[#140814]" key={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Field({ label, name, placeholder, type = "text", required }: { label: string; name: string; placeholder: string; type?: string; required?: boolean }) {
  return (
    <label className="block space-y-2 text-sm font-medium text-white/62">
      <span>{label}</span>
      <input className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-rose-300/35 focus:ring-2 focus:ring-rose-300/15" name={name} placeholder={placeholder} type={type} required={required} />
    </label>
  );
}

function ModalSelect({ label, name, defaultValue, options }: { label: string; name: string; defaultValue: string; options: { value: string; label: string }[] }) {
  return (
    <label className="block space-y-2 text-sm font-medium text-white/62">
      <span>{label}</span>
      <select className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition focus:border-rose-300/35 focus:ring-2 focus:ring-rose-300/15" name={name} defaultValue={defaultValue}>
        {options.map((option) => (
          <option className="bg-[#140814]" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function QuestionPoolCard({ question, isSelected, onAdd }: { question: Question; isSelected: boolean; onAdd: () => void }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/7 p-4 transition hover:bg-white/10">
      <div className="flex gap-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#8f123a]/35 text-rose-100">?</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-6 text-white/88">{question.questionText}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="rose">{question.course.title}</Badge>
            <Badge tone={question.difficulty === Difficulty.EASY ? "green" : question.difficulty === Difficulty.MEDIUM ? "amber" : "red"}>{difficultyLabels[question.difficulty]}</Badge>
          </div>
        </div>
        <button className="h-fit rounded-xl border border-teal-200/15 bg-teal-400/12 px-3 py-2 text-xs font-semibold text-teal-100 transition hover:bg-teal-400/18 disabled:cursor-not-allowed disabled:opacity-45" type="button" disabled={isSelected} onClick={onAdd}>
          <Plus aria-hidden className="mr-1 inline h-3.5 w-3.5" />
          {isSelected ? "Eklendi" : "Ekle"}
        </button>
      </div>
    </article>
  );
}

function SelectedQuestionCard({ question, index, onRemove, onMoveUp, onMoveDown }: { question: Question; index: number; onRemove: () => void; onMoveUp: () => void; onMoveDown: () => void }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/7 p-4">
      <div className="flex gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#8f123a]/65 text-xs font-bold">{index + 1}</span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-3 text-sm font-semibold leading-5 text-white/88">{question.questionText}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="rose">{question.course.title}</Badge>
            <Badge tone={question.difficulty === Difficulty.EASY ? "green" : question.difficulty === Difficulty.MEDIUM ? "amber" : "red"}>{difficultyLabels[question.difficulty]}</Badge>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/8 text-white/60" type="button" onClick={onMoveUp}>↑</button>
          <button className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/8 text-white/60" type="button" onClick={onMoveDown}>↓</button>
          <button className="grid h-8 w-8 place-items-center rounded-xl border border-rose-300/15 bg-[#8f123a]/22 text-rose-200" type="button" onClick={onRemove}>
            <Trash2 aria-hidden className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "rose" | "teal" | "green" | "amber" | "red" | "muted" }) {
  const toneClass = {
    rose: "border-rose-300/15 bg-[#8f123a]/35 text-rose-100",
    teal: "border-teal-200/15 bg-teal-400/16 text-teal-100",
    green: "border-emerald-300/15 bg-emerald-400/14 text-emerald-100",
    amber: "border-amber-300/15 bg-amber-400/14 text-amber-100",
    red: "border-red-300/15 bg-red-500/14 text-red-100",
    muted: "border-white/10 bg-white/8 text-white/55",
  }[tone];

  return <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold ${toneClass}`}>{children}</span>;
}
