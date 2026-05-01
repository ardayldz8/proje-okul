import { requireAdmin } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Admin</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Admin Paneli</h1>
        <p className="mt-4 text-slate-600">Hoca hesaplari, dersler ve hoca-ogrenci eslestirmeleri burada yonetilecek.</p>
      </section>
    </main>
  );
}
