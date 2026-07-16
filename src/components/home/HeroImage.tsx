"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export function HeroImage() {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 20, mass: 0.8 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);
  const glareX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  // Parallax layers (inner elements move at different rates)
  const innerX = useTransform(x, [-0.5, 0.5], [-10, 10]);
  const innerY = useTransform(y, [-0.5, 0.5], [-10, 10]);
  const deepX = useTransform(x, [-0.5, 0.5], [-20, 20]);
  const deepY = useTransform(y, [-0.5, 0.5], [-20, 20]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex w-full max-w-lg items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      {/* Outer glow ring */}
      <motion.div
        style={{ rotateX, rotateY, x: deepX, y: deepY }}
        className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-brand-gold-light/60 via-brand-cream/40 to-brand-gold/30 blur-xl"
        aria-hidden
      />

      {/* Floating decorative circle — back layer */}
      <motion.div
        style={{ x: deepX, y: deepY }}
        className="absolute -right-6 -top-6 h-28 w-28 rounded-full border border-brand-gold/40 bg-brand-gold-light/30"
        aria-hidden
      />
      <motion.div
        style={{ x: deepX, y: deepY }}
        className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-brand-gold/20"
        aria-hidden
      />

      {/* Main card with 3D tilt */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full overflow-hidden rounded-[2rem] border border-brand-gold/30 bg-brand-cream-light/90 shadow-2xl shadow-brand-brown/20"
      >
        {/* Glare overlay */}
        <motion.div
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.18) 0%, transparent 65%)`,
            ),
          }}
          className="pointer-events-none absolute inset-0 z-10 rounded-[2rem]"
          aria-hidden
        />

        {/* Hero image — mid layer */}
        <motion.div style={{ x: innerX, y: innerY }} className="relative">
          <Image
            src="/hero.jpg"
            alt="Productos artesanales Flor del Cielo — aceite, jabón, shampoo con almendras, avena, miel y botanicals"
            width={960}
            height={640}
            className="h-auto w-full object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

        {/* Badge — front layer (aparece encima con profundidad) */}
        <motion.div
          style={{ x: deepX, y: deepY, translateZ: 30 }}
          className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-brand-gold/30 bg-white/80 px-4 py-3 backdrop-blur-sm"
        >
          <div>
            <p className="font-serif text-sm font-semibold text-brand-brown">
              Flor del Cielo
            </p>
            <p className="text-xs text-brand-brown-muted">Cosmética artesanal</p>
          </div>
          <span className="rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-semibold text-brand-brown-dark">
            Hecho a mano
          </span>
        </motion.div>
      </motion.div>

      {/* Floating dot decorations — front layer */}
      <motion.div
        style={{ x: innerX, y: innerY }}
        className="absolute -left-3 top-1/3 h-3 w-3 rounded-full bg-brand-gold"
        aria-hidden
      />
      <motion.div
        style={{ x: deepX, y: deepY }}
        className="absolute -right-2 bottom-1/3 h-2 w-2 rounded-full bg-brand-gold-mid"
        aria-hidden
      />
    </div>
  );
}
