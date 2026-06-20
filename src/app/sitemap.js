import { getProducts, getCategories } from '@/lib/data';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://umera-courtue.vercel.app';

  let products = [];
  let categories = [];
  try {
    products = await getProducts();
    categories = await getCategories();
  } catch (error) {
    console.error('Error fetching data for sitemap:', error);
  }

  // Static routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/collections',
    '/new-arrivals',
    '/privacy-policy',
    '/shipping-returns',
    '/size-guide',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Category collection routes
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/collections/${cat.slug}`,
    lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Product detail routes
  const productRoutes = products.map((prod) => ({
    url: `${baseUrl}/product/${prod._id}`,
    lastModified: prod.updatedAt ? new Date(prod.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...routes, ...categoryRoutes, ...productRoutes];
}
