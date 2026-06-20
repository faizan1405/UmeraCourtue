import { getProducts, getCategoryBySlug } from '@/lib/data';
import CollectionsClient from '../CollectionsClient';
import { getCategories } from '@/lib/data';

export default async function CollectionBySlugPage({ params }) {
  const { slug } = await params;
  const [products, categories] = await Promise.all([
    getProducts({ category: slug }),
    getCategories(),
  ]);
  const category = await getCategoryBySlug(slug);

  return <CollectionsClient
    products={JSON.parse(JSON.stringify(products))}
    categories={JSON.parse(JSON.stringify(categories))}
    initialCategory={slug}
  />;
}
