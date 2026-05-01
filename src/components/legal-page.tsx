import Link from "next/link";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: Array<{ title: string; body: string }>;
};

export function LegalPage({ eyebrow, title, description, sections }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <article className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <Link className="text-sm font-semibold text-teal-700" href="/">
          Ana sayfaya don
        </Link>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">{title}</h1>
        <p className="mt-4 leading-7 text-slate-600">{description}</p>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl bg-slate-50 p-5">
              <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
