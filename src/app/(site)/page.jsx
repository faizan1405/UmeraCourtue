import Link from 'next/link';
import { getProducts, getCategories, getSettings } from '@/lib/data';
import HomeClient from './HomeClient';

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
