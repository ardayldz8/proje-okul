import { TeacherLoginForm } from "@/features/auth/components/teacher-login-form";

export default function TeacherLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-8">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Hoca Girisi</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Panele giris yap</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">Admin tarafindan tanimlanan hoca hesabi ile giris yapin.</p>
        <TeacherLoginForm />
      </section>
    </main>
  );
}
