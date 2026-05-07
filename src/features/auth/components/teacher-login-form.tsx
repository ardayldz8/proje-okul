"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { teacherLoginSchema } from "@/features/auth/schemas";

export function TeacherLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    const formData = new FormData(event.currentTarget);
    const parsed = teacherLoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Form bilgilerini kontrol edin.");
      return;
    }

    setIsPending(true);

    const result = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    setIsPending(false);

    if (result?.error) {
      setError("E-posta veya sifre hatali.");
      return;
    }

    router.push("/teacher/dashboard");
    router.refresh();
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/80" htmlFor="email">
          E-posta
        </label>
        <input
          className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3.5 text-white outline-none transition placeholder:text-white/35 focus:border-rose-300/45 focus:bg-white/14 focus:ring-2 focus:ring-rose-300/20"
          id="email"
          name="email"
          placeholder="hoca@example.com"
          type="email"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white/80" htmlFor="password">
          Şifre
        </label>
        <input
          className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3.5 text-white outline-none transition placeholder:text-white/35 focus:border-rose-300/45 focus:bg-white/14 focus:ring-2 focus:ring-rose-300/20"
          id="password"
          name="password"
          placeholder="Şifreni gir"
          type="password"
          required
        />
      </div>

      {error ? <p className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}

      <button className="w-full rounded-xl bg-gradient-to-r from-[#8f123a] to-[#5f0826] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_-16px_rgba(132,21,57,0.95)] transition hover:from-[#a91645] hover:to-[#6d0a2d] disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} type="submit">
        {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  );
}
