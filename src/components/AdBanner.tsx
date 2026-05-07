import { ArrowRight, Sparkles } from "lucide-react";

type AdPlacement = "student-dashboard" | "course-selection" | "results";

type AdBannerProps = {
  placement: AdPlacement;
};

const adContent: Record<AdPlacement, { title: string; description: string; action: string; tone: string }> = {
  "student-dashboard": {
    title: "Haftalık çalışma desteği",
    description: "Sana uygun kaynak önerileri ve deneme planları için ayrılmış sponsorlu alan.",
    action: "Kaynakları keşfet",
    tone: "from-teal-400/14 via-white/[0.07] to-[#8f123a]/12 text-teal-100 border-teal-200/16",
  },
  "course-selection": {
    title: "Ders seçimine yardımcı kaynaklar",
    description: "Seçtiğin sınıf seviyesine uygun konu tekrarları ve mini denemeler burada öne çıkarılır.",
    action: "Önerileri gör",
    tone: "from-[#8f123a]/18 via-white/[0.07] to-teal-400/12 text-rose-100 border-white/14",
  },
  results: {
    title: "Sonuçlarına göre öneriler",
    description: "Tamamladığın testlerden sonra eksik kazanımlara yönelik sponsorlu çalışma önerileri.",
    action: "Planı incele",
    tone: "from-teal-400/12 via-white/[0.07] to-cyan-400/10 text-cyan-100 border-teal-200/16",
  },
};

export function AdBanner({ placement }: AdBannerProps) {
  const content = adContent[placement];

  return (
    <aside className={`rounded-xl border bg-gradient-to-r p-4 shadow-[0_18px_56px_-36px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-5 ${content.tone}`} aria-label="Sponsorlu alan">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <Sparkles aria-hidden className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <div>
            <span className="inline-flex rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/58">
              Sponsorlu
            </span>
            <h2 className="mt-2 text-base font-bold text-white sm:text-lg">{content.title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-white/60">{content.description}</p>
          </div>
        </div>
        <button className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white/74 transition hover:border-white/20 hover:bg-white/12 hover:text-white" type="button">
          {content.action}
          <ArrowRight aria-hidden className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>
    </aside>
  );
}
