import { getPolicy } from '@/lib/data';

export default async function PrivacyPolicyPage() {
  const policy = await getPolicy('privacy');
  return (
    <div className="container section-padding" style={{ maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ marginBottom: '30px' }}>{policy?.title || 'Privacy Policy'}</h1>
      <div className="policy-content" style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}
        dangerouslySetInnerHTML={{ __html: policy?.content || '<p>At Umera Couture, we value your privacy and are committed to protecting your personal information.</p>' }}
      />
    </div>
  );
}
