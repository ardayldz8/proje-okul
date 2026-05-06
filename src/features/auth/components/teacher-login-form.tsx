"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, type FormEvent } from "react";

import { registerTeacherAccount } from "@/features/auth/actions";
import { teacherLoginSchema, type TeacherAuthState } from "@/features/auth/schemas";

const initialAuthState: TeacherAuthState = {};

export function TeacherLoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginError, setLoginError] = useState<string>();
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [isAutoLoginPending, setIsAutoLoginPending] = useState(false);
  const [registerAttempt, setRegisterAttempt] = useState<{ email: string; password: string } | null>(null);
  const [registerState, registerAction, isRegisterPending] = useActionState(registerTeacherAccount, initialAuthState);

  useEffect(() => {
    if (!registerState.success || !registerAttempt) {
      return;
    }

    const attempt = registerAttempt;
    let isCancelled = false;

    async function completeAutoLogin() {
      setIsAutoLoginPending(true);

      const result = await signIn("credentials", {
        email: attempt.email,
        password: attempt.password,
        redirect: false,
      });

      if (isCancelled) {
        return;
      }

      setIsAutoLoginPending(false);

      if (result?.error) {
        setMode("login");
        setLoginError("Hesap olusturuldu ancak otomatik giris basarisiz oldu. Lutfen giris yapin.");
        return;
      }

      router.push("/teacher/dashboard");
      router.refresh();
    }

    void completeAutoLogin();

    return () => {
      isCancelled = true;
    };
  }, [registerAttempt, registerState.success, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (mode === "register") {
      setLoginError(undefined);

      const formData = new FormData(event.currentTarget);
      setRegisterAttempt({
        email: String(formData.get("email") ?? "").trim().toLowerCase(),
        password: String(formData.get("password") ?? ""),
      });
      return;
    }

    event.preventDefault();
    setLoginError(undefined);

    const formData = new FormData(event.currentTarget);
    const parsed = teacherLoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      setLoginError(parsed.error.issues[0]?.message ?? "Form bilgilerini kontrol edin.");
      return;
    }

    setIsLoginPending(true);

    const result = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    setIsLoginPending(false);

    if (result?.error) {
      setLoginError("E-posta veya sifre hatali.");
      return;
    }

    router.push("/teacher/dashboard");
    router.refresh();
  }

  const activeError = mode === "login" ? loginError : registerState.error;
  const isPending = mode === "login" ? isLoginPending : isRegisterPending || isAutoLoginPending;

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 rounded-[1.25rem] bg-slate-100 p-1.5">
        <button className={`rounded-[1rem] px-4 py-3 text-sm font-bold transition ${mode === "login" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`} onClick={() => setMode("login")} type="button">
          Giris Yap
        </button>
        <button className={`rounded-[1rem] px-4 py-3 text-sm font-bold transition ${mode === "register" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`} onClick={() => setMode("register")} type="button">
          Kaydol
        </button>
      </div>

      {mode === "register" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
            Ad soyad
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none ring-teal-700 transition focus:ring-2"
            id="fullName"
            name="fullName"
            placeholder="Adiniz soyadiniz"
            required={mode === "register"}
            type="text"
          />
        </div>
      ) : null}

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
          placeholder={mode === "login" ? "Sifreniz" : "En az 8 karakter"}
          type="password"
          required
        />
      </div>

      {activeError ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{activeError}</p> : null}

      <button className="w-full rounded-full bg-indigo-950 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} formAction={mode === "register" ? registerAction : undefined} type="submit">
        {mode === "login" ? (isLoginPending ? "Giris yapiliyor..." : "Giris Yap") : isPending ? "Hesap olusturuluyor..." : "Kaydol"}
      </button>

      <p className="text-center text-sm text-slate-500">
        {mode === "login" ? "Hesabin varsa giris yapip hoca paneline gec." : "Yeni hoca hesabi olusturdugunda paneline otomatik yonlendirilirsin."}
      </p>
    </form>
  );
}
