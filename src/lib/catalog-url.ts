/** Construye la URL del catálogo preservando filtros activos. */
export function buildCatalogUrl(filters?: {
  categoria?: string;
  coleccion?: string;
  piel?: string;
  cabello?: string;
  q?: string;
  from?: string;
  pagina?: number;
}): string {
  const params = new URLSearchParams();
  if (filters?.categoria) params.set("categoria", filters.categoria);
  if (filters?.coleccion) params.set("coleccion", filters.coleccion);
  if (filters?.piel) params.set("piel", filters.piel);
  if (filters?.cabello) params.set("cabello", filters.cabello);
  if (filters?.q?.trim()) params.set("q", filters.q.trim());
  if (filters?.from) params.set("from", filters.from);
  if (filters?.pagina && filters.pagina > 1) {
    params.set("pagina", String(filters.pagina));
  }
  const qs = params.toString();
  return qs ? `/productos?${qs}` : "/productos";
}
