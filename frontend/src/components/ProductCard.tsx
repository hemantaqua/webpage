import Link from 'next/link';
import { Product } from '@/lib/definitions';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/${product.category_slug}/${product.slug}`} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm truncate">{product.description}</p>
      </div>
    </Link>
  );
}