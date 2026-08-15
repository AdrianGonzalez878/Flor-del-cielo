"use client";

import { motion } from "framer-motion";

const benefits = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="none"/>
        <path d="M17 8C15.9 5.5 13.1 4 10 4.5 7.2 5 5 7.3 4.2 10 3.5 12.4 4.2 15 6 16.7L7 21h10l1-4.3C19.5 15 19.7 11 17 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
        <path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "100% Naturales",
    desc: "Ingredientes seleccionados sin químicos agresivos",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Hecho a mano",
    desc: "Cada pieza elaborada con cuidado artesanal",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 8.7 8.7 0 0 1-4-.95L4 20l1.2-4.3A8.2 8.2 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9.5 9.5c.6 2.4 2.6 4.4 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Pedido acompañado",
    desc: "Confirmamos cada pedido contigo por WhatsApp",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 8h14M5 8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2M5 8V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 13v4M10 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Envío gratis desde $700",
    desc: "$99 a todo México o recolección en Oaxaca capital",
  },
] as const;

export function BenefitsStrip() {
  return (
    <div className="border-b border-brand-gold/20 bg-brand-cream">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-brand-gold/15 divide-y divide-brand-gold/15 lg:grid-cols-4 lg:divide-y-0">
        {benefits.map((b, i) => (
          <motion.li
            key={b.title}
            initial={{ y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            className="flex items-center gap-4 px-6 py-5"
          >
            <span className="shrink-0 text-brand-gold-dark">{b.icon}</span>
            <div>
              <p className="text-sm font-semibold text-brand-brown">{b.title}</p>
              <p className="mt-0.5 text-xs leading-snug text-brand-brown-muted">
                {b.desc}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
