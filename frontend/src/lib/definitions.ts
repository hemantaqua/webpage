export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    images: string[];
    videos: string[];
    category_slug: string;
    available_variants: string[];
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
}