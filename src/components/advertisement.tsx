type AdvertisementProps = {
  placement: "home" | "course-list" | "result";
};

const content = {
  home: {
    label: "Duyuru",
    title: "Yayina hazirlik alani",
    description: "Sponsor, kaynak onerisi veya okul duyurulari icin ayrilan premium gorunumlu alan.",
  },
  "course-list": {
    label: "Reklam",
    title: "Ders kaynaklari alani",
    description: "Ogrencilerin ders secimi sirasinda gorecegi statik reklam veya kaynak duyurusu.",
  },
  result: {
    label: "Reklam",
    title: "Sonuc sonrasi oneriler",
    description: "Test sonucundan sonra kaynak, kampanya veya duyuru gostermek icin ayrilan alan.",
  },
};

export function Advertisement({ placement }: AdvertisementProps) {
  const item = content[placement];

  return (
    <aside className="overflow-hidden rounded-3xl border border-teal-200/20 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-1 shadow-sm">
      <div className="rounded-[1.35rem] border border-white/80 bg-white/82 p-6">
        <p className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-teal-800">{item.label}</p>
        <h2 className="mt-4 text-xl font-bold text-slate-950">{item.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
      </div>
    </aside>
  );
}
