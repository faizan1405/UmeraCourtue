
async function testUrls() {
  const domain = 'https://xyzz1.vercel.app';
  const urls = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'Product Detail', path: '/product/6a366a2f277b7844b00ec5cd' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Cart', path: '/cart' },
    { name: 'Checkout', path: '/checkout' },
    { name: 'Wishlist', path: '/wishlist' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Shipping & Returns', path: '/shipping-returns' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Size Guide', path: '/size-guide' }
  ];

  console.log('====================================================');
  console.log('       LIVE SITE PUBLIC PAGES VERIFICATION          ');
  console.log('====================================================\n');

  let allPassed = true;

  for (const item of urls) {
    const fullUrl = `${domain}${item.path}`;
    const start = Date.now();
    try {
      const res = await fetch(fullUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const duration = Date.now() - start;
      const text = await res.text();
      
      const containsBrand = text.toLowerCase().includes('umera') || text.toLowerCase().includes('couture');
      const isOk = res.status === 200;
      
      if (isOk) {
        console.log(`[+] ${item.name} (${item.path}): PASS | Status: ${res.status} | Time: ${duration}ms | Brand Text Check: ${containsBrand ? 'PASS' : 'FAIL'}`);
      } else {
        console.log(`[-] ${item.name} (${item.path}): FAIL | Status: ${res.status} | Time: ${duration}ms`);
        allPassed = false;
      }
    } catch (err) {
      console.log(`[-] ${item.name} (${item.path}): ERROR | ${err.message}`);
      allPassed = false;
    }
  }

  console.log('\n====================================================');
  console.log(`Verification Complete: ${allPassed ? 'ALL PAGES SUCCESSFUL' : 'SOME PAGES FAILED'}`);
  console.log('====================================================\n');
}

testUrls();
