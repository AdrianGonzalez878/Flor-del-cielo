#!/usr/bin/env node
/**
 * Sincroniza Sanity con la lista oficial de productos (julio 2026).
 *
 *   node scripts/sync-catalog.mjs --dry-run   # solo muestra el plan
 *   node scripts/sync-catalog.mjs             # aplica los cambios
 *
 * Es idempotente: los productos nuevos se crean con `_id` derivado del slug y,
 * si un producto ya existe (por id, slug o nombre), solo se actualizan precio,
 * presentación, línea y necesidades. Nunca se sobrescriben fotos, nombres ni
 * descripciones escritas en el Studio.
 */

import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

const DRY_RUN = process.argv.includes("--dry-run");
const DEFAULT_STOCK = 10;

/* ── Datos de la lista oficial ──────────────────────────────────────────── */

const LINES = [
  {
    category: "jabones",
    price: 100,
    weight: "Barra de 100 g",
    products: [
      {
        name: "Jabón de arroz",
        slug: "jabon-arroz",
        principles: "extracto y aceite de arroz",
        for: "piel normal, mixta o sensible; apoya la apariencia de las manchas",
        ingredients: ["Arroz", "Aceites vegetales", "Aceites esenciales"],
        skin: ["piel-normal-mixta", "piel-sensible", "manchas-tono"],
      },
      {
        name: "Jabón de avena y miel",
        slug: "jabon-avena-miel",
        match: "jabon de miel",
        principles: "avena coloidal y miel",
        for: "piel seca, deshidratada o delicada",
        ingredients: ["Avena", "Miel", "Aceites vegetales"],
        skin: ["piel-seca", "hidratacion", "piel-sensible"],
      },
      {
        name: "Jabón de cacao y achiote",
        slug: "jabon-cacao-achiote",
        principles: "manteca de cacao y aceite de achiote",
        for: "piel normal a seca",
        ingredients: ["Cacao", "Achiote", "Aceites vegetales"],
        skin: ["piel-normal-mixta", "piel-seca"],
      },
      {
        name: "Jabón de caléndula y manzanilla",
        slug: "jabon-calendula-manzanilla",
        principles: "extractos de caléndula y manzanilla",
        for: "piel sensible, seca o con tendencia a irritarse; también para la piel del bebé",
        ingredients: ["Caléndula", "Manzanilla", "Aceites vegetales"],
        skin: ["piel-sensible", "piel-seca", "piel-bebe"],
        collections: ["bebes-ninos", "familia"],
      },
      {
        name: "Jabón de carbón activado",
        slug: "jabon-carbon-activado",
        principles: "carbón activado y aceites esenciales",
        for: "piel grasa o con tendencia a impurezas",
        ingredients: ["Carbón activado", "Aceites vegetales"],
        skin: ["acne-piel-grasa"],
      },
      {
        name: "Jabón de castilla",
        slug: "jabon-castilla",
        match: "jabón castilla barra (olivo puro)",
        principles: "aceite de olivo puro saponificado",
        for: "la limpieza suave de piel normal o sensible",
        ingredients: ["Aceite de olivo"],
        skin: ["piel-normal-mixta", "piel-sensible"],
      },
      {
        name: "Jabón de cempasúchil",
        slug: "jabon-cempasuchil",
        principles: "flor de cempasúchil y aceites vegetales",
        for: "piel seca, opaca o que necesita nutrición y suavidad",
        ingredients: ["Cempasúchil", "Aceites vegetales"],
        skin: ["piel-seca", "hidratacion"],
        collections: ["herbolaria-tradicional"],
      },
      {
        name: "Jabón de coco y cúrcuma",
        slug: "jabon-coco-curcuma",
        principles: "aceite de coco y cúrcuma",
        for: "piel normal o mixta",
        ingredients: ["Coco", "Cúrcuma"],
        skin: ["piel-normal-mixta"],
      },
      {
        name: "Jabón de espule para bebé",
        slug: "jabon-espule-bebe",
        principles: "espule y aceites vegetales suaves",
        for: "la piel delicada del bebé y la piel sensible",
        ingredients: ["Espule", "Aceites vegetales"],
        skin: ["piel-bebe", "piel-sensible"],
        collections: ["bebes-ninos", "herbolaria-tradicional"],
      },
      {
        name: "Jabón de romero",
        slug: "jabon-romero",
        principles: "extracto y aceite esencial de romero",
        for: "piel normal a grasa y piel joven con algunas irregularidades",
        ingredients: ["Romero", "Aceites vegetales"],
        skin: ["acne-piel-grasa", "piel-normal-mixta"],
      },
      {
        name: "Jabón de sebo",
        slug: "jabon-sebo",
        principles: "sebo purificado y aceites vegetales",
        for: "piel seca, muy seca o áspera",
        ingredients: ["Sebo purificado", "Aceites vegetales"],
        skin: ["piel-extraseca", "piel-seca"],
      },
      {
        name: "Jabón de tepezcohuite",
        slug: "jabon-tepezcohuite",
        principles: "corteza de tepezcohuite",
        for: "piel sensible o con tendencia a presentar irregularidades",
        ingredients: ["Tepezcohuite", "Aceites vegetales"],
        skin: ["piel-sensible", "manchas-tono"],
        collections: ["herbolaria-tradicional"],
      },
    ],
  },
  {
    category: "shampoos",
    price: 200,
    weight: "250 ml",
    collections: ["rutina-diaria"],
    products: [
      {
        name: "Shampoo de amole",
        slug: "shampoo-amole",
        match: "shampoo tradicional de amole",
        principles: "extracto de raíz de amole y tensioactivos suaves",
        for: "cabello normal y para quienes buscan una alternativa inspirada en el lavado tradicional",
        ingredients: ["Amole", "Tensioactivos suaves"],
        hair: ["cabello-normal"],
        collections: ["herbolaria-tradicional"],
      },
      {
        name: "Shampoo anticaída",
        slug: "shampoo-anticaida",
        match: "shampoo herbal crecimiento cabello",
        principles: "romero, ortiga y cola de caballo",
        for: "cabello débil, quebradizo o con tendencia a la caída",
        ingredients: ["Romero", "Ortiga", "Cola de caballo"],
        hair: ["crecimiento-fortalecimiento", "cabello-maltratado"],
      },
      {
        name: "Shampoo para cabello oscuro",
        slug: "shampoo-cabello-oscuro",
        principles: "romero, nogal y guayaba",
        for: "cabello castaño u oscuro; ayuda a conservar su apariencia y brillo natural",
        ingredients: ["Romero", "Nogal", "Guayaba"],
        hair: ["cabello-oscuro"],
      },
      {
        name: "Shampoo para cabello rizado",
        slug: "shampoo-cabello-rizado",
        principles: "chía, linaza y sábila",
        for: "cabello rizado, ondulado, seco o con tendencia al frizz",
        ingredients: ["Chía", "Linaza", "Sábila"],
        hair: ["cabello-rizado", "frizz", "cabello-seco"],
      },
      {
        name: "Shampoo con CBD",
        slug: "shampoo-cbd",
        principles: "CBD y activos botánicos suaves",
        for: "cuero cabelludo sensible, seco o con sensación de incomodidad",
        ingredients: ["CBD", "Activos botánicos"],
        hair: ["cuero-cabelludo-sensible"],
      },
      {
        name: "Shampoo de jojoba",
        slug: "shampoo-jojoba",
        match: "shampoo artesanal de jojoba",
        principles: "aceite de jojoba y extractos hidratantes",
        for: "cabello seco, opaco, maltratado o con puntas resecas",
        ingredients: ["Jojoba", "Extractos hidratantes"],
        hair: ["cabello-seco", "cabello-opaco", "cabello-maltratado"],
      },
      {
        name: "Shampoo de manzanilla",
        slug: "shampoo-manzanilla",
        principles: "extracto de manzanilla",
        for: "cabello claro, delicado, frágil o de uso frecuente",
        ingredients: ["Manzanilla"],
        hair: ["cabello-claro", "cabello-delicado"],
      },
      {
        name: "Shampoo matizador vegetal",
        slug: "shampoo-matizador-vegetal",
        principles: "henna e índigo",
        for: "cabello oscuro, teñido o con necesidad de realzar y equilibrar el tono",
        ingredients: ["Henna", "Índigo"],
        hair: ["cabello-oscuro"],
      },
      {
        name: "Shampoo de miel y germen de trigo",
        slug: "shampoo-miel-germen-trigo",
        match: "shampoo artesanal de miel y germen",
        principles: "miel y germen de trigo",
        for: "cabello seco, deshidratado, poroso o sin brillo",
        ingredients: ["Miel", "Germen de trigo"],
        hair: ["cabello-seco", "cabello-opaco"],
      },
      {
        name: "Shampoo de romero",
        slug: "shampoo-romero",
        principles: "extracto de romero",
        for: "cabello normal a graso y cuero cabelludo que requiere frescura",
        ingredients: ["Romero"],
        hair: ["cuero-cabelludo-graso", "cabello-normal"],
      },
      {
        name: "Shampoo de sábila",
        slug: "shampoo-sabila",
        match: "shampoo artesanal de sabila",
        principles: "hidroglicerinado de sábila",
        for: "cabello normal, seco o deshidratado y cuero cabelludo sensible",
        ingredients: ["Sábila"],
        hair: ["cabello-seco", "cuero-cabelludo-sensible", "cabello-normal"],
      },
    ],
  },
  {
    category: "shampoo-solido",
    price: 100,
    weight: "Barra de 80 g",
    collections: ["solidos"],
    products: [
      {
        name: "Shampoo sólido de árnica",
        slug: "shampoo-solido-arnica",
        principles: "extracto de árnica y aceites vegetales",
        for: "cabello débil, opaco o cuero cabelludo que requiere cuidado revitalizante",
        ingredients: ["Árnica", "Aceites vegetales"],
        hair: ["cabello-opaco", "cabello-maltratado"],
      },
      {
        name: "Shampoo sólido con CBD",
        slug: "shampoo-solido-cbd",
        principles: "CBD y activos botánicos suaves",
        for: "cuero cabelludo sensible, seco o con sensación de incomodidad",
        ingredients: ["CBD", "Activos botánicos"],
        hair: ["cuero-cabelludo-sensible"],
      },
      {
        name: "Shampoo sólido de cola de caballo",
        slug: "shampoo-solido-cola-caballo",
        principles: "extracto de cola de caballo y aceites vegetales",
        for: "cabello frágil, quebradizo o con tendencia a debilitarse",
        ingredients: ["Cola de caballo", "Aceites vegetales"],
        hair: ["crecimiento-fortalecimiento", "cabello-maltratado"],
      },
      {
        name: "Shampoo sólido de cúrcuma",
        slug: "shampoo-solido-curcuma",
        principles: "cúrcuma y aceites vegetales",
        for: "cabello opaco o normal y cuero cabelludo con tendencia grasa",
        ingredients: ["Cúrcuma", "Aceites vegetales"],
        hair: ["cuero-cabelludo-graso", "cabello-opaco"],
      },
      {
        name: "Shampoo sólido dos en uno con sebo",
        slug: "shampoo-solido-dos-en-uno-sebo",
        principles: "sebo purificado y agentes acondicionadores",
        for: "cabello seco, grueso, rizado o con necesidad de mayor suavidad",
        ingredients: ["Sebo purificado", "Agentes acondicionadores"],
        hair: ["cabello-seco", "cabello-rizado", "frizz"],
      },
      {
        name: "Shampoo sólido de henna e índigo",
        slug: "shampoo-solido-henna-indigo",
        principles: "henna, índigo y extractos botánicos",
        for: "cabello oscuro, castaño o teñido; ayuda a realzar visualmente el tono",
        ingredients: ["Henna", "Índigo"],
        hair: ["cabello-oscuro"],
      },
      {
        name: "Shampoo sólido de manzanilla",
        slug: "shampoo-solido-manzanilla",
        principles: "extracto de manzanilla y aceites vegetales",
        for: "cabello claro, delicado, frágil o de uso frecuente",
        ingredients: ["Manzanilla", "Aceites vegetales"],
        hair: ["cabello-claro", "cabello-delicado"],
      },
      {
        name: "Shampoo sólido de romero",
        slug: "shampoo-solido-romero",
        principles: "romero, ortiga y aceites vegetales",
        for: "cabello normal a graso, débil o con tendencia a la caída",
        ingredients: ["Romero", "Ortiga", "Aceites vegetales"],
        hair: ["cuero-cabelludo-graso", "crecimiento-fortalecimiento"],
      },
    ],
  },
  {
    category: "acondicionadores",
    products: [
      {
        name: "Acondicionador líquido",
        slug: "acondicionador-liquido",
        price: 200,
        weight: "250 ml",
        principles: "aguacate, árnica y agentes acondicionadores",
        for: "cabello seco, maltratado, enredado o con necesidad de suavidad",
        ingredients: ["Aguacate", "Árnica"],
        hair: ["cabello-seco", "cabello-maltratado"],
      },
      {
        name: "Acondicionador sólido",
        slug: "acondicionador-solido",
        price: 100,
        weight: "100 g",
        principles: "mantecas, aceites vegetales y agentes acondicionadores",
        for: "cabello seco, grueso, rizado o con tendencia al frizz",
        ingredients: ["Mantecas vegetales", "Aceites vegetales"],
        hair: ["cabello-seco", "cabello-rizado", "frizz"],
        collections: ["solidos"],
      },
      {
        name: "Loción capilar anticaída",
        slug: "locion-capilar-anticaida",
        price: 100,
        weight: "125 ml",
        principles: "romero, ortiga y extractos botánicos fortalecedores",
        for: "cabello débil o con tendencia a la caída",
        ingredients: ["Romero", "Ortiga"],
        hair: ["crecimiento-fortalecimiento"],
      },
      {
        name: "Loción capilar obscurecedora",
        slug: "locion-capilar-obscurecedora",
        price: 100,
        weight: "125 ml",
        principles: "romero, nogal y extractos botánicos para cabello oscuro",
        for: "cabello castaño u oscuro; ayuda a conservar visualmente su tono y brillo",
        ingredients: ["Romero", "Nogal"],
        hair: ["cabello-oscuro"],
      },
      {
        name: "Tónico capilar fortalecedor",
        slug: "tonico-capilar-fortalecedor",
        price: 100,
        weight: "125 ml",
        principles: "romero y extractos botánicos",
        for: "cabello frágil o débil y cuero cabelludo que requiere estimulación y frescura",
        ingredients: ["Romero", "Extractos botánicos"],
        hair: ["crecimiento-fortalecimiento", "cabello-delicado"],
      },
    ],
  },
  {
    category: "cremas",
    price: 200,
    weight: "230 g",
    products: [
      {
        name: "Crema corporal de ajonjolí y uvas",
        slug: "crema-ajonjoli-uvas",
        principles: "aceite de ajonjolí, extracto de uva y humectantes",
        for: "piel normal a seca, opaca o con necesidad de suavidad y nutrición",
        ingredients: ["Ajonjolí", "Uva", "Humectantes"],
        skin: ["piel-normal-mixta", "piel-seca", "hidratacion"],
      },
      {
        name: "Crema corporal de arroz",
        slug: "crema-arroz",
        principles: "extracto y aceite de arroz con humectantes",
        for: "piel normal, sensible o deshidratada; ayuda a mejorar la suavidad y luminosidad",
        ingredients: ["Arroz", "Humectantes"],
        skin: ["piel-sensible", "hidratacion", "manchas-tono"],
      },
      {
        name: "Crema corporal de café y vainilla",
        slug: "crema-cafe-vainilla",
        match: "crema artesanal cafe y vainilla",
        principles: "café, cacao, aceites vegetales y aroma de vainilla",
        for: "piel normal a seca; ideal para masaje y una sensación cálida y reconfortante",
        ingredients: ["Café", "Cacao", "Vainilla"],
        skin: ["piel-seca", "masaje-relajacion"],
      },
      {
        name: "Crema corporal de cempasúchil y pepita de uva",
        slug: "crema-cempasuchil-pepita-uva",
        match: "crema de cempasuchil",
        principles: "cempasúchil, aceite de pepita de uva y extractos botánicos",
        for: "piel seca, opaca o con necesidad de nutrición y suavidad",
        ingredients: ["Cempasúchil", "Pepita de uva"],
        skin: ["piel-seca", "hidratacion"],
        collections: ["herbolaria-tradicional"],
      },
      {
        name: "Crema corporal de fresa y cereza",
        slug: "crema-fresa-cereza",
        match: "crema artesanal de frutos rojos",
        principles: "extractos de fresa y cereza con aceites vegetales",
        for: "piel normal a seca que requiere hidratación y suavidad",
        ingredients: ["Fresa", "Cereza", "Humectantes"],
        skin: ["hidratacion", "piel-seca"],
      },
      {
        name: "Crema corporal de miel y almendras",
        slug: "crema-miel-almendras",
        principles: "miel, aceite de almendras y humectantes",
        for: "piel seca, deshidratada, delicada o con sensación de tirantez",
        ingredients: ["Miel", "Almendras", "Humectantes"],
        skin: ["piel-seca", "hidratacion", "piel-sensible"],
      },
      {
        name: "Crema corporal nutritiva para exposición solar",
        slug: "crema-nutritiva-exposicion-solar",
        principles: "aceites vegetales, mantecas y activos botánicos nutritivos",
        for: "piel reseca o expuesta al ambiente y al sol, para usar después de la exposición solar",
        ingredients: ["Mantecas vegetales", "Aceites vegetales"],
        skin: ["exposicion-solar", "piel-seca"],
      },
      {
        name: "Crema corporal para piernas cansadas",
        slug: "crema-piernas-cansadas",
        match: "crema coorporal para piernas cansadas o con varices",
        principles: "romero, árnica, castaño de Indias y extractos refrescantes",
        for: "el masaje de piernas con sensación de cansancio, pesadez o tensión",
        ingredients: ["Romero", "Árnica", "Castaño de Indias"],
        skin: ["cuidado-piernas", "tension-muscular"],
      },
      {
        name: "Crema corporal de rosa mosqueta",
        slug: "crema-rosa-mosqueta",
        principles: "aceite de rosa mosqueta, aceites vegetales y vitamina E",
        for: "piel seca, madura, opaca o con necesidad de nutrición profunda",
        ingredients: ["Rosa mosqueta", "Vitamina E"],
        skin: ["piel-madura", "piel-seca"],
      },
      {
        name: "Crema corporal de sebo",
        slug: "crema-sebo",
        match: "crema de sebo de res para piel delicada y extraseca",
        principles: "sebo purificado, aceites vegetales y vitamina E",
        for: "piel seca, muy seca, áspera o con necesidad de protección intensa",
        ingredients: ["Sebo purificado", "Vitamina E"],
        skin: ["piel-extraseca", "piel-seca"],
      },
      {
        name: "Crema corporal de té verde y pepino",
        slug: "crema-te-verde-pepino",
        principles: "té verde, pepino y humectantes ligeros",
        for: "piel normal, mixta o con necesidad de frescura e hidratación ligera",
        ingredients: ["Té verde", "Pepino"],
        skin: ["piel-normal-mixta", "acne-piel-grasa", "hidratacion"],
      },
    ],
  },
  {
    category: "mantequillas",
    price: 100,
    weight: "60 g",
    products: [
      {
        name: "Mantequilla corporal de lavanda",
        slug: "mantequilla-lavanda",
        principles:
          "mantecas de karité, cacao y mango con aceite de lavanda y vitamina E",
        for: "piel seca o deshidratada; ideal para masaje y cuidado nocturno con sensación relajante",
        ingredients: ["Karité", "Cacao", "Mango", "Lavanda"],
        skin: ["piel-seca", "masaje-relajacion"],
      },
      {
        name: "Mantequilla corporal de menta",
        slug: "mantequilla-menta",
        principles:
          "mantecas de karité, cacao y mango con aceite de menta y vitamina E",
        for: "piel normal a seca; ideal para masaje corporal y una sensación fresca",
        ingredients: ["Karité", "Cacao", "Mango", "Menta"],
        skin: ["piel-normal-mixta", "masaje-relajacion"],
      },
      {
        name: "Mantequilla corporal para piel sensible",
        slug: "mantequilla-piel-sensible",
        principles:
          "mantecas de karité, cacao y mango con manzanilla, caléndula y vitamina E",
        for: "piel sensible, seca, delicada o con tendencia a irritarse",
        ingredients: ["Karité", "Manzanilla", "Caléndula"],
        skin: ["piel-sensible", "piel-seca"],
      },
      {
        name: "Mantequilla corporal de sebo con achiote",
        slug: "mantequilla-sebo-achiote",
        principles:
          "sebo purificado, mantecas de karité, cacao y mango con aceite de achiote",
        for: "piel seca, muy seca, áspera u opaca; aporta nutrición intensa y suavidad",
        ingredients: ["Sebo purificado", "Karité", "Achiote"],
        skin: ["piel-extraseca", "piel-seca"],
      },
    ],
  },
  {
    category: "facial",
    price: 200,
    weight: "60 g",
    collections: ["rutina-diaria"],
    products: [
      {
        name: "Crema facial con baba de caracol",
        slug: "crema-facial-baba-caracol",
        principles: "baba de caracol, humectantes, aceites vegetales y vitamina E",
        for: "piel seca, madura, opaca o con necesidad de nutrición intensiva",
        ingredients: ["Baba de caracol", "Vitamina E"],
        skin: ["piel-madura", "piel-seca"],
      },
      {
        name: "Crema facial con rosa mosqueta",
        slug: "crema-facial-rosa-mosqueta",
        principles: "aceite de rosa mosqueta, humectantes y vitamina E",
        for: "piel seca, madura, opaca o con apariencia irregular",
        ingredients: ["Rosa mosqueta", "Vitamina E"],
        skin: ["piel-madura", "manchas-tono"],
      },
      {
        name: "Crema facial de miel y almendras",
        slug: "crema-facial-miel-almendras",
        principles: "miel, aceite de almendras, humectantes y vitamina E",
        for: "piel seca, deshidratada, delicada o con sensación de tirantez",
        ingredients: ["Miel", "Almendras"],
        skin: ["piel-seca", "hidratacion"],
      },
      {
        name: "Crema facial nutritiva con sebo",
        slug: "crema-facial-sebo",
        principles: "sebo purificado, aceites vegetales y extractos botánicos",
        for: "piel seca, muy seca, áspera o con necesidad de protección intensa",
        ingredients: ["Sebo purificado", "Vitamina E"],
        skin: ["piel-extraseca", "piel-seca"],
      },
      {
        name: "Crema facial para piel grasa",
        slug: "crema-facial-piel-grasa",
        principles: "té verde, pepino y humectantes ligeros",
        for: "piel grasa, mixta o con tendencia a brillo e impurezas",
        ingredients: ["Té verde", "Pepino"],
        skin: ["acne-piel-grasa"],
      },
      {
        name: "Crema facial para piel normal",
        slug: "crema-facial-piel-normal",
        principles: "aceites de almendras y ajonjolí con humectantes y vitamina E",
        for: "piel normal o ligeramente seca que requiere hidratación diaria",
        ingredients: ["Almendras", "Ajonjolí", "Vitamina E"],
        skin: ["piel-normal-mixta", "hidratacion"],
      },
      {
        name: "Crema facial para piel sensible",
        slug: "crema-facial-piel-sensible",
        principles: "caléndula, manzanilla y humectantes suaves",
        for: "piel sensible, delicada, seca o con tendencia a irritarse",
        ingredients: ["Caléndula", "Manzanilla"],
        skin: ["piel-sensible"],
      },
      {
        name: "Leche limpiadora facial",
        slug: "leche-limpiadora-facial",
        price: 100,
        weight: "100 ml",
        principles: "emolientes vegetales, humectantes y extractos botánicos suaves",
        for: "todo tipo de piel, especialmente piel normal, seca o sensible",
        ingredients: ["Emolientes vegetales", "Extractos botánicos"],
        skin: ["limpieza-facial", "piel-sensible"],
      },
    ],
  },
  {
    category: "serums",
    price: 200,
    products: [
      {
        name: "Contorno de ojos con baba de caracol",
        slug: "contorno-ojos-baba-caracol",
        weight: "30 g",
        principles: "baba de caracol, humectantes suaves y vitamina E",
        for: "contorno de ojos seco, opaco o con apariencia fatigada",
        ingredients: ["Baba de caracol", "Vitamina E"],
        skin: ["contorno-ojos", "hidratacion"],
      },
      {
        name: "Contorno de ojos con miel y jalea real",
        slug: "contorno-ojos-miel-jalea-real",
        weight: "30 g",
        principles: "miel, jalea real y humectantes",
        for: "contorno de ojos seco, delicado o con sensación de tirantez",
        ingredients: ["Miel", "Jalea real"],
        skin: ["contorno-ojos", "piel-seca"],
      },
      {
        name: "Contorno de ojos con rosa mosqueta",
        slug: "contorno-ojos-rosa-mosqueta",
        weight: "30 g",
        principles: "aceite de rosa mosqueta, humectantes y vitamina E",
        for: "contorno de ojos seco, maduro o con apariencia opaca e irregular",
        ingredients: ["Rosa mosqueta", "Vitamina E"],
        skin: ["contorno-ojos", "piel-madura"],
      },
      {
        name: "Sérum calmante",
        slug: "serum-calmante",
        weight: "30 ml",
        principles: "caléndula, manzanilla, pantenol y ácido hialurónico",
        for: "piel sensible, delicada o con sensación de incomodidad",
        ingredients: ["Caléndula", "Manzanilla", "Pantenol"],
        skin: ["piel-sensible"],
      },
      {
        name: "Sérum contorno de ojos",
        slug: "serum-contorno-ojos",
        weight: "30 ml",
        principles: "ácido hialurónico, pantenol y humectantes",
        for: "la zona del contorno de ojos deshidratada, fatigada o con líneas por resequedad",
        ingredients: ["Ácido hialurónico", "Pantenol"],
        skin: ["contorno-ojos", "hidratacion"],
      },
      {
        name: "Sérum equilibrante",
        slug: "serum-equilibrante",
        weight: "30 ml",
        principles: "niacinamida, té verde, pepino y humectantes ligeros",
        for: "piel mixta, grasa o con tendencia a brillo e irregularidades",
        ingredients: ["Niacinamida", "Té verde", "Pepino"],
        skin: ["acne-piel-grasa", "piel-normal-mixta"],
      },
      {
        name: "Sérum hidratante",
        slug: "serum-hidratante",
        weight: "30 ml",
        principles: "ácido hialurónico, pantenol y glicerina",
        for: "todo tipo de piel, especialmente piel deshidratada o con sensación de tirantez",
        ingredients: ["Ácido hialurónico", "Pantenol", "Glicerina"],
        skin: ["hidratacion"],
      },
      {
        name: "Sérum regenerante",
        slug: "serum-regenerante",
        weight: "30 ml",
        principles: "rosa mosqueta, pantenol, vitamina E y activos botánicos",
        for: "piel seca, madura, opaca o con apariencia irregular",
        ingredients: ["Rosa mosqueta", "Pantenol", "Vitamina E"],
        skin: ["piel-madura", "manchas-tono"],
      },
      {
        name: "Sérum unificador del tono",
        slug: "serum-unificador-tono",
        weight: "30 ml",
        principles: "niacinamida, activos botánicos antioxidantes y humectantes",
        for: "piel opaca o con tono visualmente desigual y manchas aparentes",
        ingredients: ["Niacinamida", "Antioxidantes botánicos"],
        skin: ["manchas-tono"],
      },
    ],
  },
  {
    category: "pomadas",
    products: [
      {
        name: "Gel de masaje con CBD",
        slug: "gel-masaje-cbd",
        price: 200,
        weight: "100 ml",
        principles: "CBD, extractos botánicos y agentes refrescantes",
        for: "el masaje localizado en cuello, espalda, piernas o zonas con sensación de tensión",
        ingredients: ["CBD", "Extractos botánicos"],
        skin: ["tension-muscular", "masaje-relajacion"],
      },
      {
        name: "Pomada de árnica",
        slug: "pomada-arnica",
        price: 100,
        weight: "50 g",
        principles: "árnica, aceites vegetales, ceras y vitamina E",
        for: "el masaje corporal en zonas con sensación de cansancio o tensión",
        ingredients: ["Árnica", "Ceras vegetales", "Vitamina E"],
        skin: ["tension-muscular"],
      },
      {
        name: "Pomada de caléndula",
        slug: "pomada-calendula",
        price: 100,
        weight: "50 g",
        principles: "caléndula, aceites vegetales, ceras y vitamina E",
        for: "piel seca, delicada o con necesidad de suavidad y protección",
        ingredients: ["Caléndula", "Ceras vegetales"],
        skin: ["piel-sensible", "piel-seca"],
      },
      {
        name: "Pomada de CBD",
        slug: "pomada-cbd",
        price: 200,
        weight: "50 g",
        principles: "CBD, aceites vegetales, ceras y vitamina E",
        for: "el masaje localizado y una sensación reconfortante en zonas de tensión",
        ingredients: ["CBD", "Ceras vegetales"],
        skin: ["tension-muscular", "masaje-relajacion"],
      },
      {
        name: "Pomada de lavanda",
        slug: "pomada-lavanda",
        price: 100,
        weight: "50 g",
        principles: "lavanda, aceites vegetales, ceras y vitamina E",
        for: "el masaje relajante, el cuidado nocturno y la piel seca o delicada",
        ingredients: ["Lavanda", "Ceras vegetales"],
        skin: ["masaje-relajacion", "piel-seca"],
      },
      {
        name: "Pomada de tepezcohuite",
        slug: "pomada-tepezcohuite",
        price: 100,
        weight: "50 g",
        principles: "tepezcohuite, aceites vegetales, ceras y vitamina E",
        for: "el cuidado botánico tradicional de piel seca, áspera o con apariencia irregular",
        ingredients: ["Tepezcohuite", "Ceras vegetales"],
        skin: ["piel-seca", "manchas-tono"],
        collections: ["herbolaria-tradicional"],
      },
      {
        name: "Pomada tipo vaporub",
        slug: "pomada-vaporub",
        price: 100,
        weight: "50 g",
        principles: "mentol, alcanfor, eucalipto y aceites esenciales herbales",
        for: "el masaje externo en pecho, espalda y cuello, con una sensación fresca y aromática",
        ingredients: ["Mentol", "Alcanfor", "Eucalipto"],
        skin: ["tension-muscular"],
      },
    ],
  },
  {
    category: "aceites",
    products: [
      {
        name: "Aceite de masaje botánico",
        slug: "aceite-masaje-botanico",
        price: 200,
        weight: "250 ml",
        principles: "aceites vegetales, extractos botánicos y vitamina E",
        for: "el masaje corporal, la piel seca y las zonas con sensación de tensión",
        ingredients: ["Aceites vegetales", "Extractos botánicos", "Vitamina E"],
        skin: ["masaje-relajacion", "piel-seca"],
      },
      {
        name: "Aceite desmaquillante botánico",
        slug: "aceite-desmaquillante-botanico",
        price: 100,
        weight: "60 ml",
        principles: "aceites vegetales suaves, vitamina E y extractos botánicos",
        for: "todo tipo de piel, especialmente piel seca o sensible que requiere limpieza sin resecar",
        ingredients: ["Aceites vegetales", "Vitamina E"],
        skin: ["limpieza-facial", "piel-sensible"],
      },
    ],
  },
  {
    category: "velas",
    products: [
      {
        name: "Vela para masaje",
        slug: "vela-para-masaje",
        price: 200,
        weight: "4 oz",
        principles: "ceras vegetales, mantecas, aceites emolientes y aroma botánico",
        for: "el masaje: al fundirse produce un aceite tibio que suaviza, nutre y relaja la piel",
        ingredients: ["Ceras vegetales", "Mantecas", "Aceites emolientes"],
      },
    ],
  },
  {
    category: "ritual",
    products: [
      {
        name: "Bombas efervescentes",
        slug: "bombas-efervescentes",
        price: 50,
        weight: "Unidad",
        principles:
          "bicarbonato, ácido cítrico, sales minerales y aromas botánicos",
        for: "una experiencia de baño relajante y aromática que suaviza la piel",
        ingredients: ["Bicarbonato", "Ácido cítrico", "Sales minerales"],
      },
      {
        name: "Hidrolato de hierbabuena",
        slug: "hidrolato-hierbabuena",
        price: 100,
        weight: "100 ml",
        principles: "agua floral de hierbabuena",
        for: "refrescar y tonificar rostro, cuerpo y cuero cabelludo",
        ingredients: ["Agua floral de hierbabuena"],
        collections: ["herbolaria-tradicional"],
      },
      {
        name: "Hidrolato de romero",
        slug: "hidrolato-romero",
        price: 100,
        weight: "100 ml",
        principles: "agua floral de romero",
        for: "tonificar y refrescar la piel y el cuero cabelludo con sensación revitalizante",
        ingredients: ["Agua floral de romero"],
        collections: ["herbolaria-tradicional"],
      },
      {
        name: "Sales minerales exfoliantes",
        slug: "sales-minerales-exfoliantes",
        price: 100,
        weight: "120 g",
        principles: "sales minerales, exfoliantes naturales y aceites vegetales",
        for: "retirar células superficiales, suavizar la piel y preparar el cuerpo para el masaje o el baño",
        ingredients: ["Sales minerales", "Aceites vegetales"],
      },
    ],
  },
  {
    category: "higiene",
    price: 100,
    collections: ["rutina-diaria"],
    products: [
      {
        name: "Desodorante líquido",
        slug: "desodorante-liquido",
        weight: "60 ml",
        principles:
          "arcilla blanca, extractos botánicos y agentes desodorantes suaves",
        for: "la higiene diaria, con control del olor corporal y sensación de frescura ligera",
        ingredients: ["Arcilla blanca", "Extractos botánicos"],
      },
      {
        name: "Desodorante sólido",
        slug: "desodorante-solido",
        weight: "50 g",
        principles: "arcilla blanca, bicarbonato, aceites vegetales y ceras",
        for: "la higiene diaria y el control del olor corporal sin sales de aluminio",
        ingredients: ["Arcilla blanca", "Bicarbonato", "Ceras vegetales"],
        collections: ["solidos"],
      },
      {
        name: "Enjuague bucal",
        slug: "enjuague-bucal",
        weight: "250 ml",
        principles: "clavo, menta, eucalipto y extractos herbales",
        for: "complementar la higiene bucal y refrescar el aliento",
        ingredients: ["Clavo", "Menta", "Eucalipto"],
      },
      {
        name: "Pasta dental natural",
        slug: "pasta-dental-natural",
        weight: "100 g",
        principles:
          "xilitol, carbonato de calcio, bicarbonato, glicerina y extractos herbales",
        for: "la limpieza diaria de dientes y encías; el xilitol mejora el sabor sin añadir azúcar",
        ingredients: ["Xilitol", "Carbonato de calcio", "Bicarbonato"],
      },
    ],
  },
  {
    category: "bebes",
    price: 200,
    collections: ["bebes-ninos", "familia"],
    products: [
      {
        name: "Crema protectora para bebé",
        slug: "crema-protectora-bebe",
        weight: "100 g",
        principles:
          "caléndula, manzanilla, aceite de lavanda, lechuga y agentes protectores",
        for: "proteger, suavizar y mantener confortable la piel delicada en zonas de roce",
        ingredients: ["Caléndula", "Manzanilla", "Lavanda", "Lechuga"],
        skin: ["piel-bebe", "piel-sensible"],
      },
      {
        name: "Crema suave botánica",
        slug: "crema-suave-botanica",
        weight: "200 g",
        principles: "caléndula, manzanilla, aceite de lavanda, lechuga y humectantes",
        for: "hidratar y suavizar la piel delicada, seca o sensible del bebé y de toda la familia",
        ingredients: ["Caléndula", "Manzanilla", "Lavanda", "Lechuga"],
        skin: ["piel-bebe", "piel-sensible", "hidratacion"],
      },
      {
        name: "Gel limpiador dermosuave",
        slug: "gel-limpiador-dermosuave",
        weight: "250 ml",
        principles: "caléndula, manzanilla, lechuga y tensioactivos suaves",
        for: "la limpieza delicada de rostro y cuerpo sin resecar; ideal para piel sensible o infantil",
        ingredients: ["Caléndula", "Manzanilla", "Lechuga"],
        skin: ["piel-bebe", "piel-sensible", "limpieza-facial"],
      },
      {
        name: "Shampoo dermosuave",
        slug: "shampoo-dermosuave",
        weight: "250 ml",
        principles:
          "caléndula, manzanilla, lechuga, aceite de lavanda y tensioactivos suaves",
        for: "la limpieza suave del cabello y cuero cabelludo delicado de bebés, niñas, niños y piel sensible",
        ingredients: ["Caléndula", "Manzanilla", "Lechuga", "Lavanda"],
        skin: ["piel-bebe", "piel-sensible"],
      },
    ],
  },
];

