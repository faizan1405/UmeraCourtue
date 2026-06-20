import React from 'react';

const SizeGuide = () => {
  return (
    <div className="container section-padding">
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Size Guide</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>
          Please use the following chart to find your perfect fit. If your measurements fall between sizes, we recommend ordering the larger size or contacting us for a custom fit.
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
              <tr>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)', fontWeight: 'bold' }}>XS</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>6</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>2</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>32</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>24</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>35</td>
              </tr>
              <tr style={{ backgroundColor: 'var(--color-beige)' }}>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)', fontWeight: 'bold' }}>S</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>8</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>4</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>34</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>26</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>37</td>
              </tr>
              <tr>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)', fontWeight: 'bold' }}>M</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>10</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>6</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>36</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>28</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>39</td>
              </tr>
              <tr style={{ backgroundColor: 'var(--color-beige)' }}>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)', fontWeight: 'bold' }}>L</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>12</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>8</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>38</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>30</td>
                <td style={{ padding: '15px', border: '1px solid var(--color-border)' }}>41</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '40px', padding: '30px', border: '1px solid var(--color-border)', textAlign: 'left' }}>
          <h3 style={{ marginBottom: '15px' }}>Custom Sizing</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            We offer custom tailoring for the perfect fit. Simply select "Custom" when adding an item to your bag, and our team will reach out via WhatsApp to guide you through the measurement process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
