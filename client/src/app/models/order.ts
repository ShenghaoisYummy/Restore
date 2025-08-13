export interface OrderItem {
  productId: number;
  name: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface PaymentSummary {
  last4: number;
  brand: string;
  expMonth: number;
  expYear: number;
}

export interface Order {
  id: number;
  buyerEmail: string;
  orderDate: string;
  orderItems: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  status: string;
  shippingAddress: ShippingAddress;
  paymentSummary: PaymentSummary;
  total: number;
  discount: number;
}

export interface CreateOrder {
  shippingAddress: ShippingAddress;
  paymentSummary: PaymentSummary;
}
