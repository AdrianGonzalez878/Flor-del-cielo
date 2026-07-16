import { buildCatalogUrl } from "@/lib/catalog-url";
import type { Product } from "@/sanity/queries";
import {
  HAIR_NEEDS,
  SKIN_NEEDS,
  getHairNeedLabel,
  getSkinNeedLabel,
} from "@/sanity/needs";

export const QUIZ_TOTAL_STEPS = 3;

export type QuizStepId = "focus" | "need" | "context";
export type QuizFocus = "piel" | "cabello";

export type QuizAnswers = {
  focus?: QuizFocus;
  need?: string;
  context?: string;
};

export type QuizOption = {
  id: string;
  label: string;
  description?: string;
};

export type QuizQuestion = {
  id: QuizStepId;
  title: string;
  subtitle: string;
  options: QuizOption[];
};

export type QuizResult = {
  title: string;
  description: string;
  tip: string;
  catalogUrl: string;
  products: Product[];
};

const focusQuestion: QuizQuestion = {
  id: "focus",
  title: "¿Qué quieres cuidar hoy?",
  subtitle: "Empecemos por el área en la que quieres enfocarte.",
  options: [
    {
      id: "piel",
      label: "Mi piel",
      description: "Limpieza, hidratación y cuidado corporal",
    },
    {
      id: "cabello",
      label: "Mi cabello",
      description: "Brillo, suavidad y cuidado del cuero cabelludo",
    },
  ],
};

const contextQuestion: QuizQuestion = {
  id: "context",
  title: "¿Cómo planeas usarlo?",
  subtitle: "Esto nos ayuda a ordenar mejor tus recomendaciones.",
  options: [
    {
      id: "rutina-diaria",
      label: "En mi rutina diaria",
      description: "Un producto para usar con frecuencia",
    },
    {
      id: "familia",
      label: "Para compartir en familia",
      description: "Opciones versátiles para el hogar",
    },
    {
      id: "bebes-ninos",
      label: "Para bebé o niño",
      description: "Priorizamos productos de cuidado delicado",
    },
    {
      id: "sin-preferencia",
      label: "Sin preferencia",
      description: "Muéstrame las mejores coincidencias",
    },
  ],
};

function productsForFocus(products: Product[], focus: QuizFocus): Product[] {
  if (focus === "cabello") {
    return products.filter((product) => product.category?.slug === "shampoos");
  }
  return products.filter((product) =>
    ["jabones", "cremas", "aceites"].includes(product.category?.slug ?? ""),
  );
}

function availableNeedOptions(
  focus: QuizFocus,
  products: Product[],
): QuizOption[] {
  const focusedProducts = productsForFocus(products, focus);
  const needs = focus === "piel" ? SKIN_NEEDS : HAIR_NEEDS;
  const field = focus === "piel" ? "skinNeeds" : "hairNeeds";

  return needs
    .filter((need) =>
      focusedProducts.some((product) =>
        (product[field] ?? []).includes(need.value),
      ),
    )
    .map((need) => ({
      id: need.value,
      label: need.title,
      description:
        focus === "piel"
          ? "Ver productos clasificados para esta necesidad"
          : "Encontrar fórmulas capilares compatibles",
    }));
}

export function getQuizQuestion(
  step: number,
  answers: QuizAnswers,
  products: Product[],
): QuizQuestion | null {
  if (step === 0) return focusQuestion;
  if (step === 1 && answers.focus) {
    return {
      id: "need",
      title:
        answers.focus === "piel"
          ? "¿Qué necesita tu piel?"
          : "¿Qué necesita tu cabello?",
      subtitle: "Elige la opción que más se acerque a lo que buscas.",
      options: availableNeedOptions(answers.focus, products),
    };
  }
  if (step === 2) return contextQuestion;
  return null;
}

function contextCollection(context?: string): string | undefined {
  return context && context !== "sin-preferencia" ? context : undefined;
}

