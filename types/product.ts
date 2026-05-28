export type Category = {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: Category;
  createdAt: string;
};
