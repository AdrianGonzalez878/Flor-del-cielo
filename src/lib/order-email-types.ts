export type OrderEmailItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type OrderEmailAddress = {
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  notes?: string;
};

export type OrderEmailPayload = {
  _id: string;
  orderNumber: string;
  status?: string;
  paymentStatus?: string;
  paymentId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderEmailItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  deliveryMethod?: "shipping" | "pickup" | string;
  pickupPointName?: string;
  shippingAddress?: OrderEmailAddress;
  customerEmailSentAt?: string;
  adminEmailSentAt?: string;
};
