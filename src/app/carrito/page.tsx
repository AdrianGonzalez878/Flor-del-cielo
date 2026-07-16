import type { Metadata } from "next";

import { CartPageContent } from "@/components/cart/CartPageContent";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Revisa los productos que deseas pedir.",
};

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-cream py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-8 text-center sm:mb-10">
            <p className="font-script text-3xl text-brand-gold-dark">
              Tu selección artesanal
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-brand-brown sm:text-4xl">
              Carrito
            </h1>
          </Reveal>
          <CartPageContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
