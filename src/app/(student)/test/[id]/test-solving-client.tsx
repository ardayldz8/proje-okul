"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, ClipboardList, Flag, XCircle } from "lucide-react";

import { completeStudentAttempt } from "@/features/student-test/actions";

type Question = {
  id: string;
  text: string;
  options: Record<"A" | "B" | "C" | "D", string>;
};

type TestSolvingClientProps = {
  attemptId: string;
  testTitle: string;
  courseTitle: string;
  durationMinutes: number | null;
  remainingSeconds: number | null;
  questions: Question[];
};

export function TestSolvingClient({ attemptId, testTitle, courseTitle, durationMinutes, remainingSeconds, questions }: TestSolvingClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(remainingSeconds);

  const currentQuestion = questions[currentIndex];

  const progress = useMemo(() => {
    const answeredCount = Object.keys(answers).length;
    const flaggedCount = flaggedQuestions.length;
    const unansweredCount = questions.length - answeredCount;
    const percent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;
    return { answeredCount, flaggedCount, unansweredCount, percent };
  }, [answers, flaggedQuestions, questions.length]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t !== null && t <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return t !== null ? t - 1 : null;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatTime(seconds: number | null) {
    if (seconds === null) return "Suresiz";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function selectOption(option: string) {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: option }));
  }

  function toggleFlag() {
    setFlaggedQuestions((current) => {
      if (current.includes(currentQuestion.id)) {
        return current.filter((id) => id !== currentQuestion.id);
      }
      return [...current, currentQuestion.id];
    });
  }

  async function handleFinish() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsFinishModalOpen(false);

    const formData = new FormData();
    formData.append("attemptId", attemptId);
    for (const [questionId, answer] of Object.entries(answers)) {
      formData.append(`answer-${questionId}`, answer);
    }

    try {
      await completeStudentAttempt(formData);
    } catch {
      setIsSubmitting(false);
      alert("Test tamamlanirken bir hata olustu. Lutfen tekrar deneyin.");
    }
    // redirect handled by server action
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06111f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_16%,rgba(13,148,136,0.42),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(20,184,166,0.25),transparent_28%),radial-gradient(circle_at_70%_60%,rgba(194,50,99,0.36),transparent_28%),linear-gradient(135deg,#1c0613_0%,#071426_44%,#052d35_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:64px_64px] opacity-25" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-4 p-3 lg:flex-row lg:p-4">
        <section className="flex-1 rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-4 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-6">
          <header className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <Link className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-white/58 transition hover:text-white" href="/student/tests">
                <ArrowLeft className="h-4 w-4" />
                Testlerime dön
              </Link>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{testTitle}</h1>
              <p className="mt-2 text-sm text-white/64">{courseTitle}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <InfoPill icon={Clock3} label="Kalan Süre" value={formatTime(timeLeft)} />
              <InfoPill icon={ClipboardList} label="Soru" value={`${currentIndex + 1} / ${questions.length}`} />
              <button
                className="rounded-2xl border border-rose-300/18 bg-gradient-to-r from-[#8f123a]/70 to-[#5f0826]/55 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_42px_-24px_rgba(194,50,99,0.9)] transition hover:from-[#a91645]/75 hover:to-[#6d0a2d]/65 disabled:opacity-60"
                disabled={isSubmitting}
                type="button"
                onClick={() => setIsFinishModalOpen(true)}
              >
                Testi Bitir
              </button>
            </div>
          </header>

          <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_330px]">
            <section className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {flaggedQuestions.includes(currentQuestion.id) ? <Badge tone="amber">İşaretli</Badge> : null}
                  </div>
                  <h2 className="mt-4 text-2xl font-bold leading-9">Soru {currentIndex + 1}</h2>
                </div>
                <button
                  className={`inline-flex w-fit items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${flaggedQuestions.includes(currentQuestion.id) ? "border-amber-300/20 bg-amber-400/16 text-amber-100" : "border-white/10 bg-white/8 text-white/70 hover:bg-white/12 hover:text-white"}`}
                  type="button"
                  onClick={toggleFlag}
                >
                  <Flag className="h-4 w-4" />
                  Soruyu işaretle
                </button>
              </div>

              <p className="mt-6 rounded-3xl border border-white/10 bg-white/7 p-5 text-lg font-semibold leading-8 text-white/88">{currentQuestion.text}</p>

              <div className="mt-6 grid gap-3">
                {Object.entries(currentQuestion.options).map(([label, option]) => {
                  const isSelected = answers[currentQuestion.id] === label;
                  return (
                    <button
                      key={label}
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${isSelected ? "border-teal-200/25 bg-teal-400/16 text-white shadow-[0_18px_46px_-30px_rgba(20,184,166,0.9)]" : "border-white/10 bg-white/7 text-white/72 hover:bg-white/10 hover:text-white"}`}
                      type="button"
                      onClick={() => selectOption(label)}
                    >
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold ${isSelected ? "bg-teal-300 text-[#06232a]" : "bg-white/8 text-white/72"}`}>{label}</span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="rounded-2xl border border-white/10 bg-white/8 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/12 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={currentIndex === 0}
                  type="button"
                  onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                >
                  Önceki
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-teal-200/15 bg-teal-400/12 px-5 py-3 text-sm font-semibold text-teal-100 transition hover:bg-teal-400/18 disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={currentIndex === questions.length - 1}
                  type="button"
                  onClick={() => setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))}
                >
                  Sonraki <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </section>

            <aside className="space-y-4">
              <section className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                <h2 className="font-bold">Soru Listesi</h2>
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {questions.map((question, index) => {
                    const isCurrent = index === currentIndex;
                    const isAnswered = Boolean(answers[question.id]);
                    const isFlagged = flaggedQuestions.includes(question.id);
                    const toneClass = isCurrent
                      ? "border-rose-300/25 bg-[#8f123a]/65 text-white"
                      : isFlagged
                        ? "border-amber-300/20 bg-amber-400/18 text-amber-100"
                        : isAnswered
                          ? "border-teal-200/20 bg-teal-400/16 text-teal-100"
                          : "border-white/10 bg-white/8 text-white/58";
                    return (
                      <button key={question.id} className={`grid h-11 place-items-center rounded-xl border text-sm font-bold transition hover:bg-white/12 ${toneClass}`} type="button" onClick={() => setCurrentIndex(index)}>
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                <h2 className="font-bold">Test Bilgileri</h2>
                <div className="mt-4 space-y-3 text-sm text-white/64">
                  <InfoRow label="Ders" value={courseTitle} />
                  <InfoRow label="Toplam Soru" value={questions.length.toString()} />
                  <InfoRow label="Süre" value={durationMinutes ? `${durationMinutes} dakika` : "Suresiz"} />
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                <h2 className="font-bold">İlerleme Durumu</h2>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-300 to-cyan-400" style={{ width: `${progress.percent}%` }} />
                </div>
                <div className="mt-4 grid gap-3 text-sm">
                  <ProgressRow icon={CheckCircle2} label="Cevaplanan" value={progress.answeredCount} tone="teal" />
                  <ProgressRow icon={Flag} label="İşaretli" value={progress.flaggedCount} tone="amber" />
                  <ProgressRow icon={XCircle} label="Boş" value={progress.unansweredCount} tone="rose" />
                  <InfoRow label="Tamamlanma" value={`%${progress.percent}`} />
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>

      {isFinishModalOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-white/15 bg-[#111827]/95 p-6 shadow-[0_28px_90px_-28px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
            <h2 className="text-2xl font-bold">Testi bitirmek istiyor musun?</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">Cevapların kaydedilecek ve sonuç ekranına yönlendirileceksin.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button className="rounded-2xl border border-white/10 bg-white/8 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/12 hover:text-white" type="button" onClick={() => setIsFinishModalOpen(false)}>
                Vazgeç
              </button>
              <button
                className="rounded-2xl border border-rose-300/18 bg-gradient-to-r from-[#8f123a]/75 to-[#5f0826]/60 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_42px_-24px_rgba(194,50,99,0.9)] transition hover:from-[#a91645]/80 hover:to-[#6d0a2d]/70 disabled:opacity-60"
                disabled={isSubmitting}
                type="button"
                onClick={handleFinish}
              >
                {isSubmitting ? "Kaydediliyor..." : "Testi Bitir"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function InfoPill({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm shadow-sm backdrop-blur-xl">
      <Icon aria-hidden className="h-4 w-4 text-teal-200" />
      <div>
        <p className="text-xs text-white/45">{label}</p>
        <p className="font-bold">{value}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/6 px-4 py-3">
      <span>{label}</span>
      <span className="font-semibold text-white/86">{value}</span>
    </div>
  );
}

function ProgressRow({ icon: Icon, label, value, tone }: { icon: typeof CheckCircle2; label: string; value: number; tone: "teal" | "amber" | "rose" }) {
  const colorClass = { teal: "text-teal-200", amber: "text-amber-200", rose: "text-rose-200" }[tone];
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/6 px-4 py-3 text-white/72">
      <span className="inline-flex items-center gap-2">
        <Icon className={`h-4 w-4 ${colorClass}`} />
        {label}
      </span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "teal" | "amber" | "rose" }) {
  const toneClass = {
    teal: "border-teal-200/15 bg-teal-400/16 text-teal-100",
    amber: "border-amber-300/15 bg-amber-400/14 text-amber-100",
    rose: "border-rose-300/15 bg-[#8f123a]/35 text-rose-100",
  }[tone];
  return <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold ${toneClass}`}>{children}</span>;
}
