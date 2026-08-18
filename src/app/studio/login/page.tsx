"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function StudioLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/studio";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/studio/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "No se pudo iniciar sesión.");
      }
      router.replace(nextPath.startsWith("/studio") ? nextPath : "/studio");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-brand-gold/30 bg-brand-cream-light p-8 shadow-lg shadow-brand-brown/10">
        <p className="font-script text-2xl text-brand-gold-dark">
          Flor del Cielo
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-brand-brown">
          Acceso al Studio
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-brand-brown-muted">
          Ingresa tus credenciales para administrar productos y pedidos.
        </p>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-brand-brown">
            Usuario
            <input
              required
              name="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-brand-gold/35 bg-brand-cream px-3.5 text-base font-normal outline-none focus:border-brand-gold sm:h-11 sm:text-sm"
            />
          </label>
          <label className="block text-sm font-semibold text-brand-brown">
            Contraseña
            <input
              required
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-brand-gold/35 bg-brand-cream px-3.5 text-base font-normal outline-none focus:border-brand-gold sm:h-11 sm:text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-brown text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark disabled:opacity-70"
          >
            {loading ? "Verificando…" : "Entrar al Studio"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 inline-flex text-sm font-semibold text-brand-gold-dark hover:underline"
        >
          ← Volver al sitio
        </Link>
      </div>
    </div>
  );
}

export default function StudioLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-brand-cream text-brand-brown-muted">
          Cargando…
        </div>
      }
    >
      <StudioLoginForm />
    </Suspense>
  );
}