/**
 * Productos que ya existían en Sanity y no aparecen en la lista nueva:
 * se conservan tal cual, solo se completan presentación y necesidades.
 */
const EXISTING_EXTRAS = [
  {
    match: "crema artesanal rosa y grana cochinilla",
    category: "cremas",
    price: 200,
    weight: "230 g",
    skin: ["hidratacion", "piel-normal-mixta"],
  },
  {
    match: "crema de rosas y grana",
    category: "cremas",
    price: 200,
    weight: "230 g",
    skin: ["hidratacion", "piel-normal-mixta"],
  },
  {
    match: "jabon de castilla liquido",
    category: "jabones",
    weight: "250 ml",
    skin: ["piel-normal-mixta", "piel-sensible"],
  },
  {
    match: "shampoo artesanal de miel para cabello delicado",
    category: "shampoos",
    price: 200,
    weight: "250 ml",
    hair: ["cabello-delicado", "cabello-seco"],
  },
];

/* ── Utilidades ─────────────────────────────────────────────────────────── */

function loadEnv(file) {
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const value = match[2].replace(/^["']|["']$/g, "");
    if (!process.env[match[1]]) process.env[match[1]] = value;
  }
}

/** Nombres comparables: sin acentos, signos ni espacios extra. */
function normalize(value) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function buildDescription(product) {
  const parts = [];
  if (product.principles) parts.push(`Elaborado con ${product.principles}.`);
  if (product.for) parts.push(`Indicado para ${product.for}.`);
  return parts.join(" ");
}

function flattenCatalog() {
  return LINES.flatMap((line) =>
    line.products.map((product) => ({
      ...product,
      category: line.category,
      price: product.price ?? line.price,
      weight: product.weight ?? line.weight,
      collections: [
        ...new Set([...(line.collections ?? []), ...(product.collections ?? [])]),
      ],
      skin: product.skin ?? [],
      hair: product.hair ?? [],
    })),
  );
}

/* ── Sincronización ─────────────────────────────────────────────────────── */

async function main() {
  loadEnv(".env.local");

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !dataset || !token) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET o SANITY_API_WRITE_TOKEN en .env.local",
    );
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01",
    token,
    useCdn: false,
  });

  const existing = await client.fetch(
    `*[_type == "product"]{ _id, name, "slug": slug.current }`,
  );

  const byId = new Map(existing.map((doc) => [doc._id, doc]));
  const bySlug = new Map(
    existing.filter((doc) => doc.slug).map((doc) => [doc.slug, doc]),
  );
  const byName = new Map(existing.map((doc) => [normalize(doc.name), doc]));

  const catalog = flattenCatalog();
  const created = [];
  const updated = [];
  const transaction = client.transaction();

  for (const product of catalog) {
    const target =
      byId.get(`fdc-${product.slug}`) ??
      bySlug.get(product.slug) ??
      (product.match ? byName.get(normalize(product.match)) : undefined) ??
      byName.get(normalize(product.name));

    const fields = {
      category: product.category,
      price: product.price,
      weight: product.weight,
      skinNeeds: product.skin,
      hairNeeds: product.hair,
      collections: product.collections,
    };

    if (target) {
      transaction.patch(target._id, (patch) =>
        patch.set(fields).setIfMissing({
          shortDescription: buildDescription(product),
          ingredients: product.ingredients ?? [],
          stock: DEFAULT_STOCK,
          isActive: true,
        }),
      );
      updated.push(`${target.name} → ${product.category} · $${product.price}`);
      continue;
    }

    transaction.createIfNotExists({
      _id: `fdc-${product.slug}`,
      _type: "product",
      name: product.name,
      slug: { _type: "slug", current: product.slug },
      shortDescription: buildDescription(product),
      ingredients: product.ingredients ?? [],
      stock: DEFAULT_STOCK,
      isActive: true,
      ...fields,
    });
    created.push(`${product.name} · $${product.price}`);
  }

  const skippedExtras = [];
  for (const extra of EXISTING_EXTRAS) {
    const target = byName.get(normalize(extra.match));
    if (!target) {
      skippedExtras.push(extra.match);
      continue;
    }

    const fields = { category: extra.category, weight: extra.weight };
    if (extra.price) fields.price = extra.price;
    if (extra.skin) fields.skinNeeds = extra.skin;
    if (extra.hair) fields.hairNeeds = extra.hair;

    transaction.patch(target._id, (patch) => patch.set(fields));
    updated.push(`${target.name} → ${extra.category}`);
  }

  console.log(`Catálogo de la lista: ${catalog.length} productos`);
  console.log(`Ya en Sanity: ${existing.length} documentos\n`);
  console.log(`Por crear (${created.length}):`);
  created.forEach((line) => console.log(`  + ${line}`));
  console.log(`\nPor actualizar (${updated.length}):`);
  updated.forEach((line) => console.log(`  ~ ${line}`));
  if (skippedExtras.length > 0) {
    console.log(`\nSin coincidencia (revisar a mano): ${skippedExtras.join(", ")}`);
  }

  if (DRY_RUN) {
    console.log("\n--dry-run: no se envió nada a Sanity.");
    return;
  }

  await transaction.commit();
  console.log("\nListo: catálogo sincronizado con Sanity.");
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
