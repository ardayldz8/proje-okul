import { TeacherLoginForm } from "@/features/auth/components/teacher-login-form";

export default function TeacherLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-8">
      <section className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-[#190715] via-slate-900 to-[#05272c] p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-100/80">Hoca Girisi</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight">Hoca paneline giris yap</h1>
          <p className="mt-4 text-sm leading-7 text-white/72">Hesabin varsa giris yap, yoksa ayni ekrandan kaydol. Soru, test, ogrenci ve sonuc akislarini dashboard uzerinden yonet.</p>
        </div>
        <div className="p-8">
          <TeacherLoginForm />
        </div>
      </section>
    </main>
  );
}
