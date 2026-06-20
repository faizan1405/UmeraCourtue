import { getProducts, getCategories } from '@/lib/data';
import CollectionsClient from './CollectionsClient';

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
