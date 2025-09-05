import { getProductBySlug } from '@/lib/api';
import { Product } from '@/lib/definitions';
import { notFound } from 'next/navigation';

type Params = {
  params: {
    productSlug: string;
  };
};

export default async function ProductDetailPage({ params }: Params) {
  const { productSlug } = params;
  const product: Product = await getProductBySlug(productSlug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <img src={product.images[0]} alt={product.name} className="w-full rounded-lg shadow-lg mb-4" />
          <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1).map((img, index) => (
                  <img key={index} src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-auto rounded-md" />
              ))}
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>
          <div className="mt-8">
            <a href="/contact" className="bg-primary text-white px-8 py-3 rounded-md text-lg hover:bg-green-700">
                Inquire Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}