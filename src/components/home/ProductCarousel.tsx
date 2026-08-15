"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/sanity/queries";

/** Con pocos productos el carrusel deja huecos; se muestran centrados. */
const shortListColumns: Record<number, string> = {
  1: "max-w-[220px] grid-cols-1 sm:max-w-[300px]",
  2: "max-w-md grid-cols-2 sm:max-w-xl",
  3: "max-w-md grid-cols-2 sm:max-w-3xl sm:grid-cols-3",
};

export function ProductCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [thumbSize, setThumbSize] = useState(100);
  const dragRef = useRef<{ startX: number; startScroll: number } | null>(null);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const nextMaxScroll = Math.max(track.scrollWidth - track.clientWidth, 0);
    setScrollPosition(track.scrollLeft);
    setMaxScroll(nextMaxScroll);
    setThumbSize(
      Math.max((track.clientWidth / track.scrollWidth) * 100, 12),
    );
    setCanGoBack(track.scrollLeft > 4);
    setCanGoForward(track.scrollLeft < nextMaxScroll - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(updateControls);
    observer.observe(track);
    return () => observer.disconnect();
  }, [updateControls]);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.8, 280),
      behavior: "smooth",
    });
  };

  const startDragging = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startScroll: trackRef.current?.scrollLeft ?? 0,
    };
  };

  const drag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const initial = dragRef.current;
    const track = trackRef.current;
    const scrollbar = event.currentTarget.parentElement;
    if (!initial || !track || !scrollbar) return;

    const usableWidth = scrollbar.clientWidth * (1 - thumbSize / 100);
    if (usableWidth <= 0) return;
    const nextScroll =
      initial.startScroll +
      ((event.clientX - initial.startX) / usableWidth) * maxScroll;
    track.scrollTo({ left: Math.max(0, Math.min(nextScroll, maxScroll)) });
  };

  const stopDragging = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  const shortList = shortListColumns[products.length];
  if (shortList) {
    return (
      <ul
        className={`mx-auto mt-10 grid gap-3 sm:gap-5 ${shortList}`}
        aria-label="Productos destacados"
      >
        {products.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </ul>
    );
  }

  return (
    <div className="relative mt-10">
      <ul
        ref={trackRef}
        onScroll={updateControls}
        className="grid grid-flow-col auto-cols-[36vw] gap-3 overflow-x-auto pb-4 [scrollbar-width:none] sm:auto-cols-[calc((100vw-4.25rem)/2)] sm:gap-5 lg:auto-cols-[calc((100vw-5.5rem)/3)] xl:auto-cols-[320px] [&::-webkit-scrollbar]:hidden"
        aria-label="Carrusel de productos"
      >
        {products.slice(0, 12).map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </ul>

      {maxScroll > 0 && (
        <div className="relative mx-auto mt-4 h-1 max-w-xs rounded-full bg-brand-brown/10 sm:mt-5 sm:h-1.5 sm:max-w-md">
          <button
            type="button"
            aria-label="Arrastrar para desplazar productos"
            onPointerDown={startDragging}
            onPointerMove={drag}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            className="absolute inset-y-0 cursor-grab touch-none rounded-full bg-brand-brown/40 transition-colors hover:bg-brand-brown/60 active:cursor-grabbing"
            style={{
              width: `${thumbSize}%`,
              left: `${
                maxScroll > 0
                  ? (Math.min(scrollPosition, maxScroll) / maxScroll) *
                    (100 - thumbSize)
                  : 0
              }%`,
            }}
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => move(-1)}
        disabled={!canGoBack}
        aria-label="Ver productos anteriores"
        className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream-light text-xl text-brand-brown shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:flex"
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        disabled={!canGoForward}
        aria-label="Ver más productos"
        className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream-light text-xl text-brand-brown shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:flex"
      >
        →
      </button>
    </div>
  );
}
