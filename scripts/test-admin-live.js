const path = require('path');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(path.join(__dirname, '..'));

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://xyzz1.vercel.app';

async function testAdminLive() {
  console.log('====================================================');
  console.log('         LIVE SITE ADMIN PAGES VERIFICATION         ');
  console.log('====================================================\n');
  console.log(`Using Base URL: ${BASE_URL}`);
  console.log(`Using Admin Email: ${ADMIN_EMAIL}`);

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('[-] Error: Admin credentials missing in environment variables.');
    process.exit(1);
  }

  let cookieHeader = null;

  // 1. Admin Login API Test
  try {
    console.log('\n[TEST 1] Logging into admin account...');
    const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });

    const data = await loginRes.json();
    if (loginRes.status === 200 && data.success) {
      console.log('[+] PASS: Admin logged in successfully.');
      const rawCookies = loginRes.headers.get('set-cookie');
      if (rawCookies) {
        // Extract the admin_token cookie
        const match = rawCookies.match(/admin_token=[^;]+/);
        if (match) {
          cookieHeader = match[0];
          console.log('[+] PASS: Session cookie retrieved successfully.');
        }
      }
    } else {
      console.error(`[-] FAIL: Login endpoint failed. Status: ${loginRes.status}, Error:`, data.error);
    }
  } catch (err) {
    console.error(`[-] FAIL: Login endpoint request failed: ${err.message}`);
  }

  if (!cookieHeader) {
    console.error('[-] Cannot proceed without authenticated cookie. Skipping subsequent tests.');
    process.exit(1);
  }

  // 2. Fetch Admin Session Test
  try {
    console.log('\n[TEST 2] Verifying admin session validity...');
    const res = await fetch(`${BASE_URL}/api/admin/session`, {
      headers: {
        Cookie: cookieHeader
      }
    });
    const data = await res.json();
    if (res.status === 200 && data.email === ADMIN_EMAIL) {
      console.log(`[+] PASS: Admin session verified. Role: ${data.role}`);
    } else {
      console.error(`[-] FAIL: Admin session endpoint failed. Status: ${res.status}, Error:`, data.error);
    }
  } catch (err) {
    console.error(`[-] FAIL: Admin session request failed: ${err.message}`);
  }

  // 3. Fetch Admin Orders Test
  try {
    console.log('\n[TEST 3] Fetching orders list as admin...');
    const res = await fetch(`${BASE_URL}/api/admin/orders`, {
      headers: {
        Cookie: cookieHeader
      }
    });
    const data = await res.json();
    if (res.status === 200 && Array.isArray(data)) {
      console.log(`[+] PASS: Orders list fetched successfully. Count: ${data.length}`);
    } else {
      console.error(`[-] FAIL: Fetching orders failed. Status: ${res.status}, Error:`, data.error);
    }
  } catch (err) {
    console.error(`[-] FAIL: Fetching orders request failed: ${err.message}`);
  }

  // 4. Fetch Admin Enquiries Test
  try {
    console.log('\n[TEST 4] Fetching enquiries list as admin...');
    const res = await fetch(`${BASE_URL}/api/admin/enquiries`, {
      headers: {
        Cookie: cookieHeader
      }
    });
    const data = await res.json();
    if (res.status === 200 && Array.isArray(data)) {
      console.log(`[+] PASS: Enquiries list fetched successfully. Count: ${data.length}`);
    } else {
      console.error(`[-] FAIL: Fetching enquiries failed. Status: ${res.status}, Error:`, data.error);
    }
  } catch (err) {
    console.error(`[-] FAIL: Fetching enquiries request failed: ${err.message}`);
  }

  // 5. Image Upload API Test
  try {
    console.log('\n[TEST 5] Uploading a test image via admin API...');
    const formData = new FormData();
    const gifBase64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const buffer = Buffer.from(gifBase64, 'base64');
    const blob = new Blob([buffer], { type: 'image/gif' });
    formData.append('file', blob, 'test.gif');
    formData.append('folder', 'test-live-upload');

    const res = await fetch(`${BASE_URL}/api/admin/upload-image`, {
      method: 'POST',
      headers: {
        Cookie: cookieHeader
      },
      body: formData
    });
    const data = await res.json();
    if (res.status === 200 && data.url) {
      console.log(`[+] PASS: Admin image uploaded successfully. URL: ${data.url}`);
    } else {
      console.error(`[-] FAIL: Image upload failed. Status: ${res.status}, Error:`, data.error);
    }
  } catch (err) {
    console.error(`[-] FAIL: Image upload request failed: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log('        ADMIN VERIFICATION COMPLETED                ');
  console.log('====================================================\n');
}

testAdminLive();
