"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Edit3, Eye, Grid2X2, MoreVertical, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Difficulty } from "@prisma/client";

import { createQuestion, deactivateQuestion, updateQuestion } from "@/features/question-bank/actions";
import { TeacherPanelHeader } from "@/components/teacher-panel-frame";

type Course = { id: string; title: string };

type Question = {
  id: string;
  questionText: string;
  difficulty: Difficulty;
  topic: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string | null;
  courseId: string;
  createdAt: Date;
  course: { title: string };
};

type ModalMode = "create" | "edit";
type ViewMode = "grid" | "list";

const difficultyLabels: Record<Difficulty, string> = {
  [Difficulty.EASY]: "Kolay",
  [Difficulty.MEDIUM]: "Orta",
  [Difficulty.HARD]: "Zor",
};

const difficultyOrder: Record<string, number> = {
  Kolay: 1,
  Orta: 2,
  Zor: 3,
};

export function QuestionsClient({ courses, questions }: { courses: Course[]; questions: Question[] }) {
  const router = useRouter();
  const [lessonFilter, setLessonFilter] = useState("Tümü");
  const [difficultyFilter, setDifficultyFilter] = useState("Tümü");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Yeni eklenenler");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("tr-TR");
    return questions
      .filter((q) => lessonFilter === "Tümü" || q.course.title === lessonFilter)
      .filter((q) => difficultyFilter === "Tümü" || difficultyLabels[q.difficulty] === difficultyFilter)
      .filter((q) => {
        if (!normalizedSearch) return true;
        return `${q.questionText} ${q.topic ?? ""}`.toLocaleLowerCase("tr-TR").includes(normalizedSearch);
      })
      .sort((a, b) => {
        if (sortBy === "Zorluk") {
          return difficultyOrder[difficultyLabels[a.difficulty]] - difficultyOrder[difficultyLabels[b.difficulty]];
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [difficultyFilter, questions, lessonFilter, searchTerm, sortBy]);

  function openCreateModal() {
    setSelectedQuestion(null);
    setModalMode("create");
  }

  function openEditModal(question: Question) {
    setSelectedQuestion(question);
    setModalMode("edit");
    setOpenMenuId(null);
  }

  function showToast(message: string) {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 2600);
  }

  async function handleDeactivate(questionId: string) {
    const formData = new FormData();
    formData.set("questionId", questionId);
    try {
      await deactivateQuestion(formData);
      showToast("Soru pasife alındı.");
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "İşlem başarısız oldu.";
      showToast(message);
    }
    setOpenMenuId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (modalMode === "edit" && selectedQuestion) {
      formData.set("questionId", selectedQuestion.id);
    }
    try {
      if (modalMode === "create") {
        const result = await createQuestion({}, formData);
        if (result.error) throw new Error(result.error);
        showToast("Soru eklendi.");
      } else {
        await updateQuestion(formData);
        showToast("Soru güncellendi.");
      }
      setModalMode(null);
      setSelectedQuestion(null);
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "İşlem başarısız oldu.";
      showToast(message);
    }
  }

  return (
    <>
      <TeacherPanelHeader title="Soru Havuzu" subtitle="Sorularını yönet, filtrele ve testlerde kullan." />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <FilterSelect label="Ders" icon={BookOpen} options={["Tümü", ...courses.map((c) => c.title)]} value={lessonFilter} onChange={setLessonFilter} />
          <FilterSelect label="Zorluk" icon={SlidersHorizontal} options={["Tümü", "Kolay", "Orta", "Zor"]} value={difficultyFilter} onChange={setDifficultyFilter} />
          <label className="space-y-2 text-sm font-medium text-white/62">
            <span>Arama</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3.5">
              <Search aria-hidden className="h-4 w-4 text-white/45" />
              <input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35" placeholder="Soru başlığı veya konu ara..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            </div>
          </label>
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl border border-rose-300/18 bg-gradient-to-r from-[#8f123a]/70 to-[#5f0826]/55 px-5 py-3 text-sm font-semibold shadow-[0_16px_42px_-24px_rgba(194,50,99,0.9)] transition hover:from-[#a91645]/75 hover:to-[#6d0a2d]/65" type="button" onClick={openCreateModal}>
          <Plus aria-hidden className="h-4 w-4" />
          Soru Ekle
        </button>
      </div>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/7 p-4 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/64">
            Toplam <span className="font-semibold text-teal-300">{filteredQuestions.length}</span> soru
          </p>
          <div className="flex gap-3">
            <button className={`grid h-10 w-10 place-items-center rounded-2xl border text-white transition ${viewMode === "grid" ? "border-rose-300/18 bg-[#8f123a]/35 shadow-[0_16px_42px_-28px_rgba(194,50,99,0.9)]" : "border-white/10 bg-white/8 hover:bg-white/12"}`} type="button" onClick={() => setViewMode("grid")}>
              <Grid2X2 aria-hidden className="h-4 w-4" />
            </button>
            <button className={`grid h-10 w-10 place-items-center rounded-2xl border text-white transition ${viewMode === "list" ? "border-rose-300/18 bg-[#8f123a]/35 shadow-[0_16px_42px_-28px_rgba(194,50,99,0.9)]" : "border-white/10 bg-white/8 hover:bg-white/12"}`} type="button" onClick={() => setViewMode("list")}>
              <SlidersHorizontal aria-hidden className="h-4 w-4" />
            </button>
            <select className="rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm text-white/72 outline-none transition focus:border-rose-300/35 focus:ring-2 focus:ring-rose-300/15" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option className="bg-[#140814]">Yeni eklenenler</option>
              <option className="bg-[#140814]">Zorluk</option>
            </select>
          </div>
        </div>

        <div className={`mt-5 grid gap-4 ${viewMode === "grid" ? "lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
          {filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              viewMode={viewMode}
              isMenuOpen={openMenuId === question.id}
              onEdit={() => openEditModal(question)}
              onMenuToggle={() => setOpenMenuId(openMenuId === question.id ? null : question.id)}
              onDeactivate={() => handleDeactivate(question.id)}
            />
          ))}
          {filteredQuestions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/14 bg-white/6 p-8 text-center text-sm text-white/55 lg:col-span-2 xl:col-span-3">
              Bu filtrelere uygun soru bulunamadı.
            </div>
          ) : null}
        </div>
      </section>

      {toastMessage ? (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-teal-200/20 bg-[#0f2528]/90 px-5 py-3 text-sm font-semibold text-teal-100 shadow-[0_18px_56px_-28px_rgba(20,184,166,0.85)] backdrop-blur-xl">
          {toastMessage}
        </div>
      ) : null}
      {modalMode ? (
        <QuestionModal
          mode={modalMode}
          question={selectedQuestion}
          courses={courses}
          onClose={() => {
            setModalMode(null);
            setSelectedQuestion(null);
          }}
          onSubmit={handleSubmit}
        />
      ) : null}
    </>
  );
}

function FilterSelect({ label, icon: Icon, options, value, onChange }: { label: string; icon: typeof BookOpen; options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2 text-sm font-medium text-white/62">
      <span>{label}</span>
      <div className="relative">
        <Icon aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
        <select className="w-full appearance-none rounded-2xl border border-white/10 bg-white/8 px-10 py-3.5 text-sm text-white outline-none transition focus:border-rose-300/35 focus:ring-2 focus:ring-rose-300/15" value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option className="bg-[#140814]" key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function QuestionCard({
  question,
  viewMode,
  isMenuOpen,
  onEdit,
  onMenuToggle,
  onDeactivate,
}: {
  question: Question;
  viewMode: ViewMode;
  isMenuOpen: boolean;
  onEdit: () => void;
  onMenuToggle: () => void;
  onDeactivate: () => void;
}) {
  const diffLabel = difficultyLabels[question.difficulty];
  return (
    <article className={`rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/11 ${viewMode === "list" ? "grid gap-4 md:grid-cols-[1fr_auto]" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge tone="rose">{question.course.title}</Badge>
        </div>
        <Badge tone={diffLabel === "Kolay" ? "green" : diffLabel === "Orta" ? "amber" : "red"}>{diffLabel}</Badge>
      </div>

      <h2 className="mt-5 min-h-16 text-sm font-semibold leading-6 text-white/88">{question.questionText}</h2>
      <p className="mt-4 text-xs text-white/45">Konu: {question.topic ?? "-"}</p>

      <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4 text-xs text-white/48">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <Eye aria-hidden className="h-4 w-4" />
            {new Date(question.createdAt).toLocaleDateString("tr-TR")}
          </span>
        </div>
        <div className="relative flex items-center gap-3">
          <button className="transition hover:text-white" type="button" onClick={onEdit} aria-label="Soruyu düzenle">
            <Edit3 aria-hidden className="h-4 w-4" />
          </button>
          <button className="transition hover:text-white" type="button" onClick={onMenuToggle} aria-label="Soru menüsü">
            <MoreVertical aria-hidden className="h-4 w-4" />
          </button>
          {isMenuOpen ? (
            <div className="absolute bottom-7 right-0 z-20 w-36 overflow-hidden rounded-2xl border border-white/12 bg-[#19101d]/95 p-1.5 shadow-[0_18px_56px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl">
              <MenuButton onClick={onEdit}>Düzenle</MenuButton>
              <MenuButton onClick={onDeactivate}>Pasife Al</MenuButton>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function QuestionModal({ mode, question, courses, onClose, onSubmit }: { mode: ModalMode; question: Question | null; courses: Course[]; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/15 bg-[#140b18]/95 p-6 shadow-[0_28px_90px_-28px_rgba(0,0,0,0.95)] backdrop-blur-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{mode === "create" ? "Soru Ekle" : "Soruyu Düzenle"}</h2>
            <p className="mt-2 text-sm text-white/55">Soru bilgilerini doldurun ve kaydedin.</p>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/8 text-white/70 transition hover:bg-white/12 hover:text-white" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="mt-7 space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <ModalSelect label="Ders" name="courseId" defaultValue={question?.courseId ?? courses[0]?.id ?? ""} options={courses.map((c) => ({ value: c.id, label: c.title }))} />
            <ModalSelect label="Zorluk" name="difficulty" defaultValue={question?.difficulty ?? "MEDIUM"} options={[{ value: "EASY", label: "Kolay" }, { value: "MEDIUM", label: "Orta" }, { value: "HARD", label: "Zor" }]} />
          </div>

          <ModalInput label="Konu" name="topic" defaultValue={question?.topic ?? ""} placeholder="Konu başlığı" />

          <label className="block space-y-2 text-sm font-medium text-white/72">
            <span>Soru Metni</span>
            <textarea className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-rose-300/35 focus:ring-2 focus:ring-rose-300/15" name="questionText" defaultValue={question?.questionText ?? ""} placeholder="Soru metnini yaz..." />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <ModalInput label="A Şıkkı" name="optionA" placeholder="A seçeneği" defaultValue={question?.optionA ?? ""} />
            <ModalInput label="B Şıkkı" name="optionB" placeholder="B seçeneği" defaultValue={question?.optionB ?? ""} />
            <ModalInput label="C Şıkkı" name="optionC" placeholder="C seçeneği" defaultValue={question?.optionC ?? ""} />
            <ModalInput label="D Şıkkı" name="optionD" placeholder="D seçeneği" defaultValue={question?.optionD ?? ""} />
          </div>

          <ModalSelect label="Doğru Cevap" name="correctOption" defaultValue={question?.correctOption ?? "A"} options={[{ value: "A", label: "A" }, { value: "B", label: "B" }, { value: "C", label: "C" }, { value: "D", label: "D" }]} />

          <label className="block space-y-2 text-sm font-medium text-white/72">
            <span>Açıklama (Opsiyonel)</span>
            <textarea className="min-h-20 w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-rose-300/35 focus:ring-2 focus:ring-rose-300/15" name="explanation" defaultValue={question?.explanation ?? ""} placeholder="Doğru cevap açıklaması..." />
          </label>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button className="rounded-2xl border border-white/10 bg-white/8 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/12 hover:text-white" type="button" onClick={onClose}>
              Vazgeç
            </button>
            <button className="rounded-2xl border border-rose-300/18 bg-gradient-to-r from-[#8f123a]/75 to-[#5f0826]/60 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_42px_-24px_rgba(194,50,99,0.9)] transition hover:from-[#a91645]/80 hover:to-[#6d0a2d]/70" type="submit">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalInput({ label, name, placeholder, defaultValue = "" }: { label: string; name: string; placeholder: string; defaultValue?: string }) {
  return (
    <label className="block space-y-2 text-sm font-medium text-white/72">
      <span>{label}</span>
      <input className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-rose-300/35 focus:ring-2 focus:ring-rose-300/15" name={name} defaultValue={defaultValue} placeholder={placeholder} />
    </label>
  );
}

function ModalSelect({ label, name, defaultValue, options }: { label: string; name: string; defaultValue: string; options: { value: string; label: string }[] }) {
  return (
    <label className="block space-y-2 text-sm font-medium text-white/72">
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

function MenuButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button className="block w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-white/70 transition hover:bg-white/8 hover:text-white" type="button" onClick={onClick}>
      {children}
    </button>
  );
}

function Badge({ children, tone }: { children: ReactNode; tone: "rose" | "teal" | "green" | "amber" | "red" }) {
  const toneClass = {
    rose: "border-rose-300/15 bg-[#8f123a]/35 text-rose-100",
    teal: "border-teal-200/15 bg-teal-400/16 text-teal-100",
    green: "border-emerald-300/15 bg-emerald-400/14 text-emerald-100",
    amber: "border-amber-300/15 bg-amber-400/14 text-amber-100",
    red: "border-red-300/15 bg-red-500/14 text-red-100",
  }[tone];

  return <span className={`rounded-xl border px-3 py-1 text-xs font-semibold ${toneClass}`}>{children}</span>;
}
