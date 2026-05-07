import { notFound } from "next/navigation";

import { StudentEmptyState, StudentPanelFrame, StudentPanelHeader } from "@/components/student-panel-frame";
import { getStudentWrongQuestionsData } from "@/features/student-portal/queries";
import { requireStudentSession } from "@/lib/student-session";

export default async function WrongQuestionsPage() {
  const sessionStudent = await requireStudentSession();
  const data = await getStudentWrongQuestionsData(sessionStudent.id);

  if (!data.student) {
    notFound();
  }

  return (
    <StudentPanelFrame activeHref="/student/wrong-questions" studentName={data.student.fullName}>
      <StudentPanelHeader title="Yanlış Sorularım" subtitle="Yanlış yaptığın soruları tekrar incele ve öğren." />
      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {data.questions.length > 0 ? data.questions.map((question) => (
          <article key={question.id} className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            <Badge>Yanlış Soru</Badge>
            <h2 className="mt-4 font-bold leading-6">{question.preview}</h2>
            <div className="mt-4 space-y-2 text-sm"><p className="text-teal-200">Doğru cevap: {question.correct}</p><p className="text-rose-200">Senin cevabın: {question.yours}</p><p className="rounded-2xl border border-white/10 bg-white/6 p-3 text-white/58">{question.explanation}</p></div>
          </article>
        )) : <StudentEmptyState title="Yanlış soru yok" text="Tamamlanmış testlerinde yanlış cevaplanan soru bulunamadı." />}
      </section>
    </StudentPanelFrame>
  );
}

function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-lg border border-teal-200/15 bg-teal-400/16 px-2.5 py-1 text-[10px] font-semibold text-teal-100">{children}</span>; }
