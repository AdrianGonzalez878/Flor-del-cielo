import { getCategoryNeedType } from "./categories";

export const SKIN_NEEDS = [
  { title: "Piel seca", value: "piel-seca" },
  { title: "Piel extraseca", value: "piel-extraseca" },
  { title: "Piel sensible", value: "piel-sensible" },
  { title: "Piel normal o mixta", value: "piel-normal-mixta" },
  { title: "Acné y piel grasa", value: "acne-piel-grasa" },
  { title: "Hidratación", value: "hidratacion" },
  { title: "Piel madura", value: "piel-madura" },
  { title: "Manchas y tono desigual", value: "manchas-tono" },
  { title: "Limpieza facial", value: "limpieza-facial" },
  { title: "Contorno de ojos", value: "contorno-ojos" },
  { title: "Después del sol", value: "exposicion-solar" },
  { title: "Masaje y relajación", value: "masaje-relajacion" },
  { title: "Cansancio y tensión", value: "tension-muscular" },
  { title: "Cuidado de piernas", value: "cuidado-piernas" },
  { title: "Piel de bebé", value: "piel-bebe" },
] as const;

export const HAIR_NEEDS = [
  { title: "Cabello normal", value: "cabello-normal" },
  { title: "Cabello seco", value: "cabello-seco" },
  { title: "Cabello opaco", value: "cabello-opaco" },
  { title: "Cabello maltratado", value: "cabello-maltratado" },
  { title: "Frizz", value: "frizz" },
  { title: "Cabello rizado", value: "cabello-rizado" },
  { title: "Cabello delicado", value: "cabello-delicado" },
  { title: "Cabello claro", value: "cabello-claro" },
  { title: "Cabello oscuro o teñido", value: "cabello-oscuro" },
  { title: "Cuero cabelludo sensible", value: "cuero-cabelludo-sensible" },
  { title: "Cuero cabelludo graso", value: "cuero-cabelludo-graso" },
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
  return getCategoryNeedType(category) === "skin";
}

export function categorySupportsHairNeeds(category?: string): boolean {
  return getCategoryNeedType(category) === "hair";
}
