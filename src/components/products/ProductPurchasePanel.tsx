"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ContentEntrance } from "@/components/motion/ContentEntrance";
import { brand } from "@/lib/brand";
import { useCart } from "@/components/cart/CartProvider";
import { buildCatalogUrl } from "@/lib/catalog-url";
import { getCollectionLabel } from "@/sanity/collections";
import { getHairNeedLabel, getSkinNeedLabel } from "@/sanity/needs";

type Props = {
  name: string;
  slug: string;
  categoryName?: string;
  categorySlug?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  weight?: string;
  stock: number;
  collections?: string[];
  skinNeeds?: string[];
  hairNeeds?: string[];
  ingredients?: string[];
  imageUrl?: string;
  imageAlt?: string;
};

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-brand-gold/25">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between py-5 text-left text-base font-semibold text-brand-brown sm:text-lg"
        aria-expanded={open}
      >
        {title}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className={`shrink-0 text-brand-brown-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-base leading-relaxed text-brand-brown-muted">
          {children}
        </div>
      )}
    </div>
  );
}

export function ProductPurchasePanel({
  name,
  slug,
  categoryName,
  categorySlug,
  shortDescription,
  price,
  compareAtPrice,
  weight,
  stock,
  collections = [],
  skinNeeds = [],
  hairNeeds = [],
  ingredients = [],
  imageUrl,
  imageAlt,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem, items } = useCart();
  const router = useRouter();
  const safeCollections = collections ?? [];
  const safeSkinNeeds = skinNeeds ?? [];
  const safeHairNeeds = hairNeeds ?? [];
  const safeIngredients = ingredients ?? [];
  const inStock = stock > 0;
  const quantityInCart = items.find((item) => item._id === slug)?.quantity ?? 0;
  const availableToAdd = Math.max(stock - quantityInCart, 0);
  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  const shareUrl = `${brand.siteUrl.replace(/\/$/, "")}/productos/${slug}`;
  const shareText = `Mira este producto de Flor del Cielo: ${name}\n${shareUrl}`;
  /** Sin número: abre WhatsApp para que el usuario elija a quién compartir */
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const addSelectedQuantity = () => {
    if (!inStock || availableToAdd < 1) return false;

    const quantityToAdd = Math.min(quantity, availableToAdd);
    addItem(
      {
        _id: slug,
        name,
        slug,
        price,
        imageUrl,
        imageAlt,
        stock,
      },
      quantityToAdd,
    );
    setAddedToCart(true);
    return true;
  };

  return (
    <div key={slug} className="flex flex-col">
      <ContentEntrance key={`${slug}-heading`} replayKey={slug}>
        {categoryName && (
          <p className="text-sm text-brand-brown-muted">
            {categorySlug ? (
              <Link
                href={buildCatalogUrl({ categoria: categorySlug })}
                className="hover:text-brand-brown hover:underline"
              >
                {categoryName}
              </Link>
            ) : (
              categoryName
            )}
          </p>
        )}

        <h1 className="mt-2 font-serif text-2xl font-semibold leading-snug text-brand-brown sm:text-3xl lg:text-[2rem]">
          {name}
        </h1>
      </ContentEntrance>

      {/* Precio */}
      <ContentEntrance key={`${slug}-price`} replayKey={slug} delay={0.06}>
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          {compareAtPrice && compareAtPrice > price && (
            <span className="price-number text-base text-brand-brown-muted line-through">
              ${compareAtPrice.toLocaleString("es-MX")}
            </span>
          )}
          <span className="price-number text-3xl text-brand-gold-dark">
            ${price.toLocaleString("es-MX")}
          </span>
          {discount > 0 && (
            <span className="rounded bg-brand-gold px-2 py-0.5 text-xs font-bold text-brand-brown-dark">
              {discount}% OFF
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-brand-brown-muted">
          MXN · IVA incluido
        </p>
      </ContentEntrance>

      {/* CTAs */}
      <ContentEntrance
        key={`${slug}-actions`}
        replayKey={slug}
        delay={0.12}
        className="mt-6 space-y-3"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-brand-brown">Cantidad</p>
          <div className="inline-flex items-center rounded-full border border-brand-gold/40 bg-brand-cream">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              disabled={!inStock || quantity <= 1}
              className="flex h-10 w-10 items-center justify-center text-brand-brown transition-colors hover:bg-brand-cream-light disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="w-9 text-center text-sm font-semibold text-brand-brown">
              {inStock ? quantity : 0}
            </span>
            <button
              type="button"
              onClick={() =>
                setQuantity((current) => Math.min(current + 1, availableToAdd))
              }
              disabled={!inStock || quantity >= availableToAdd}
              className="flex h-10 w-10 items-center justify-center text-brand-brown transition-colors hover:bg-brand-cream-light disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>
        <p className="text-sm text-brand-brown-muted">
          {inStock
            ? `${stock} ${stock === 1 ? "unidad disponible" : "unidades disponibles"}`
            : "Agotado temporalmente"}
        </p>
        <button
          type="button"
          onClick={addSelectedQuantity}
          disabled={!inStock || availableToAdd < 1}
          className="inline-flex h-12 w-full items-center justify-center rounded-md border border-brand-brown/40 bg-transparent text-sm font-bold tracking-wide text-brand-brown transition-colors hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-50"
        >
          Agregar al carrito
        </button>
        <button
          type="button"
          onClick={() => {
            if (addSelectedQuantity()) router.push("/checkout");
          }}
          disabled={!inStock || availableToAdd < 1}
          className="inline-flex h-12 w-full items-center justify-center rounded-md bg-brand-gold text-sm font-bold tracking-wide text-brand-brown-dark transition-colors hover:bg-brand-gold-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          Comprar ahora
        </button>
        {addedToCart && (
          <p className="text-center text-sm font-medium text-brand-gold-dark">
            Producto agregado. Puedes seguir comprando o revisar tu carrito.
          </p>
        )}
        <p className="text-center text-sm leading-relaxed text-brand-brown-muted">
          En el checkout podrás elegir envío a domicilio o recoger en un punto
          de entrega.
        </p>
      </ContentEntrance>

      {/* Acordeones */}
      <ContentEntrance
        key={`${slug}-details`}
        replayKey={slug}
        delay={0.18}
        className="mt-8"
      >
        {shortDescription && (
          <Accordion title="Descripción">
            <p>{shortDescription}</p>
            {weight && (
              <p className="mt-3">
                <span className="font-medium text-brand-brown">Presentación:</span>{" "}
                {weight}
              </p>
            )}
          </Accordion>
        )}

        {safeIngredients.length > 0 && (
          <Accordion title="Ingredientes">
            <ul className="flex flex-wrap gap-2">
              {safeIngredients.map((ingredient) => (
                <li
                  key={ingredient}
                  className="rounded-full border border-brand-gold/30 bg-brand-cream px-3.5 py-1.5 text-sm text-brand-brown"
                >
                  {ingredient}
                </li>
              ))}
            </ul>
          </Accordion>
        )}

        {(safeCollections.length > 0 ||
          safeSkinNeeds.length > 0 ||
          safeHairNeeds.length > 0) && (
          <Accordion title="Ideal para">
            <div className="flex flex-wrap gap-2">
              {safeCollections.map((col) => (
                <Link
                  key={col}
                  href={buildCatalogUrl({ coleccion: col })}
                  className="rounded-full border border-brand-gold/30 px-3.5 py-1.5 text-sm text-brand-brown hover:bg-brand-cream"
                >
                  {getCollectionLabel(col)}
                </Link>
              ))}
              {safeSkinNeeds.map((need) => (
                <Link
                  key={need}
                  href={buildCatalogUrl({ piel: need })}
                  className="rounded-full border border-brand-gold/30 px-3.5 py-1.5 text-sm text-brand-brown hover:bg-brand-cream"
                >
                  {getSkinNeedLabel(need)}
                </Link>
              ))}
              {safeHairNeeds.map((need) => (
                <Link
                  key={need}
                  href={buildCatalogUrl({ cabello: need })}
                  className="rounded-full border border-brand-gold/30 px-3.5 py-1.5 text-sm text-brand-brown hover:bg-brand-cream"
                >
                  {getHairNeedLabel(need)}
                </Link>
              ))}
            </div>
          </Accordion>
        )}

        <Accordion title="Información de compra">
          <ul className="list-disc space-y-1.5 pl-4">
            <li>Envíos a todo México con empaque cuidadoso.</li>
            <li>Productos elaborados a mano en lotes pequeños.</li>
            <li>
              Por ahora puedes pedir por WhatsApp; el carrito con Mercado Pago
              estará disponible pronto.
            </li>
          </ul>
        </Accordion>
      </ContentEntrance>

      {/* Stock */}
      <ContentEntrance key={`${slug}-stock`} replayKey={slug} delay={0.24}>
        <p
          className={`mt-5 text-sm font-medium ${
            inStock ? "text-brand-gold-dark" : "text-brand-brown-muted"
          }`}
        >
          {inStock
            ? stock <= 3
              ? `Últimas ${stock} ${stock === 1 ? "unidad disponible" : "unidades disponibles"}`
              : `${stock} unidades disponibles`
            : "Agotado temporalmente"}
        </p>
      </ContentEntrance>

      {/* Compartir */}
      <ContentEntrance
        key={`${slug}-share`}
        replayKey={slug}
        delay={0.3}
        className="mt-7"
      >
        <div className="flex flex-wrap items-center gap-3.5">
          <span className="text-base font-semibold text-brand-brown">
            Compartir
          </span>
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Compartir por WhatsApp"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-105"
          >
            <WhatsAppIcon />
          </a>
          <a
            href={facebookShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Compartir en Facebook"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white transition-transform hover:scale-105"
          >
            <FacebookIcon />
          </a>
          <button
            type="button"
            onClick={copyLink}
            aria-label="Copiar enlace"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-cream text-brand-brown transition-transform hover:scale-105"
          >
            <LinkIcon />
          </button>
          {copied && (
            <span className="text-sm font-medium text-brand-gold-dark">
              Enlace copiado
            </span>
          )}
        </div>
      </ContentEntrance>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 13a5 5 0 007.54.54l1.46-1.46a5 5 0 00-7.07-7.07L10.5 6.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 00-7.54-.54L4.99 11.93a5 5 0 007.07 7.07L13.5 17.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

