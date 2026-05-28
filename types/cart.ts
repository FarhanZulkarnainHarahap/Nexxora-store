import { Product } from "./product";

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};

export type Cart = {
  id: string;
  items: CartItem[];
  total: number;
};
