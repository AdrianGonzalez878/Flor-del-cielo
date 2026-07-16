import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PickupPointsContent } from "@/components/pickup/PickupPointsContent";
import { getPickupPoints } from "@/sanity/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Puntos de entrega",
  description:
    "Puntos de recolección en Oaxaca capital para recoger tu pedido de Flor del Cielo.",
};

export default async function PickupPointsPage() {
  const points = await getPickupPoints();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-cream">
        <PickupPointsContent points={points} />
      </main>
      <Footer />
    </>
  );
}
