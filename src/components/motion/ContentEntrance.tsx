"use client";

import {
  motion,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion";
import { useEffect, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Cambia este valor para repetir la entrada sin depender de un remount. */
  replayKey?: string;
};

/**
 * Entrada segura: el contenido nunca comienza transparente, por lo que sigue
 * disponible aunque un navegador retrase la hidratación o las animaciones.
 */
export function ContentEntrance({
  children,
  className,
  delay = 0,
  replayKey,
}: Props) {
  const shouldReduceMotion = useReducedMotion();
  const controls = useAnimationControls();

  useEffect(() => {
    if (shouldReduceMotion) {
      controls.set({ opacity: 1, y: 0 });
      return;
    }

    controls.set({ opacity: 1, y: 16 });
    void controls.start({
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    });
  }, [controls, delay, replayKey, shouldReduceMotion]);

  return (
    <motion.div
      initial={false}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
}
