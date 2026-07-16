import Link from "next/link";

export function StudioSetup() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-6 py-16">
      <div className="max-w-lg rounded-2xl border border-brand-gold/30 bg-brand-cream-light p-8 shadow-lg shadow-brand-brown/10">
        <p className="font-script text-2xl text-brand-gold-dark">
          Sanity Studio
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-brand-brown">
          Falta configurar el proyecto
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-brown-muted">
          Crea el archivo{" "}
          <code className="rounded bg-brand-cream px-1.5 py-0.5 text-brand-brown">
            .env.local
          </code>{" "}
          con tu Project ID de Sanity y reinicia el servidor (
          <code className="rounded bg-brand-cream px-1.5 py-0.5">npm run dev</code>
          ).
        </p>

        <pre className="mt-6 overflow-x-auto rounded-xl bg-brand-brown p-4 text-xs leading-relaxed text-brand-cream-light">
{`NEXT_PUBLIC_SANITY_PROJECT_ID="tu-id"
NEXT_PUBLIC_SANITY_DATASET="production"`}
        </pre>

        <p className="mt-4 text-xs text-brand-brown-muted">
          El ID está en{" "}
          <a
            href="https://www.sanity.io/manage"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-gold-dark underline"
          >
            sanity.io/manage
          </a>{" "}
          → tu proyecto → Settings.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex text-sm font-semibold text-brand-brown hover:underline"
        >
          ← Volver al sitio
        </Link>
      </div>
    </div>
  );
}
