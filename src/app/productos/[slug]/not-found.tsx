import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function ProductoNotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-semibold text-brand-brown">
          Producto no encontrado
        </h1>
        <p className="mt-3 text-brand-brown-muted">
          Ese producto no existe o no está disponible.
        </p>
        <Link
          href="/productos"
          className="mt-8 inline-flex rounded-full bg-brand-brown px-6 py-3 text-sm font-semibold text-brand-cream-light hover:bg-brand-brown-dark"
        >
          Ver catálogo
        </Link>
      </main>
      <Footer />
    </>
  );
}
