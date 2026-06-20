import { getPolicy } from '@/lib/data';

export const metadata = {
  title: 'Shipping & Returns | Umera Couture',
  description: 'Learn about our premium shipping timelines, custom couture dispatch times, and ready-to-wear returns policy.',
};

export default async function ShippingReturnsPage() {
  const policy = await getPolicy('shipping');
  return (
    <div className="container section-padding" style={{ maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ marginBottom: '30px' }}>{policy?.title || 'Shipping & Returns'}</h1>
      <div className="policy-content" style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}
        dangerouslySetInnerHTML={{ __html: policy?.content || '<p>We offer worldwide shipping with premium care for all couture pieces.</p>' }}
      />
    </div>
  );
}
