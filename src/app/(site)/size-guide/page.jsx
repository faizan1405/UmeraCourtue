import { getPolicy } from '@/lib/data';

export default async function SizeGuidePage() {
  const policy = await getPolicy('sizeGuide');

  if (policy?.content) {
    return (
      <div className="container section-padding" style={{ maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>{policy.title || 'Size Guide'}</h1>
        <div className="policy-content" style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: policy.content }} />
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Size Guide</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>
          Please use the following chart to find your perfect fit.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-ivory)' }}>
                <th style={{ padding: '15px', border: '1px solid var(--color-border)' }}>Size</th>
                <th style={{ padding: '15px', border: '1px solid var(--color-border)' }}>UK / AU</th>
                <th style={{ padding: '15px', border: '1px solid var(--color-border)' }}>US</th>
                <th style={{ padding: '15px', border: '1px solid var(--color-border)' }}>Bust (in)</th>
                <th style={{ padding: '15px', border: '1px solid var(--color-border)' }}>Waist (in)</th>
                <th style={{ padding: '15px', border: '1px solid var(--color-border)' }}>Hips (in)</th>
              </tr>
            </thead>
            <tbody>
              {[['XS','6','2','32','24','35'],['S','8','4','34','26','37'],['M','10','6','36','28','39'],['L','12','8','38','30','41']].map((row, i) => (
                <tr key={row[0]} style={i % 2 ? { backgroundColor: 'var(--color-beige)' } : {}}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '15px', border: '1px solid var(--color-border)', fontWeight: j === 0 ? 'bold' : 'normal' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '40px', padding: '30px', border: '1px solid var(--color-border)', textAlign: 'left' }}>
          <h3 style={{ marginBottom: '15px' }}>Custom Sizing</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>We offer custom tailoring for the perfect fit. Simply select &quot;Custom&quot; when adding an item to your bag.</p>
        </div>
      </div>
    </div>
  );
}
