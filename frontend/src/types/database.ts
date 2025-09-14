export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  images: string[];
  sku: string | null;
  featured: boolean;
  created_at: string;
  videos: string[];
  available_variants: string[];
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}

export interface ProductWithCategory extends Product {
  category: Category;
}

// Add the missing types
export interface ProductCreate {
  name: string;
  slug: string;
  description?: string;
  category_id: number;
  sku?: string;
  featured: boolean;
  images: string[];
  videos: string[];
  available_variants: string[];
}

export interface ProductUpdate {
  name?: string;
  slug?: string;
  description?: string;
  category_id?: number;
  sku?: string;
  featured?: boolean;
  images?: string[];
  videos?: string[];
  available_variants?: string[];
}

export interface CategoryCreate {
  name: string;
  slug: string;
  description?: string;
}

export interface CategoryUpdate {
  name?: string;
  slug?: string;
  description?: string;
}
