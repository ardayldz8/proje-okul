type AdvertisementProps = {
  placement: "home" | "course-list" | "result";
};

const content = {
  home: {
    title: "Egitim sponsor alani",
    description: "Yayina hazirlik surecinde bu alan statik reklam veya duyuru icin ayrildi.",
  },
  "course-list": {
    title: "Ders kaynaklari alani",
    description: "Ogrencilerin ders secimi sirasinda gorecegi statik reklam veya kaynak duyurusu.",
  },
  result: {
    title: "Sonuc sonrasi oneriler",
    description: "Test sonucundan sonra kaynak, kampanya veya duyuru gostermek icin ayrilan alan.",
  },
};

export function Advertisement({ placement }: AdvertisementProps) {
  const item = content[placement];

  return (
    <aside className="rounded-3xl border border-dashed border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">Reklam</p>
      <h2 className="mt-3 text-xl font-bold text-slate-950">{item.title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
    </aside>
  );
}
