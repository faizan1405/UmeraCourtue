import { getProducts, getCategories } from '@/lib/data';
import CollectionsClient from './CollectionsClient';

export const metadata = {
  title: 'Our Collections | Umera Couture',
  description: 'Browse our curated collections of luxury couture, festive wear, and modern designer garments.',
  openGraph: {
    title: 'Our Collections | Umera Couture',
    description: 'Browse our curated collections of luxury couture, festive wear, and modern designer garments.',
  },
};

export default async function CollectionsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <CollectionsClient
    products={JSON.parse(JSON.stringify(products))}
    categories={JSON.parse(JSON.stringify(categories))}
  />;
}
