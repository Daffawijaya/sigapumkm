"use client";
import { useActionState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          placeholder="nama@instansi.go.id"
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="password">
          Kata sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>
      {state?.error && (
        <p
          role="alert"
          className="rounded-md bg-rose-50 p-3 text-sm text-rose-700"
        >
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="w-full rounded-md bg-[#176b57] px-4 py-2.5 font-medium text-white disabled:opacity-60"
      >
        {pending ? "Memeriksa akun…" : "Masuk ke SIGAPUMKM"}
      </button>
    </form>
  );
}
