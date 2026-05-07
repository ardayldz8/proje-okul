// UI preview mode – database disabled temporarily
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { ArrowLeft, ArrowRight, BookOpenCheck, GraduationCap } from "lucide-react";

type DemoCourse = {
  id: string;
  slug: string;
  title: string;
  description: string;
  testCount: number;
};

// UI preview: selected grade will come from authenticated student profile.
const selectedGrade = "7. Sınıf";

const demoCourses: DemoCourse[] = [
  {
    id: "ortaokul-matematik",
    slug: "matematik",
    title: "Matematik",
    description: "Temel işlemler, problemler ve sayısal düşünme pratiği.",
    testCount: 42,
  },
  {
    id: "ortaokul-turkce",
    slug: "turkce",
    title: "Türkçe",
    description: "Dil bilgisi, paragraf ve okuduğunu anlama testleri.",
    testCount: 38,
  },
  {
    id: "ortaokul-fen-bilimleri",
    slug: "fen-bilimleri",
    title: "Fen Bilimleri",
    description: "Doğa, canlılar ve temel bilim konularını pekiştir.",
    testCount: 35,
  },
  {
    id: "ortaokul-sosyal-bilgiler",
    slug: "sosyal-bilgiler",
    title: "Sosyal Bilgiler",
    description: "Tarih, coğrafya ve vatandaşlık kazanımlarını tekrar et.",
    testCount: 26,
  },
  {
    id: "ortaokul-ingilizce",
    slug: "ingilizce",
    title: "İngilizce",
    description: "Kelime, gramer ve okuma becerilerini güçlendir.",
    testCount: 30,
  },
  {
    id: "ortaokul-din-kulturu",
    slug: "din-kulturu",
    title: "Din Kültürü",
    description: "Kavramları öğren, bilgini kısa testlerle ölç.",
    testCount: 18,
  },
];

export default function OnlineTestPage() {
  const courses = demoCourses;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#120813] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(147,31,65,0.42),transparent_32%),radial-gradient(circle_at_86%_64%,rgba(13,148,136,0.46),transparent_38%),linear-gradient(135deg,#260718_0%,#321020_44%,#062c31_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:56px_56px] opacity-20" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-8 top-14 grid grid-cols-8 gap-3 opacity-20">
          {Array.from({ length: 48 }).map((_, index) => (
            <span key={index} className="h-1 w-1 rounded-full bg-white" />
          ))}
        </div>
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-[45%_55%_58%_42%] border border-white/10 bg-white/5 sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-[60%_40%_45%_55%] border border-teal-200/15 bg-teal-200/8 sm:h-[30rem] sm:w-[30rem]" />
        <div className="absolute bottom-10 right-10 grid grid-cols-9 gap-2 opacity-15">
          {Array.from({ length: 54 }).map((_, index) => (
            <span key={index} className="h-1 w-1 rounded-full bg-teal-100" />
          ))}
        </div>
      </div>

      <section className="relative z-10 mx-auto max-w-6xl space-y-7">
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 shadow-sm backdrop-blur-xl transition hover:border-teal-200/35 hover:bg-white/15 hover:text-white"
          href="/"
        >
          <ArrowLeft aria-hidden className="h-4 w-4" strokeWidth={2} />
          Ana Sayfaya Dön
        </Link>

        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-400/10 text-teal-200 shadow-[0_0_32px_-10px_rgba(45,212,191,0.95)] ring-1 ring-teal-200/25">
            <GraduationCap aria-hidden className="h-7 w-7" strokeWidth={1.7} />
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">Ders Seçimi</h1>
          <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">
            Sınıf seviyene uygun derslerden birini seçerek teste başlayabilirsin.
          </p>
          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-teal-300 to-teal-500" />
        </div>

        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/20 bg-white/10 px-5 py-3 text-sm font-semibold text-teal-100 shadow-[0_18px_48px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            <GraduationCap aria-hidden className="h-4 w-4" strokeWidth={1.8} />
            {selectedGrade} için dersler gösteriliyor
          </div>
        </div>

        <AdBanner placement="course-selection" />

        {courses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.id}
                className="group flex min-h-[13.5rem] flex-col rounded-3xl border border-white/12 bg-white/8 p-5 shadow-[0_18px_54px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-teal-200/35 hover:bg-white/12 hover:shadow-[0_24px_64px_-28px_rgba(20,184,166,0.55)]"
                href={`/online-test/${course.slug}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400/20 to-teal-500/10 text-teal-100 ring-1 ring-teal-200/20 transition group-hover:scale-105">
                    <BookOpenCheck aria-hidden className="h-7 w-7" strokeWidth={1.65} />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold text-white/65">
                    {course.testCount} aktif test
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-bold tracking-tight text-white">{course.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/62">{course.description}</p>

                <div className="mt-auto flex items-center justify-between pt-6">
                  <span className="text-sm font-semibold text-white">Dersi Seç</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-[0_12px_28px_-14px_rgba(20,184,166,0.95)] transition group-hover:translate-x-1">
                    <ArrowRight aria-hidden className="h-4 w-4" strokeWidth={2} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/12 bg-white/8 p-6 shadow-[0_18px_54px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/8 text-white/70 ring-1 ring-white/12">
                <BookOpenCheck aria-hidden className="h-7 w-7" strokeWidth={1.6} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Henüz ders bulunmuyor</h2>
                <p className="mt-2 text-sm leading-6 text-white/62">Sistemde aktif ders bulunamadı.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center pb-3">
          <Link
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-center text-sm text-white/75 shadow-[0_18px_48px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:border-teal-200/35 hover:bg-white/14 hover:text-white sm:px-7"
            href="/iletisim"
          >
            <span>
              Aradığın dersi bulamadın mı? <span className="font-semibold text-teal-200">İletişim</span> sayfasından bize ulaşabilirsin.
            </span>
            <ArrowRight aria-hidden className="h-4 w-4 shrink-0" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </main>
  );
}
