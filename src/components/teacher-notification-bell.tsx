"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export function TeacherNotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/8 transition hover:bg-white/12"
        type="button"
        onClick={() => setIsOpen((v) => !v)}
      >
        <Bell aria-hidden className="h-5 w-5 text-white/75" />
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-14 z-30 w-80 rounded-3xl border border-white/12 bg-[#19101d]/95 p-3 shadow-[0_22px_70px_-28px_rgba(0,0,0,0.95)] backdrop-blur-xl">
          <div className="rounded-2xl px-3 py-3 text-sm text-white/72">Henüz bildirim yok.</div>
        </div>
      ) : null}
    </div>
  );
}
