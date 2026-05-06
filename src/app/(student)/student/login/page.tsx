import { redirect } from "next/navigation";

import { StudentLoginForm } from "@/features/student-portal/components/student-login-form";
import { getCurrentStudentSession } from "@/lib/student-session";

type StudentLoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function StudentLoginPage({ searchParams }: StudentLoginPageProps) {
  const student = await getCurrentStudentSession();
  const { next } = await searchParams;

  if (student) {
    redirect(next || "/student/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-8">
      <section className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-[#190715] via-slate-900 to-[#05272c] p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Ogrenci Girisi</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight">Normal ogrenci girisi</h1>
          <p className="mt-4 text-sm leading-7 text-white/72">Hesabin varsa giris yap, yoksa kayit ol. Test secimi ve gecmis takibi ogrenci dashboard uzerinden de surdurulebilir.</p>
        </div>
        <div className="p-8">
          <StudentLoginForm next={next} />
        </div>
      </section>
    </main>
  );
}
