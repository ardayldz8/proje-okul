"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Download, Trophy, Users } from "lucide-react";

import { TeacherPanelHeader } from "@/components/teacher-panel-frame";

type ResultItem = {
  id: string;
  studentName: string;
  gradeLevel: string;
  testTitle: string;
  courseTitle: string;
  score: number | null;
  correctCount: number;
  wrongCount: number;
  emptyCount: number;
  completedAt: Date | null;
};

export function ResultsClient({ results }: { results: ResultItem[] }) {
  const [studentFilter, setStudentFilter] = useState("Tümü");
  const [courseFilter, setCourseFilter] = useState("Tümü");
  const [testFilter, setTestFilter] = useState("Tümü");

  const students = useMemo(() => Array.from(new Set(results.map((r) => r.studentName))), [results]);
  const courses = useMemo(() => Array.from(new Set(results.map((r) => r.courseTitle))), [results]);
  const tests = useMemo(() => Array.from(new Set(results.map((r) => r.testTitle))), [results]);

  const filtered = useMemo(() => {
    return results
      .filter((r) => studentFilter === "Tümü" || r.studentName === studentFilter)
      .filter((r) => courseFilter === "Tümü" || r.courseTitle === courseFilter)
      .filter((r) => testFilter === "Tümü" || r.testTitle === testFilter);
  }, [courseFilter, results, studentFilter, testFilter]);

  const scores = results.map((r) => r.score ?? 0);
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const minScore = scores.length > 0 ? Math.min(...scores) : 0;
  const maxStudent = results.find((r) => (r.score ?? 0) === maxScore)?.studentName ?? "-";
  const minStudent = results.find((r) => (r.score ?? 0) === minScore)?.studentName ?? "-";

  const courseAverages = (() => {
    const map = new Map<string, number[]>();
    results.forEach((r) => {
      const arr = map.get(r.courseTitle) ?? [];
      arr.push(r.score ?? 0);
      map.set(r.courseTitle, arr);
    });
    return Array.from(map.entries()).map(([label, vals]) => ({
      label,
      value: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
    }));
  })();

  return (
    <>
      <TeacherPanelHeader title="Sonuçlar & Raporlar" subtitle="Öğrenci performansını analiz et, sonuçları ve raporları tek ekrandan takip et." />

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <TopStat icon={BookOpen} label="Ortalama Puan" value={averageScore.toString()} suffix="" tone="rose" />
        <TopStat icon={Trophy} label="En Yüksek" value={maxScore.toString()} suffix={maxStudent} tone="teal" />
        <TopStat icon={Download} label="En Düşük" value={minScore.toString()} suffix={minStudent} tone="orange" />
        <TopStat icon={Users} label="Katılım" value={results.length.toString()} suffix="deneme" tone="blue" />
      </section>

      {courseAverages.length > 0 ? (
        <section className="mt-4 rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <h2 className="font-bold">Ders Bazlı Başarı</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courseAverages.map((course) => (
              <div key={course.label} className="rounded-2xl border border-white/10 bg-white/7 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/82">{course.label}</span>
                  <span className="text-sm font-bold text-teal-300">{course.value}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600" style={{ width: `${Math.min(course.value, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-4 rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <div className="grid gap-3 md:grid-cols-4">
          <FilterSelect label="Öğrenci Seç" value={studentFilter} onChange={setStudentFilter} options={["Tümü", ...students]} />
          <FilterSelect label="Ders Seç" value={courseFilter} onChange={setCourseFilter} options={["Tümü", ...courses]} />
          <FilterSelect label="Test Seç" value={testFilter} onChange={setTestFilter} options={["Tümü", ...tests]} />
          <button
            className="self-end rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/12 hover:text-white"
            type="button"
            onClick={() => {
              setStudentFilter("Tümü");
              setCourseFilter("Tümü");
              setTestFilter("Tümü");
            }}
          >
            Filtreleri Temizle
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead className="text-xs text-white/45">
              <tr className="border-b border-white/10">
                <th className="py-3 font-semibold">Öğrenci</th>
                <th className="py-3 font-semibold">Test</th>
                <th className="py-3 font-semibold">Ders</th>
                <th className="py-3 font-semibold">Puan</th>
                <th className="py-3 font-semibold">Doğru / Yanlış / Boş</th>
                <th className="py-3 font-semibold">Tarih</th>
                <th className="py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-sm text-white/55">
                    Sonuç bulunamadı.
                  </td>
                </tr>
              ) : (
                filtered.map((result) => (
                  <tr key={result.id} className="border-b border-white/8 text-white/74 transition hover:bg-white/6">
                    <td className="py-3">
                      <span className="inline-flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#8f123a] to-[#5f0826] text-xs font-bold">
                          {result.studentName
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((p) => p[0]?.toUpperCase())
                            .join("")}
                        </span>
                        {result.studentName}
                      </span>
                    </td>
                    <td className="py-3">{result.testTitle}</td>
                    <td className="py-3">
                      <span className="rounded-lg border border-teal-200/15 bg-teal-400/16 px-2.5 py-1 text-[10px] font-semibold text-teal-100">{result.courseTitle}</span>
                    </td>
                    <td className={`py-3 font-bold ${(result.score ?? 0) >= 75 ? "text-teal-300" : (result.score ?? 0) >= 60 ? "text-amber-300" : "text-rose-300"}`}>{result.score ?? 0}</td>
                    <td className="py-3">
                      {result.correctCount} / {result.wrongCount} / {result.emptyCount}
                    </td>
                    <td className="py-3">{result.completedAt ? new Date(result.completedAt).toLocaleDateString("tr-TR") : "-"}</td>
                    <td className="py-3 text-right">
                      <Link className="text-xs font-semibold text-white/70 transition hover:text-white" href={`/teacher/results/${result.id}`}>
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block space-y-2 text-sm font-medium text-white/62">
      <span>{label}</span>
      <select className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option className="bg-[#140814]" key={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TopStat({ icon: Icon, label, value, suffix, tone }: { icon: typeof BookOpen; label: string; value: string; suffix: string; tone: "rose" | "teal" | "orange" | "blue" }) {
  const toneClass = {
    rose: "from-[#c23263]/35 to-[#5f0826]/20 text-rose-100",
    teal: "from-teal-500/30 to-cyan-500/10 text-teal-200",
    orange: "from-orange-500/30 to-orange-500/10 text-orange-200",
    blue: "from-blue-500/30 to-blue-500/10 text-blue-200",
  }[tone];
  return (
    <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
      <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${toneClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-4 text-sm text-white/60">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs text-white/45">{suffix}</p>
    </div>
  );
}
