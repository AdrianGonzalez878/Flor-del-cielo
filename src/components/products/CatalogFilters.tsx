import Link from "next/link";

import { buildCatalogUrl } from "@/lib/catalog-url";
import { PRODUCT_CATEGORIES } from "@/sanity/categories";
import { PRODUCT_COLLECTIONS } from "@/sanity/collections";
import {
  HAIR_NEEDS,
  SKIN_NEEDS,
  categorySupportsHairNeeds,
  categorySupportsSkinNeeds,
  getHairNeedLabel,
  getSkinNeedLabel,
} from "@/sanity/needs";

type FilterProps = {
  activeCategory?: string;
  activeCollection?: string;
  activeSkinNeed?: string;
  activeHairNeed?: string;
  activeQuery?: string;
  categoryCounts?: Record<string, number>;
  collectionCounts?: Record<string, number>;
  skinNeedCounts?: Record<string, number>;
  hairNeedCounts?: Record<string, number>;
};

const collectionLinks = () => [
  { label: "Todas", value: undefined as string | undefined },
  ...PRODUCT_COLLECTIONS.map((c) => ({ label: c.title, value: c.value })),
];

/** Colecciones — chips horizontales en móvil, barra lateral en desktop. */
export function CollectionSidebar({
  activeCategory,
  activeCollection,
  activeSkinNeed,
  activeHairNeed,
  activeQuery,
  collectionCounts,
}: Pick<
  FilterProps,
  | "activeCategory"
  | "activeCollection"
  | "activeSkinNeed"
  | "activeHairNeed"
  | "activeQuery"
  | "collectionCounts"
>) {
  const links = collectionLinks();

  return (
    <aside className="lg:w-52 lg:shrink-0">
      {/* Móvil: una fila desplazable, poco alto */}
      <div className="lg:hidden">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-brown-muted">
          Colecciones
        </p>
        <nav
          className="-mx-4 mt-2 flex gap-1.5 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Colecciones"
        >
          {links.map(({ label, value }) => (
            <CollectionChip
              key={value ?? "all"}
              href={buildCatalogUrl({
                categoria: activeCategory,
                coleccion: value,
                piel: activeSkinNeed,
                cabello: activeHairNeed,
                q: activeQuery,
              })}
              label={label}
              count={value ? collectionCounts?.[value] : undefined}
              active={value ? activeCollection === value : !activeCollection}
              compact
            />
          ))}
        </nav>
      </div>

      {/* Desktop: lista lateral */}
      <div className="hidden lg:block">
        <p className="font-serif text-sm font-semibold text-brand-brown">
          Colecciones
        </p>
        <p className="mt-1 text-xs text-brand-brown-muted">
          Explora selecciones
        </p>
        <nav className="mt-4 flex flex-col gap-0.5" aria-label="Colecciones">
          {links.map(({ label, value }) => (
            <SidebarLink
              key={value ?? "all"}
              href={buildCatalogUrl({
                categoria: activeCategory,
                coleccion: value,
                piel: activeSkinNeed,
                cabello: activeHairNeed,
                q: activeQuery,
              })}
              label={label}
              count={value ? collectionCounts?.[value] : undefined}
              active={value ? activeCollection === value : !activeCollection}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}

function CollectionChip({
  href,
  label,
  count,
  active,
  compact,
}: {
  href: string;
  label: string;
  count?: number;
  active: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border font-medium transition-colors ${
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      } ${
        active
          ? "border-brand-brown bg-brand-brown text-brand-cream-light"
          : "border-brand-gold/35 bg-brand-cream-light text-brand-brown hover:border-brand-gold"
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={`tabular-nums ${compact ? "text-[10px] opacity-80" : "text-xs"} ${
            active ? "text-brand-cream-light/70" : "text-brand-brown-muted"
          }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}

function SidebarLink({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count?: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-l-2 border-brand-brown bg-brand-gold-light/35 pl-[10px] text-brand-brown"
          : "text-brand-brown hover:bg-brand-gold-light/25"
      }`}
    >
      <span className="flex items-center justify-between gap-2">
        <span>{label}</span>
        {count !== undefined && count > 0 && (
          <span className="text-xs tabular-nums text-brand-brown-muted">
            {count}
          </span>
        )}
      </span>
    </Link>
  );
}

/** Tipo de producto — chips sobre el grid. */
export function CategoryFilters({
  activeCategory,
  activeCollection,
  activeQuery,
  categoryCounts,
}: Pick<
  FilterProps,
  "activeCategory" | "activeCollection" | "activeQuery" | "categoryCounts"
>) {
  const total = categoryCounts
    ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
    : undefined;

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-brown-muted">
        Tipo de producto
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        <FilterChip
          href={buildCatalogUrl({
            coleccion: activeCollection,
            q: activeQuery,
          })}
          label="Todos"
          count={total}
          active={!activeCategory}
        />
        {PRODUCT_CATEGORIES.map((cat) => (
          <FilterChip
            key={cat.value}
            href={buildCatalogUrl({
              categoria: cat.value,
              coleccion: activeCollection,
              q: activeQuery,
            })}
            label={cat.title}
            count={categoryCounts?.[cat.value]}
            active={activeCategory === cat.value}
          />
        ))}
      </div>
    </div>
  );
}

export function NeedFilters({
  activeCategory,
  activeCollection,
  activeSkinNeed,
  activeHairNeed,
  activeQuery,
  skinNeedCounts,
  hairNeedCounts,
}: Pick<
  FilterProps,
  | "activeCategory"
  | "activeCollection"
  | "activeSkinNeed"
  | "activeHairNeed"
  | "activeQuery"
  | "skinNeedCounts"
  | "hairNeedCounts"
>) {
  const isSkin = categorySupportsSkinNeeds(activeCategory);
  const isHair = categorySupportsHairNeeds(activeCategory);
  if (!isSkin && !isHair) return null;

  const activeNeed = isSkin ? activeSkinNeed : activeHairNeed;
  const counts = isSkin ? skinNeedCounts : hairNeedCounts;
  const allNeeds: readonly { title: string; value: string }[] = isSkin
    ? SKIN_NEEDS
    : HAIR_NEEDS;
  /** Solo necesidades presentes en los productos de la vista actual. */
  const needs = allNeeds.filter(
    (need) => need.value === activeNeed || (counts?.[need.value] ?? 0) > 0,
  );
  if (needs.length === 0) return null;

  return (
    <div className="mt-6 border-t border-brand-gold/20 pt-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-brown-muted">
        {isSkin ? "Necesidad de la piel" : "Necesidad del cabello"}
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        <FilterChip
          href={buildCatalogUrl({
            categoria: activeCategory,
            coleccion: activeCollection,
            q: activeQuery,
          })}
          label="Todas"
          active={!activeNeed}
        />
        {needs.map((need) => (
          <FilterChip
            key={need.value}
            href={buildCatalogUrl({
              categoria: activeCategory,
              coleccion: activeCollection,
              piel: isSkin ? need.value : undefined,
              cabello: isHair ? need.value : undefined,
              q: activeQuery,
            })}
            label={need.title}
            count={counts?.[need.value]}
            active={activeNeed === need.value}
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count?: number;
  active: boolean;
}) {
  return (
    <CollectionChip
      href={href}
      label={label}
      count={count}
      active={active}
    />
  );
}

export function getCatalogPageTitle(
  categoria?: string,
  coleccion?: string,
  piel?: string,
  cabello?: string,
): string {
  const parts: string[] = [];
  if (coleccion) {
    const col = PRODUCT_COLLECTIONS.find((c) => c.value === coleccion);
    if (col) parts.push(col.title);
  }
  if (categoria) {
    const cat = PRODUCT_CATEGORIES.find((c) => c.value === categoria);
    if (cat) parts.push(cat.title);
  }
  if (piel) parts.push(getSkinNeedLabel(piel));
  if (cabello) parts.push(getHairNeedLabel(cabello));
  if (parts.length === 0) return "Todos los productos";
  return parts.join(" · ");
}
