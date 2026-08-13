import { CategoryGridView } from "@/components/home/CategoryGridView";
import { getCategoryCoverImages } from "@/sanity/queries";

export async function CategoryGrid() {
  const covers = await getCategoryCoverImages();

  return <CategoryGridView covers={covers} />;
}
