import { CategoryGridView } from "@/components/home/CategoryGridView";
import { getCategoryCoverImages, type ProductImage } from "@/sanity/queries";

type Props = {
  /** Portadas ya resueltas; evita repetir la consulta en la home. */
  covers?: Record<string, ProductImage>;
};

export async function CategoryGrid({ covers }: Props) {
  const resolved = covers ?? (await getCategoryCoverImages());

  return <CategoryGridView covers={resolved} />;
}
