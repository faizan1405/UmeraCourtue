import { getProducts, getCategoryBySlug } from '@/lib/data';
import CollectionsClient from '../CollectionsClient';
import { getCategories } from '@/lib/data';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: 'Collection | Umera Couture',
    };
  }
  
  const title = `${category.name} | Umera Couture`;
  const description = category.description || `Explore our exclusive ${category.name} collection at Umera Couture.`;
  const image = category.bannerImage || '/hero_banner.png';
  
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
          alt: category.name,
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

export default async function CollectionBySlugPage({ params }) {
  const { slug } = await params;
  const [products, categories] = await Promise.all([
    getProducts({ category: slug }),
    getCategories(),
  ]);
  return <CollectionsClient
    products={JSON.parse(JSON.stringify(products))}
    categories={JSON.parse(JSON.stringify(categories))}
    initialCategory={slug}
  />;
}
