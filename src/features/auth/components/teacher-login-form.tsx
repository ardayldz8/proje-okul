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
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          E-posta
        </label>
        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none ring-teal-700 transition focus:ring-2"
          id="email"
          name="email"
          placeholder="hoca@example.com"
          type="email"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          Sifre
        </label>
        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none ring-teal-700 transition focus:ring-2"
          id="password"
          name="password"
          placeholder="Sifreniz"
          type="password"
          required
        />
      </div>

      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <button className="w-full rounded-full bg-indigo-950 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} type="submit">
        {isPending ? "Giris yapiliyor..." : "Giris Yap"}
      </button>
    </form>
  );
}
