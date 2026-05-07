import { notFound } from "next/navigation";

import { StudentEmptyState, StudentPanelFrame, StudentPanelHeader } from "@/components/student-panel-frame";
import { getStudentMissingTopicsData } from "@/features/student-portal/queries";
import { requireStudentSession } from "@/lib/student-session";

export default async function MissingTopicsPage() {
  const sessionStudent = await requireStudentSession();
  const data = await getStudentMissingTopicsData(sessionStudent.id);

  if (!data.student) {
    notFound();
  }

  return (
    <StudentPanelFrame activeHref="/student/missing-topics" studentName={data.student.fullName}>
      <StudentPanelHeader title="Eksik Konularım" subtitle="Tamamladığın testlerde yanlış yaptığın konulara göre oluşturuldu." />
      <section className="mt-6 space-y-4">
        {data.topics.length > 0 ? data.topics.map((topic) => (
          <article key={`${topic.course}-${topic.title}`} className="grid gap-4 rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl md:grid-cols-[1fr_130px] md:items-center">
            <div><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-bold">{topic.title}</h2><Badge>{topic.course}</Badge><span className="text-sm text-white/50">{topic.count} yanlış</span></div><div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-teal-300" style={{ width: `${topic.missing}%` }} /></div></div>
            <span className="rounded-2xl border border-white/10 bg-white/7 px-4 py-3 text-center text-sm font-semibold text-white/62">Çalışma modu yakında</span>
          </article>
        )) : <StudentEmptyState title="Eksik konu yok" text="Tamamlanmış testlerinde yanlış cevaplanan konu bulunamadı." />}
      </section>
    </StudentPanelFrame>
  );
}

function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-lg border border-teal-200/15 bg-teal-400/16 px-2.5 py-1 text-[10px] font-semibold text-teal-100">{children}</span>; }
