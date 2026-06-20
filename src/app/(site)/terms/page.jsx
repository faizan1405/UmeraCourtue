import { getPolicy } from '@/lib/data';

export default async function TermsPage() {
  const policy = await getPolicy('terms');
  return (
    <div className="container section-padding" style={{ maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ marginBottom: '30px' }}>{policy?.title || 'Terms & Conditions'}</h1>
      <div className="policy-content" style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}
        dangerouslySetInnerHTML={{ __html: policy?.content || '<p>Welcome to Umera Couture. By accessing or using our website, you agree to be bound by these terms.</p>' }}
      />
    </div>
  );
}
