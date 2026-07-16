"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import {
  getQuizQuestion,
  getQuizResult,
  QUIZ_TOTAL_STEPS,
  type QuizAnswers,
  type QuizFocus,
  type QuizResult,
  type QuizStepId,
} from "@/lib/product-quiz";
import { getSanityImageUrl, isSanityImageUrl } from "@/lib/sanity-image";
import type { Product } from "@/sanity/queries";

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export function ProductQuiz({ products }: { products: Product[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const currentQuestion = getQuizQuestion(step, answers, products);
  const isComplete = step >= QUIZ_TOTAL_STEPS;

  function selectOption(questionId: QuizStepId, optionId: string) {
    const nextAnswers: QuizAnswers =
      questionId === "focus"
        ? { focus: optionId as QuizFocus }
        : { ...answers, [questionId]: optionId };
    setAnswers(nextAnswers);

    if (step < QUIZ_TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      setResult(getQuizResult(nextAnswers, products));
      setStep(QUIZ_TOTAL_STEPS);
    }
  }

  function goBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  function restart() {
    setAnswers({});
    setResult(null);
    setStep(0);
  }

  return (
    <div className="relative mx-auto mt-10 max-w-4xl text-left">
      {!isComplete && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-medium text-brand-brown-muted">
            <span>
              Pregunta {step + 1} de {QUIZ_TOTAL_STEPS}
            </span>
            <span>
              {Math.round(((step + 1) / QUIZ_TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-gold/20">
            <motion.div
              className="h-full rounded-full bg-brand-gold"
              initial={false}
              animate={{
                width: `${((step + 1) / QUIZ_TOTAL_STEPS) * 100}%`,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      <AnimatePresence initial={false} mode="sync">
        {!isComplete && currentQuestion ? (
          <motion.div
            key={currentQuestion.id}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="font-serif text-xl font-semibold text-brand-brown sm:text-2xl">
              {currentQuestion.title}
            </h3>
            <p className="mt-2 text-sm text-brand-brown-muted">
              {currentQuestion.subtitle}
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option) => {
                const selected = answers[currentQuestion.id] === option.id;
                return (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() =>
                        selectOption(currentQuestion.id, option.id)
                      }
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${
                        selected
                          ? "border-brand-gold bg-brand-gold-light/40 shadow-md shadow-brand-brown/10"
                          : "border-brand-gold/25 bg-brand-cream hover:border-brand-gold/50 hover:bg-brand-gold-light/20"
                      }`}
                    >
                      <span className="block font-semibold text-brand-brown">
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="mt-1 block text-xs text-brand-brown-muted">
                          {option.description}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="mt-6 text-sm font-medium text-brand-gold-dark transition-colors hover:text-brand-brown"
              >
                ← Anterior
              </button>
            )}
          </motion.div>
        ) : result ? (
          <motion.div
            key="result"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-brand-gold/30 bg-brand-cream p-6 sm:p-8"
          >
            <p className="font-script text-2xl text-brand-gold-dark">
              Tu resultado
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold text-brand-brown sm:text-3xl">
              {result.title}
            </h3>
            <p className="mt-4 leading-relaxed text-brand-brown-muted">
              {result.description}
            </p>

            {result.products.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {result.products.map((product) => (
                  <li key={product._id}>
                    <Link
                      href={`/productos/${product.slug}`}
                      className="group flex h-full overflow-hidden rounded-2xl border border-brand-gold/25 bg-brand-cream-light transition-all hover:border-brand-gold hover:shadow-md hover:shadow-brand-brown/10 sm:flex-col"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-brand-gold-light/20 sm:h-36 sm:w-full">
                        {product.mainImage?.url ? (
                          <Image
                            src={getSanityImageUrl(product.mainImage.url, 440)}
                            alt={product.mainImage.alt ?? product.name}
                            fill
                            sizes="(max-width: 640px) 96px, 220px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized={isSanityImageUrl(product.mainImage.url)}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-brand-brown-muted">
                            Sin foto
                          </div>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center p-3 sm:p-4">
                        {product.category && (
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">
                            {product.category.name}
                          </p>
                        )}
                        <h4 className="mt-1 line-clamp-2 font-serif text-sm font-semibold text-brand-brown sm:text-base">
                          {product.name}
                        </h4>
                        <p className="price-number mt-2 text-sm text-brand-brown">
                          ${product.price} MXN
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-4 rounded-xl border border-brand-gold/25 bg-brand-gold-light/30 px-4 py-3 text-sm text-brand-brown">
              <span className="font-semibold text-brand-brown-dark">Tip: </span>
              {result.tip}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={result.catalogUrl}
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand-brown px-8 text-sm font-semibold text-brand-cream-light transition-colors hover:bg-brand-brown-dark"
              >
                Ver productos recomendados
              </Link>
              <button
                type="button"
                onClick={restart}
                className="inline-flex h-12 items-center justify-center rounded-full border border-brand-gold/40 px-8 text-sm font-semibold text-brand-brown transition-colors hover:bg-brand-gold-light/25"
              >
                Hacer el test de nuevo
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!isComplete && step === 0 && (
        <p className="mt-8 text-center text-xs text-brand-brown-muted">
          3 preguntas rápidas · Sin registro · Resultados del catálogo real
        </p>
      )}

      {isComplete && (
        <p className="mt-6 text-center">
          <Link
            href="/productos"
            className="text-sm text-brand-gold-dark underline-offset-2 hover:text-brand-brown hover:underline"
          >
            O ver todo el catálogo
          </Link>
        </p>
      )}
    </div>
  );
}
