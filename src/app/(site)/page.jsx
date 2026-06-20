import Link from 'next/link';
import { getProducts, getCategories, getSettings } from '@/lib/data';
import HomeClient from './HomeClient';

export async function generateMetadata() {
  const settings = await getSettings();
  const title = 'Umera Couture | Luxury Fashion';
  const description = settings?.heroSubtitle || 'Discover the new era of luxury couture pieces crafted for the sophisticated.';
  const image = settings?.heroBanner || '/hero_banner.png';
  
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
          alt: 'Umera Couture',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function HomePage() {
  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getSettings(),
  ]);

  const featuredProducts = products.filter(p => p.isFeatured);
  const newArrivals = products.filter(p => p.isNewArrival);

  return <HomeClient
    products={JSON.parse(JSON.stringify(featuredProducts))}
    newArrivals={JSON.parse(JSON.stringify(newArrivals))}
    categories={JSON.parse(JSON.stringify(categories))}
    settings={settings}
  />;
}

