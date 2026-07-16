/**
 * Variables de entorno para Sanity.
 * Si faltan, el sitio sigue funcionando con datos mock (fallback en queries.ts).
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const PLACEHOLDER_IDS = new Set([
  "",
  "tu-project-id",
  "your-project-id",
  "REPLACE_WITH_YOUR_PROJECT_ID",
]);

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? "";

/** Token de escritura (server-only) para crear órdenes desde webhooks. */
export const writeToken = process.env.SANITY_API_WRITE_TOKEN ?? "";

/** Indica si Sanity está configurado. Si no, usamos datos de demostración. */
export const isSanityConfigured =
  Boolean(projectId) && !PLACEHOLDER_IDS.has(projectId);
