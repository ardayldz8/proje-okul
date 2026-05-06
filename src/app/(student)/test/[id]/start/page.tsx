import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { StudentStartForm } from "@/features/student-test/components/student-start-form";
import { getStudentTestStartData } from "@/features/student-portal/queries";
import { getCurrentStudentSession } from "@/lib/student-session";

export const dynamic = "force-dynamic";

type TestStartPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TestStartPage({ params }: TestStartPageProps) {
  const { id } = await params;
  const student = await getCurrentStudentSession();

  if (!student) {
    redirect(`/student/login?next=${encodeURIComponent(`/test/${id}/start`)}`);
  }

  const { test, teachers } = await getStudentTestStartData(student.id, id);

  if (!test) {
    notFound();
  }

  return (
    <main className="bg-slate-50 px-5 py-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#190715] via-slate-900 to-[#05272c] p-8 text-white md:p-10">
            <Link className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/88 transition hover:bg-white/15" href={`/online-test/${test.course.slug}`}>
              Test listesine don
            </Link>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Test Baslangici</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{test.title}</h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">{test.description ?? `${test.course.title} dersi icin test baslangic bilgileri.`}</p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 md:p-8">
            <SummaryCard label="Ders" value={test.course.title} />
            <SummaryCard label="Soru" value={test._count.testQuestions.toString()} />
            <SummaryCard label="Sure" value={test.durationMinutes ? `${test.durationMinutes} dk` : "Suresiz"} />
            <SummaryCard label="Sonuc" value={test.showResultImmediately ? "Aninda" : "Sonra"} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Baslat</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Kayitli hesabinla basla</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Kayitli ogrenci bilgilerin otomatik dolduruldu. Yasal onaylari tamamla ve testi guvenli sekilde baslat.</p>

            <StudentStartForm student={student} teachers={teachers} testId={test.id} />
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Akis</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">3 adimda basla</h2>
              <div className="mt-5 space-y-4">
                <StepCard index="01" title="Hesabinla gir" description="Ogrenci hesabina giris yap. Kayitli degilsen once hesap olustur." />
                <StepCard index="02" title="Onaylarini ver" description="Yasal onay kutularini tamamla ve gerekiyorsa ilgili hocani sec." />
                <StepCard index="03" title="Teste gec" description="Testi baslat. Sonraki adimda sorular ve sure ekranini goreceksin." />
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Notlar</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Test politikasi</h2>
              <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                <p>Sonuc gosterimi: {test.showResultImmediately ? "Test tamamlanir tamamlanmaz sonucunu gorebilirsin." : "Sonucun ogretmenin tarafindan daha sonra paylasilir."}</p>
                <p>Hoca secimi: {teachers.length > 0 ? "Bagli oldugun hocayi secmek opsiyoneldir; backend sadece aktif hocalari kabul eder." : "Su an secilebilir aktif hoca bulunmuyor; test yine baslatilabilir."}</p>
                <p>Guvenlik: Testler yalnizca ogrenci hesabi ile baslatilir; deneme erisimi session ve server-side kontrollerle korunur.</p>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function StepCard({ description, index, title }: { description: string; index: string; title: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Adim {index}</p>
      <h3 className="mt-2 text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