function tipForNeed(focus: QuizFocus, need: string): string {
  const tips: Record<string, string> = {
    "piel-seca":
      "Aplica el producto sobre la piel ligeramente húmeda para ayudar a conservar la hidratación.",
    "piel-extraseca":
      "Prefiere rutinas suaves y constantes; evita el agua demasiado caliente.",
    "piel-sensible":
      "Prueba una pequeña cantidad primero y evita combinar muchos productos nuevos a la vez.",
    "acne-piel-grasa":
      "La limpieza debe ser suave: tallar con fuerza puede irritar y alterar la barrera de la piel.",
    hidratacion:
      "La constancia suele dar mejores resultados que aplicar demasiado producto de una sola vez.",
    "cuidado-piernas":
      "Acompaña el masaje con movimientos ascendentes y evita aplicarlo sobre piel lesionada.",
    "cabello-seco":
      "Concentra el lavado en el cuero cabelludo y evita frotar demasiado las puntas.",
    "cabello-opaco":
      "Enjuaga bien y reduce el uso frecuente de calor para conservar el brillo natural.",
    "cabello-maltratado":
      "Alterna limpieza suave con descanso de herramientas térmicas y procesos químicos.",
    frizz:
      "Evita frotar el cabello con la toalla; presiónalo suavemente para retirar el exceso de agua.",
    "cabello-delicado":
      "Masajea con las yemas de los dedos y desenreda sin tirones.",
    "cuero-cabelludo-sensible":
      "Usa agua tibia y suspende el producto si notas irritación persistente.",
    "crecimiento-fortalecimiento":
      "La constancia y un masaje suave del cuero cabelludo complementan tu rutina.",
  };

  return (
    tips[need] ??
    (focus === "piel"
      ? "Incorpora un producto a la vez para observar cómo responde tu piel."
      : "Da tiempo a tu rutina capilar antes de evaluar sus resultados.")
  );
}

export function getQuizResult(
  answers: QuizAnswers,
  products: Product[],
): QuizResult | null {
  const { focus, need, context } = answers;
  if (!focus || !need || !context) return null;

  const focusedProducts = productsForFocus(products, focus);
  const needField = focus === "piel" ? "skinNeeds" : "hairNeeds";
  const collection = contextCollection(context);

  const ranked = focusedProducts
    .map((product) => {
      const exactNeed = (product[needField] ?? []).includes(need);
      const contextMatch =
        !collection || (product.collections ?? []).includes(collection);
      const bestseller = (product.collections ?? []).includes("mas-vendido");
      const inStock = product.stock > 0;

      return {
        product,
        exactNeed,
        score:
          (exactNeed ? 100 : 0) +
          (contextMatch ? 20 : 0) +
          (bestseller ? 5 : 0) +
          (inStock ? 2 : 0),
      };
    })
    .sort((a, b) => b.score - a.score);

  const exactMatches = ranked.filter((item) => item.exactNeed);
  const availableExactMatches = exactMatches.filter(
    (item) => item.product.stock > 0,
  );
  const recommendations = (
    availableExactMatches.length > 0 ? availableExactMatches : ranked
  )
    .filter((item) => item.product.stock > 0)
    .slice(0, 3)
    .map((item) => item.product);

  const needLabel =
    focus === "piel" ? getSkinNeedLabel(need) : getHairNeedLabel(need);
  const categoria = focus === "cabello" ? "shampoos" : undefined;

  return {
    title: `Tu selección para ${needLabel.toLowerCase()}`,
    description:
      recommendations.length > 0
        ? `Encontramos ${recommendations.length === 1 ? "una opción" : `${recommendations.length} opciones`} del catálogo que coincide con lo que buscas.`
        : "Todavía no tenemos una coincidencia exacta, pero puedes explorar el catálogo completo.",
    tip: tipForNeed(focus, need),
    catalogUrl: buildCatalogUrl({
      categoria,
      coleccion: collection,
      piel: focus === "piel" ? need : undefined,
      cabello: focus === "cabello" ? need : undefined,
      from: "quiz",
    }),
    products: recommendations,
  };
}
