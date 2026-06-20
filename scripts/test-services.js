const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const { loadEnvConfig } = require('@next/env');
loadEnvConfig(path.join(__dirname, '..'));

async function runTests() {
  console.log('============================================');
  console.log('        UMERA COUTURE SERVICE TESTS         ');
  console.log('============================================\n');

  let mongoPassed = false;
  let cloudinaryPassed = false;
  let adminConfigPassed = false;

  // 1. Test MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('[-] MongoDB: MONGODB_URI environment variable is missing.');
  } else {
    try {
      console.log('[...] MongoDB: Connecting to database...');
      await mongoose.connect(MONGODB_URI, { bufferCommands: false });
      const dbName = mongoose.connection.name;
      console.log(`[+] MongoDB Connection: PASS (Database: "${dbName}")`);
      mongoPassed = true;
      await mongoose.connection.close();
    } catch (error) {
      console.error(`[-] MongoDB Connection: FAIL (${error.message})`);
    }
  }

  console.log('');

  // 2. Test Cloudinary Connection
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('[-] Cloudinary: Credentials missing in environment variables.');
  } else {
    try {
      console.log('[...] Cloudinary: Configuring and pinging API...');
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true
      });
      const result = await cloudinary.api.ping();
      if (result && result.status === 'ok') {
        console.log('[+] Cloudinary Connection: PASS');
        cloudinaryPassed = true;

        // Perform test upload
        console.log('[...] Cloudinary: Uploading 1x1 test image...');
        try {
          const uploadResult = await cloudinary.uploader.upload('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', {
            folder: 'test-folder'
          });
          if (uploadResult && uploadResult.secure_url) {
            console.log(`[+] Cloudinary Image Upload: PASS (URL: ${uploadResult.secure_url})`);
            
            // Connect to MongoDB and save image URL to a test product
            if (MONGODB_URI) {
              try {
                console.log('[...] MongoDB: Saving uploaded image URL to first available product...');
                await mongoose.connect(MONGODB_URI, { bufferCommands: false });
                const db = mongoose.connection.db;
                const product = await db.collection('products').findOne({});
                if (product) {
                  const originalImages = product.images || [];
                  const updatedImages = [...originalImages, uploadResult.secure_url];
                  await db.collection('products').updateOne(
                    { _id: product._id },
                    { $set: { images: updatedImages } }
                  );
                  console.log(`[+] MongoDB Save: PASS (Image URL successfully appended to product ID: ${product._id})`);
                  
                  // Fetch public page/details to verify it appears on the public side
                  console.log('[...] Next.js Server API check: Confirming image URL is visible on public API...');
                  try {
                    const port = process.env.PORT || 3000;
                    const publicProdUrl = `http://localhost:${port}/api/products/${product._id}`;
                    const prodResponse = await fetch(publicProdUrl);
                    const prodData = await prodResponse.json();
                    if (prodResponse.status === 200 && prodData && prodData.images && prodData.images.includes(uploadResult.secure_url)) {
                      console.log(`[+] Public Site Visibility Check: PASS (Uploaded image URL is returned by public API)`);
                    } else {
                      console.log(`[-] Public Site Visibility Check: FAIL (Image not found in public product data)`);
                    }
                  } catch (fetchErr) {
                    if (fetchErr.code === 'ECONNREFUSED') {
                      console.log('    Info: Local Next.js dev server is not running on port 3000. Skipping public API visibility check.');
                      console.log('    To run the visibility test: Start server with "npm run dev" first, then run "npm run test-services".');
                    } else {
                      console.log(`[-] Public Site Visibility Check: FAIL (${fetchErr.message})`);
                    }
                  }
                } else {
                  console.log('[-] MongoDB Save: FAIL (No products found in DB to attach the image to)');
                }
                await mongoose.connection.close();
              } catch (dbErr) {
                console.log(`[-] MongoDB Save: FAIL (${dbErr.message})`);
              }
            }
          } else {
            console.error('[-] Cloudinary Image Upload: FAIL (Did not return a valid secure_url)');
          }
        } catch (uploadErr) {
          console.error(`[-] Cloudinary Image Upload: FAIL (${uploadErr.message || JSON.stringify(uploadErr)})`);
        }
      } else {
        console.error(`[-] Cloudinary Connection: FAIL (Unexpected response: ${JSON.stringify(result)})`);
      }
    } catch (error) {
      const errMsg = error.error?.message || error.message || JSON.stringify(error);
      console.error(`[-] Cloudinary Connection: FAIL (${errMsg})`);
    }
  }

  console.log('');

  // 3. Test Admin Credentials Configuration
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminEmail || !adminPassword || !jwtSecret) {
    console.error('[-] Admin Configuration: Required environment variables (ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET) are missing.');
  } else {
    console.log('[+] Admin Configuration Variables: PASS (All variables are present)');
    adminConfigPassed = true;
    
    // Check password format (is it hashed?)
    if (adminPassword.startsWith('$2')) {
      console.log('    Note: ADMIN_PASSWORD is encrypted with bcrypt.');
    } else {
      console.log('    Warning: ADMIN_PASSWORD is in plain text. Consider hashing it for production.');
    }
  }

  console.log('');

  // 4. Local Server API Login Test
  console.log('[...] Admin Login API: Testing local Next.js API endpoint...');
  const port = process.env.PORT || 3000;
  const loginUrl = `http://localhost:${port}/api/admin/login`;

  try {
    const testPayload = {
      email: adminEmail || 'test@example.com',
      password: adminPassword && !adminPassword.startsWith('$2') ? adminPassword : 'wrong_password_or_hashed'
    };

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });

    const data = await response.json();
    if (response.status === 200 && data.success) {
      console.log('[+] Admin Login API: PASS (Successfully logged in with credentials)');
    } else if (response.status === 401 && data.error === 'Invalid credentials') {
      if (adminPassword && adminPassword.startsWith('$2')) {
        console.log('[+] Admin Login API: PASS (Endpoint returned 401 Unauthorized for hashed password, which is expected since plain text matching is required to log in)');
      } else {
        console.log(`[-] Admin Login API: FAIL (Invalid credentials returned for email "${adminEmail}")`);
      }
    } else {
      console.log(`[-] Admin Login API: FAIL (HTTP Status: ${response.status}, Error: ${data.error || 'Unknown'})`);
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('    Info: Local Next.js dev server is not running on port 3000. Skipping active API login request.');
      console.log('    To test the live API login: Start server using "npm run dev" and run "npm run test-services" in another terminal.');
    } else {
      console.log(`[-] Admin Login API: FAIL (${error.message})`);
    }
  }

  console.log('\n============================================');
  console.log('                TEST SUMMARY                ');
  console.log('============================================');
  console.log(`MongoDB Connection:      ${mongoPassed ? 'PASS' : 'FAIL'}`);
  console.log(`Cloudinary Connection:   ${cloudinaryPassed ? 'PASS' : 'FAIL'}`);
  console.log(`Admin Configuration:     ${adminConfigPassed ? 'PASS' : 'FAIL'}`);
  console.log('============================================\n');
}

runTests();
