import { Product } from "./product";

export interface Basket {
  basketId: string;
  items: Item[];
  clientSecret?: string;
  paymentIntentId?: string;
}

export class Item {
  constructor(product: Product, quantity: number) {
    this.productId = product.id;
    this.name = product.name;
    this.pictureUrl = product.pictureUrl;
    this.price = product.price;
    this.brand = product.brand;
    this.type = product.type;
    this.quantity = quantity;
  }
  productId: number;
  name: string;
  pictureUrl: string;
  price: number;
  brand: string;
  type: string;
  quantity: number;
}
