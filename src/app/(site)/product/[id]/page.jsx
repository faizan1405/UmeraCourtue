import { getProduct } from '@/lib/data';
import { getSettings } from '@/lib/data';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const [product, settings] = await Promise.all([
    getProduct(id),
    getSettings(),
  ]);

  if (!product) {
    return (
      <div className="container section-padding text-center" style={{ minHeight: '60vh' }}>
        <h1>Product Not Found</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>The product you are looking for does not exist.</p>
      </div>
    );
  }

  return <ProductDetailClient
    product={JSON.parse(JSON.stringify(product))}
    settings={settings}
  />;
}
