import { requireTeacher } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function TeacherStudentsPage() {
  await requireTeacher();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <section className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-950">Tanimli Ogrenciler</h1>
        <p className="mt-4 text-slate-600">Hocaya tanimli ogrenci listesi burada yer alacak.</p>
      </section>
    </main>
  );
}
