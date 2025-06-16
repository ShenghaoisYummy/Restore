export interface Basket {
  basketId: string;
  items: Item[];
}

export interface Item {
  productId: number;
  name: string;
  pictureUrl: string;
  price: number;
  brand: string;
  type: string;
  quantity: number;
}
