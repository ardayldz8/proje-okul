"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, CalendarDays, ClipboardList, Clock, Edit3, Eye, FileText, MoreVertical, Plus, Search, UserPlus } from "lucide-react";
import { TestStatus } from "@prisma/client";

import { deleteTest, updateTestStatus } from "@/features/test-builder/actions";
import { TeacherPanelHeader } from "@/components/teacher-panel-frame";

type Course = { id: string; title: string };

type TestItem = {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number | null;
  status: TestStatus;
  createdAt: Date;
  courseId: string;
  course: { title: string };
  _count: { testQuestions: number; attempts: number };
};

const statusLabels: Record<TestStatus, string> = {
  [TestStatus.DRAFT]: "Taslak",
  [TestStatus.ACTIVE]: "Aktif",
  [TestStatus.ARCHIVED]: "Pasif",
};

export function TestsClient({ courses, tests }: { courses: Course[]; tests: TestItem[] }) {
  const router = useRouter();
  const [courseFilter, setCourseFilter] = useState("Tümü");
  const [statusFilter, setStatusFilter] = useState("Tümü");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);
  const [assignTest, setAssignTest] = useState<TestItem | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const filteredTests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("tr-TR");
    return tests
      .filter((t) => courseFilter === "Tümü" || t.course.title === courseFilter)
      .filter((t) => statusFilter === "Tümü" || statusLabels[t.status] === statusFilter)
      .filter((t) => !normalizedSearch || t.title.toLocaleLowerCase("tr-TR").includes(normalizedSearch));
  }, [courseFilter, tests, searchTerm, statusFilter]);

  function showToast(message: string) {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 2600);
  }

  async function updateStatus(testId: string, status: TestStatus) {
    const formData = new FormData();
    formData.set("testId", testId);
    formData.set("status", status);
    try {
      await updateTestStatus(formData);
      showToast("Test durumu güncellendi.");
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "İşlem başarısız oldu.";
      showToast(message);
    }
    setOpenMenuId(null);
  }

  async function handleDelete(testId: string) {
    const formData = new FormData();
    formData.set("testId", testId);
    try {
      await deleteTest(formData);
      showToast("Test silindi.");
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "İşlem başarısız oldu.";
      showToast(message);
    }
    setOpenMenuId(null);
  }

  const totalTests = tests.length;
  const activeTests = tests.filter((t) => t.status === TestStatus.ACTIVE).length;
  const draftTests = tests.filter((t) => t.status === TestStatus.DRAFT).length;
  const thisMonth = tests.filter((t) => {
    const now = new Date();
    return t.createdAt.getMonth() === now.getMonth() && t.createdAt.getFullYear() === now.getFullYear();
  }).length;

  return (
    <>
      <TeacherPanelHeader title="Testler" subtitle="Oluşturduğun testleri yönet, düzenle ve öğrencilerine ata." />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <FilterSelect label="Ders" value={courseFilter} onChange={setCourseFilter} options={["Tümü", ...courses.map((c) => c.title)]} />
          <FilterSelect label="Durum" value={statusFilter} onChange={setStatusFilter} options={["Tümü", "Taslak", "Aktif", "Pasif"]} />
          <label className="block space-y-2 text-sm font-medium text-white/62">
            <span>Arama</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
              <input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35" placeholder="Test adı ara..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
              <Search aria-hidden className="h-4 w-4 text-white/45" />
            </div>
          </label>
        </div>
        <Link className="inline-flex items-center gap-2 rounded-2xl border border-rose-300/18 bg-gradient-to-r from-[#8f123a]/70 to-[#5f0826]/55 px-5 py-3 text-sm font-semibold shadow-[0_16px_42px_-24px_rgba(194,50,99,0.9)] transition hover:from-[#a91645]/75 hover:to-[#6d0a2d]/65" href="/teacher/tests/create">
          <Plus aria-hidden className="h-4 w-4" />
          Yeni Test
        </Link>
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {filteredTests.map((test) => (
          <TestCard
            key={test.id}
            test={test}
            isMenuOpen={openMenuId === test.id}
            onPreview={() => setSelectedTest(test)}
            onAssign={() => setAssignTest(test)}
            onMenuToggle={() => setOpenMenuId(openMenuId === test.id ? null : test.id)}
            onActivate={() => updateStatus(test.id, TestStatus.ACTIVE)}
            onArchive={() => updateStatus(test.id, TestStatus.ARCHIVED)}
            onDelete={() => handleDelete(test.id)}
          />
        ))}
        {filteredTests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/14 bg-white/6 p-8 text-center text-sm text-white/55 lg:col-span-2 2xl:col-span-3">
            Bu filtrelere uygun test bulunamadı.
          </div>
        ) : null}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <BottomStat icon={ClipboardList} label="Toplam Test" value={totalTests.toString()} description="Oluşturulan tüm testler" tone="teal" />
        <BottomStat icon={BarChart3} label="Aktif Test" value={activeTests.toString()} description="Aktif olarak kullanılan testler" tone="green" />
        <BottomStat icon={FileText} label="Taslak Test" value={draftTests.toString()} description="Tamamlanmamış test taslakları" tone="orange" />
        <BottomStat icon={CalendarDays} label="Bu Ay Oluşturulan" value={thisMonth.toString()} description="Bu ay oluşturulan testler" tone="rose" />
      </section>

      {selectedTest ? <PreviewModal test={selectedTest} onClose={() => setSelectedTest(null)} /> : null}
      {assignTest ? <AssignModal test={assignTest} onClose={() => setAssignTest(null)} onAssign={() => { setAssignTest(null); showToast("Sınıf atama yakında aktif olacak."); }} /> : null}
      {toastMessage ? (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-teal-200/20 bg-[#0f2528]/90 px-5 py-3 text-sm font-semibold text-teal-100 shadow-[0_18px_56px_-28px_rgba(20,184,166,0.85)] backdrop-blur-xl">
          {toastMessage}
        </div>
      ) : null}
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

function TestCard({ test, isMenuOpen, onPreview, onAssign, onMenuToggle, onActivate, onArchive, onDelete }: { test: TestItem; isMenuOpen: boolean; onPreview: () => void; onAssign: () => void; onMenuToggle: () => void; onActivate: () => void; onArchive: () => void; onDelete: () => void }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/11">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-white/92">{test.title}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="rose">{test.course.title}</Badge>
            <StatusBadge status={test.status} />
          </div>
        </div>
        <div className="relative">
          <button className="text-white/50 transition hover:text-white" type="button" onClick={onMenuToggle}>
            <MoreVertical aria-hidden className="h-5 w-5" />
          </button>
          {isMenuOpen ? (
            <div className="absolute right-0 top-7 z-20 w-36 overflow-hidden rounded-2xl border border-white/12 bg-[#19101d]/95 p-1.5 shadow-[0_18px_56px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl">
              <MenuButton onClick={onActivate}>Aktif Yap</MenuButton>
              <MenuButton onClick={onArchive}>Pasif Yap</MenuButton>
              <MenuButton onClick={onDelete}>Sil</MenuButton>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-2 text-sm text-white/58">
        <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4" /> {test._count.testQuestions} soru</span>
        <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> {test.durationMinutes ? `${test.durationMinutes} dk` : "Süresiz"}</span>
        <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {new Date(test.createdAt).toLocaleDateString("tr-TR")}</span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_1fr_1fr_auto] gap-2 border-t border-white/8 pt-4">
        <Link className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold text-white/72 transition hover:bg-white/12 hover:text-white" href={`/teacher/tests/${test.id}`}>
          <Edit3 className="h-3.5 w-3.5" /> Düzenle
        </Link>
        <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold text-white/72 transition hover:bg-white/12 hover:text-white" type="button" onClick={onPreview}>
          <Eye className="h-3.5 w-3.5" /> Önizle
        </button>
        <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-teal-200/15 bg-teal-400/12 px-3 py-2 text-xs font-semibold text-teal-100 transition hover:bg-teal-400/18" type="button" onClick={onAssign}>
          <UserPlus className="h-3.5 w-3.5" /> Sınıfa Ata
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/8 text-white/55" type="button" onClick={onMenuToggle}>
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function PreviewModal({ test, onClose }: { test: TestItem; onClose: () => void }) {
  return (
    <ModalShell onClose={onClose}>
      <h2 className="text-2xl font-bold">Önizleme</h2>
      <p className="mt-3 font-semibold text-white/85">{test.title}</p>
      <div className="mt-5 space-y-2 text-sm text-white/68">
        <p>Ders: {test.course.title}</p>
        <p>Soru sayısı: {test._count.testQuestions}</p>
        <p>Süre: {test.durationMinutes ? `${test.durationMinutes} dk` : "Süresiz"}</p>
        <p>Durum: {statusLabels[test.status]}</p>
      </div>
    </ModalShell>
  );
}

function AssignModal({ test, onClose, onAssign }: { test: TestItem; onClose: () => void; onAssign: () => void }) {
  return (
    <ModalShell onClose={onClose}>
      <h2 className="text-2xl font-bold">Testi Sınıfa Ata</h2>
      <p className="mt-2 text-sm text-white/55">{test.title}</p>
      <p className="mt-4 text-sm text-white/55">Sınıf atama özelliği yakında aktif olacak.</p>
      <button className="mt-6 w-full rounded-2xl border border-rose-300/18 bg-gradient-to-r from-[#8f123a]/75 to-[#5f0826]/60 px-5 py-3 text-sm font-semibold text-white" type="button" onClick={onAssign}>
        Kapat
      </button>
    </ModalShell>
  );
}

function ModalShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/15 bg-[#140b18]/95 p-6 shadow-[0_28px_90px_-28px_rgba(0,0,0,0.95)] backdrop-blur-2xl sm:p-8">
        <div className="flex justify-end">
          <button className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/8 text-white/70" type="button" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function BottomStat({ icon: Icon, label, value, description, tone }: { icon: typeof ClipboardList; label: string; value: string; description: string; tone: "teal" | "green" | "orange" | "rose" }) {
  const toneClass = {
    teal: "from-teal-500/30 to-cyan-500/10 text-teal-200",
    green: "from-emerald-500/30 to-emerald-500/10 text-emerald-200",
    orange: "from-orange-500/30 to-orange-500/10 text-orange-200",
    rose: "from-[#c23263]/35 to-[#5f0826]/20 text-rose-100",
  }[tone];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_18px_56px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${toneClass} ring-1 ring-white/10`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-white/55">{label}</p>
          <p className="mt-0.5 text-2xl font-bold">{value}</p>
          <p className="text-xs text-white/45">{description}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: TestStatus }) {
  const tone = status === TestStatus.ACTIVE ? "green" : status === TestStatus.ARCHIVED ? "red" : "muted";
  return <Badge tone={tone}>{statusLabels[status]}</Badge>;
}

function MenuButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button className="block w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-white/70 transition hover:bg-white/8 hover:text-white" type="button" onClick={onClick}>
      {children}
    </button>
  );
}

function Badge({ children, tone }: { children: ReactNode; tone: "rose" | "teal" | "green" | "amber" | "red" | "muted" }) {
  const toneClass = {
    rose: "border-rose-300/15 bg-[#8f123a]/35 text-rose-100",
    teal: "border-teal-200/15 bg-teal-400/16 text-teal-100",
    green: "border-emerald-300/15 bg-emerald-400/14 text-emerald-100",
    amber: "border-amber-300/15 bg-amber-400/14 text-amber-100",
    red: "border-red-300/15 bg-red-500/14 text-red-100",
    muted: "border-white/10 bg-white/8 text-white/55",
  }[tone];

  return <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold ${toneClass}`}>{children}</span>;
}
