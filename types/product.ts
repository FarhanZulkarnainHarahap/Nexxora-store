export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
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
  gallery?: string[];
  overview?: string | null;
  material?: string | null;
  keyFeatures?: string[];
  sizeGuide?: string | null;
  careInstructions?: string | null;
  warranty?: string | null;
  rating?: number;
  sold?: number;
  tags?: string[];
  isFeatured?: boolean;
  category: Category;
  createdAt: string;
};
