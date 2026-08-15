"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** Dirección desde la que entra el elemento */
  from?: Direction;
  /** Usa `li` cuando el contenedor es una lista, para no romper el HTML. */
  as?: "div" | "li";
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.55,
  from = "up",
  as = "div",
}: Props) {
  const Tag = as === "li" ? motion.li : motion.div;

  return (
    <Tag
      initial={false}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        delay,
        duration,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className={className}
      data-reveal-from={from}
    >
      {children}
    </Tag>
  );
}
