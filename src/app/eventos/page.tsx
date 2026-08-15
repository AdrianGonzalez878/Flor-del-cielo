import type { Metadata } from "next";

import { EventsContent } from "@/components/events/EventsContent";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Eventos y pedidos personalizados",
  description:
    "Jabones y velas artesanales para baby shower, bodas, bautizos, hoteles y spa. Cotizamos según diseño, cantidad y presentación.",
};

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-cream">
        <EventsContent />
      </main>
      <Footer />
    </>
  );
}
