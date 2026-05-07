"use client";

import { useActionState } from "react";
import { AlertTriangle, Lock, Save, User } from "lucide-react";

import { updateTeacherPassword, updateTeacherProfile } from "@/features/teacher-settings/actions";
import { TeacherPanelHeader } from "@/components/teacher-panel-frame";

export function SettingsClient({ profile }: { profile: { fullName: string; email: string } }) {
  const [profileState, profileAction, profilePending] = useActionState(updateTeacherProfile, {});
  const [passwordState, passwordAction, passwordPending] = useActionState(updateTeacherPassword, {});

  return (
    <>
      <TeacherPanelHeader title="Ayarlar" subtitle="Koç profilini, hesap tercihlerini ve panel ayarlarını yönet." />

      <div className="mt-7 grid gap-5 xl:grid-cols-2">
        <section className="rounded-3xl border border-rose-300/18 bg-white/[0.105] p-5 shadow-[0_28px_80px_-42px_rgba(194,50,99,0.9)]">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#c23263]/42 to-[#5f0826]/24 text-rose-50 ring-1 ring-white/10">
              <User aria-hidden className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold">Profil Bilgileri</h2>
              <p className="mt-1.5 text-sm leading-6 text-white/58">Koç panelinde görünen temel profil bilgilerini güncelleyin.</p>
            </div>
          </div>
          <form action={profileAction} className="mt-5 space-y-4">
            <Field label="Ad Soyad" name="fullName" defaultValue={profile.fullName} required />
            <Field label="E-posta" name="email" type="email" defaultValue={profile.email} required />
            {profileState.error ? <p className="text-sm text-red-300">{profileState.error}</p> : null}
            {profileState.message ? <p className="text-sm text-teal-300">{profileState.message}</p> : null}
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-300/24 bg-gradient-to-r from-[#c23263]/74 to-[#5f0826]/68 px-5 py-3.5 text-sm font-bold text-white shadow-[0_20px_48px_-24px_rgba(194,50,99,0.95)] transition active:scale-[0.99] disabled:opacity-50"
              type="submit"
              disabled={profilePending}
            >
              <Save aria-hidden className="h-4 w-4" />
              {profilePending ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-red-300/20 bg-red-950/20 p-5 shadow-[0_28px_80px_-44px_rgba(248,113,113,0.9)]">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-red-400/30 to-[#8f123a]/28 text-red-100 ring-1 ring-white/10">
              <Lock aria-hidden className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold">Güvenlik</h2>
              <p className="mt-1.5 text-sm leading-6 text-white/58">Şifre değişiklikleri hassas işlem olarak ayrıştırıldı.</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-amber-300/18 bg-amber-400/10 p-4">
            <div className="flex gap-3">
              <AlertTriangle aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
              <p className="text-sm leading-6 text-amber-50/78">Koç hesabı sınıf ve test yönetimi içerdiği için güçlü parola kullanmanız önerilir.</p>
            </div>
          </div>
          <form action={passwordAction} className="mt-5 space-y-4">
            <Field label="Mevcut şifre" name="currentPassword" placeholder="Mevcut şifrenizi giriniz" type="password" required />
            <Field label="Yeni şifre" name="newPassword" placeholder="Yeni şifrenizi giriniz" type="password" required />
            <Field label="Yeni şifre tekrar" name="newPasswordConfirm" placeholder="Yeni şifrenizi tekrar giriniz" type="password" required />
            {passwordState.error ? <p className="text-sm text-red-300">{passwordState.error}</p> : null}
            {passwordState.message ? <p className="text-sm text-teal-300">{passwordState.message}</p> : null}
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-300/24 bg-gradient-to-r from-red-500/56 to-[#8f123a]/62 px-5 py-3.5 text-sm font-bold text-white shadow-[0_20px_48px_-24px_rgba(248,113,113,0.95)] transition active:scale-[0.99] disabled:opacity-50"
              type="submit"
              disabled={passwordPending}
            >
              <Lock aria-hidden className="h-4 w-4" />
              {passwordPending ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}

function Field({ label, name, defaultValue = "", placeholder, type = "text", required }: { label: string; name: string; defaultValue?: string; placeholder?: string; type?: string; required?: boolean }) {
  const focusClass = type === "password" ? "focus:border-red-200/55 focus:ring-red-300/18" : "focus:border-rose-200/55 focus:ring-rose-300/18";

  return (
    <label className="grid gap-2 text-sm font-semibold text-white/72 sm:grid-cols-[150px_1fr] sm:items-center">
      <span>{label}</span>
      <input
        className={`w-full rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-white/42 hover:border-white/22 focus:ring-2 ${focusClass}`}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        type={type}
        required={required}
      />
    </label>
  );
}
