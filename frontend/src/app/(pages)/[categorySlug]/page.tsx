import { getCategoryBySlug, getProducts } from '@/lib/api';
import { Category, Product } from '@/lib/definitions';
import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: { categorySlug: string } }) {
  const { categorySlug } = params;
  const category: Category = await getCategoryBySlug(categorySlug);
  const products: Product[] = await getProducts(categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
      <p className="text-lg text-gray-600 mb-8">{category.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products && products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
}