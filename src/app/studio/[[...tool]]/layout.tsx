import type { Metadata, Viewport } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Sanity Studio · Flor del Cielo",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
