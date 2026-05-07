import { notFound } from "next/navigation";

import { StudentPanelFrame, StudentPanelHeader } from "@/components/student-panel-frame";
import { getStudentById } from "@/features/student-portal/queries";
import { requireStudentSession } from "@/lib/student-session";

export default async function StudentSettingsPage() {
  const sessionStudent = await requireStudentSession();
  const student = await getStudentById(sessionStudent.id);

  if (!student) {
    notFound();
  }

  return (
    <StudentPanelFrame activeHref="/student/settings" studentName={student.fullName}>
      <StudentPanelHeader title="Ayarlar" subtitle="Profil bilgilerini görüntüle. Düzenleme yakında aktif olacak." />
      <section className="mt-6 grid gap-5">
        <section className="rounded-3xl border border-white/10 bg-white/[0.075] p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)]">
          <h2 className="text-lg font-bold">Profil Bilgileri</h2>
          <div className="mt-5 grid gap-4 text-sm">
            <InfoRow label="Ad Soyad" value={student.fullName} />
            <InfoRow label="E-posta" value={student.email} />
            <InfoRow label="Sınıf Seviyesi" value={student.gradeLevel} />
            {student.schoolName ? <InfoRow label="Okul" value={student.schoolName} /> : null}
            {student.phone ? <InfoRow label="Telefon" value={student.phone} /> : null}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.075] p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)]">
          <h2 className="text-lg font-bold">Güvenlik ve Tercihler</h2>
          <p className="mt-2 text-sm text-white/58">
            Şifre değiştirme, bildirim tercihleri ve panel kişiselleştirme seçenekleri yakında aktif olacak.
          </p>
        </section>
      </section>
    </StudentPanelFrame>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[150px_1fr] sm:items-center">
      <span className="text-sm font-semibold text-white/72">{label}</span>
      <div className="rounded-2xl border border-white/12 bg-white/[0.055] px-4 py-3 text-sm text-white/82">{value}</div>
    </div>
  );
}
