import { createClient, type SanityClient } from "next-sanity";

import {
  apiVersion,
  dataset,
  isSanityConfigured,
  projectId,
  writeToken,
} from "./env";

let cachedClient: SanityClient | null = null;

/** Cliente público (solo lectura, cacheable). Lazy: se crea solo si Sanity está configurado. */
export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured) return null;
  if (cachedClient) return cachedClient;
  cachedClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: "published",
  });
  return cachedClient;
}

/** Cliente con token de escritura (server-only). */
export function getSanityWriteClient(): SanityClient {
  if (!isSanityConfigured) {
    throw new Error(
      "Sanity no está configurado. Define NEXT_PUBLIC_SANITY_PROJECT_ID.",
    );
  }
  if (!writeToken) {
    throw new Error(
      "SANITY_API_WRITE_TOKEN no está configurado. Necesario para crear órdenes.",
    );
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token: writeToken,
    useCdn: false,
  });
}
