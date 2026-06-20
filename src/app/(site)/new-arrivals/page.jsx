import { getNewArrivals } from '@/lib/data';
import ProductCard from '@/components/ui/ProductCard';

export default async function NewArrivalsPage() {
  const products = await getNewArrivals();

  return (
    <div className="container section-padding">
      <div className="section-header text-center margin-bottom-lg fade-in-up">
        <h1>New Arrivals</h1>
        <p>Explore our latest luxury couture pieces crafted for the sophisticated.</p>
      </div>

      <div className="products-grid fade-in-up" style={{ animationDelay: '0.2s' }}>
        {products.map(product => (
          <ProductCard key={product._id} product={JSON.parse(JSON.stringify(product))} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center" style={{ padding: '3rem 0', color: 'var(--color-text-muted)' }}>
          <p>No new arrivals found. Check back later!</p>
        </div>
      )}
    </div>
  );
}
