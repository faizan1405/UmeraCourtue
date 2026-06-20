import { getProduct } from '@/lib/data';
import { getSettings } from '@/lib/data';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: 'Product | Umera Couture',
    };
  }
  
  const title = `${product.name} | Umera Couture`;
  const description = product.shortDescription || product.fullDescription || `Buy ${product.name} at Umera Couture. Custom sizing available.`;
  const image = product.images?.[0] || '/product_1.png';
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

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
