import type { SchemaTypeDefinition } from "sanity";

import { homeCatalogBannerType } from "./homeCatalogBanner";
import { orderType } from "./order";
import { orderItemType } from "./orderItem";
import { pickupPointType } from "./pickupPoint";
import { productType } from "./product";
import { shippingAddressType } from "./shippingAddress";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    productType,
    homeCatalogBannerType,
    pickupPointType,
    orderType,
    orderItemType,
    shippingAddressType,
  ],
};
