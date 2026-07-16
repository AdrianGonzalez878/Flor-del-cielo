export const SKIN_NEEDS = [
  { title: "Piel seca", value: "piel-seca" },
  { title: "Piel extraseca", value: "piel-extraseca" },
  { title: "Piel sensible", value: "piel-sensible" },
  { title: "Acné y piel grasa", value: "acne-piel-grasa" },
  { title: "Hidratación", value: "hidratacion" },
  { title: "Cuidado de piernas", value: "cuidado-piernas" },
] as const;

export const HAIR_NEEDS = [
  { title: "Cabello seco", value: "cabello-seco" },
  { title: "Cabello opaco", value: "cabello-opaco" },
  { title: "Cabello maltratado", value: "cabello-maltratado" },
  { title: "Frizz", value: "frizz" },
  { title: "Cabello delicado", value: "cabello-delicado" },
  { title: "Cuero cabelludo sensible", value: "cuero-cabelludo-sensible" },
  {
    title: "Crecimiento y fortalecimiento",
    value: "crecimiento-fortalecimiento",
  },
] as const;

export type SkinNeedSlug = (typeof SKIN_NEEDS)[number]["value"];
export type HairNeedSlug = (typeof HAIR_NEEDS)[number]["value"];

const skinLabelBySlug = Object.fromEntries(
  SKIN_NEEDS.map((need) => [need.value, need.title]),
) as Record<SkinNeedSlug, string>;

const hairLabelBySlug = Object.fromEntries(
  HAIR_NEEDS.map((need) => [need.value, need.title]),
) as Record<HairNeedSlug, string>;

export function getSkinNeedLabel(slug: string): string {
  return skinLabelBySlug[slug as SkinNeedSlug] ?? slug;
}

export function getHairNeedLabel(slug: string): string {
  return hairLabelBySlug[slug as HairNeedSlug] ?? slug;
}

export function categorySupportsSkinNeeds(category?: string): boolean {
  return ["jabones", "cremas", "aceites"].includes(category ?? "");
}

export function categorySupportsHairNeeds(category?: string): boolean {
  return category === "shampoos";
}
