const path = require('path');
const mongoose = require('mongoose');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(path.join(__dirname, '..'));

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${process.env.PORT || 3000}`;

async function runTests() {
  console.log('====================================================');
  console.log('         UMERA COUTURE RAZORPAY TEST SUITE          ');
  console.log('====================================================\n');

  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('[-] MongoDB URI not configured in .env file.');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('[+] Connected to MongoDB:', mongoose.connection.name);

  // Fetch 'The Ivory Gown' to ensure it's priced for testing
  const db = mongoose.connection.db;
  const product = await db.collection('products').findOne({ name: 'The Ivory Gown' });
  if (!product) {
    console.error('[-] Test product "The Ivory Gown" not found in database.');
    await mongoose.connection.close();
    process.exit(1);
  }
  console.log(`[+] Test Product: "${product.name}", Price: "${product.price}", PriceOnRequest: ${product.priceOnRequest}`);

  const originalPrice = product.price;
  const originalPriceOnRequest = product.priceOnRequest;
  console.log('[...] Temporarily setting "The Ivory Gown" price to "₹5,000" and priceOnRequest to false for online checkout test...');
  await db.collection('products').updateOne({ _id: product._id }, { $set: { price: '₹5,000', priceOnRequest: false } });

  const testPayloadManual = {
    customerName: 'Faizan Test Manual',
    phone: '7774056979',
    email: 'faizan.test@gmail.com',
    address: '402 Charyana Heights',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380001',
    notes: 'Please expedite manual order',
    paymentMethod: 'manual',
    paymentProvider: 'manual',
    items: [
      {
        productId: product._id.toString(),
        productName: product.name,
        quantity: 1,
        unitPrice: '₹5,000',
        lineTotal: '₹5,000',
      }
    ],
    subtotal: '₹5,000',
    totalAmount: '₹5,000',
  };

  const testPayloadOnline = {
    ...testPayloadManual,
    customerName: 'Faizan Test Online',
    paymentMethod: 'online',
    paymentProvider: 'razorpay',
    notes: 'Please expedite online order',
  };

  let manualOrderId = null;
  let onlineOrderId = null;

  try {
    // Test Case 1: Manual Order Placement
    console.log('\n[TEST 1] Placing Manual Order...');
    const res1 = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayloadManual),
    });
    const order1 = await res1.json();
    if (res1.status === 201 && order1._id) {
      manualOrderId = order1._id;
      console.log(`[+] PASS: Manual Order created successfully. ID: ${manualOrderId}`);
      console.log(`    Total Amount: ${order1.totalAmount}, Payment Status: ${order1.paymentStatus}`);
    } else {
      console.error(`[-] FAIL: Manual Order creation failed. Status: ${res1.status}, Error:`, order1.error);
    }

    // Test Case 2: Online Order Local Creation
    console.log('\n[TEST 2] Placing Online Order Local Record...');
    const res2 = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayloadOnline),
    });
    const order2 = await res2.json();
    if (res2.status === 201 && order2._id) {
      onlineOrderId = order2._id;
      console.log(`[+] PASS: Online Order created successfully. ID: ${onlineOrderId}`);
      console.log(`    Total Amount: ${order2.totalAmount}, Payment Status: ${order2.paymentStatus}`);
    } else {
      console.error(`[-] FAIL: Online Order creation failed. Status: ${res2.status}, Error:`, order2.error);
    }

    // Test Case 3: Create Razorpay Order Backend API
    let razorpayOrderId = null;
    if (onlineOrderId) {
      console.log('\n[TEST 3] Generating Razorpay Order ID from Backend API...');
      const res3 = await fetch(`${BASE_URL}/api/payments/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: onlineOrderId }),
      });
      const rzpData = await res3.json();
      if (res3.status === 200 && rzpData.id) {
        razorpayOrderId = rzpData.id;
        console.log(`[+] PASS: Razorpay Order created. ID: ${razorpayOrderId}, Key ID: ${rzpData.keyId}`);
      } else {
        console.error(`[-] FAIL: Razorpay Order API failed. Status: ${res3.status}, Error:`, rzpData.error);
      }
    }

    // Test Case 4: Verify Payment Success (Mock Signature)
    if (onlineOrderId && razorpayOrderId) {
      console.log('\n[TEST 4] Verifying Payment Signature (Success Flow)...');
      const res4 = await fetch(`${BASE_URL}/api/payments/razorpay/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: onlineOrderId,
          razorpayOrderId: razorpayOrderId,
          razorpayPaymentId: 'pay_test_mock123',
          razorpaySignature: 'mock_signature',
        }),
      });
      const verifyData = await res4.json();
      if (res4.status === 200 && verifyData.success) {
        console.log('[+] PASS: Payment verified successfully on backend.');
        
        // Fetch order to confirm paid status
        const dbOrder = await db.collection('orders').findOne({ _id: new mongoose.Types.ObjectId(onlineOrderId) });
        console.log(`    DB Order Payment Status: ${dbOrder.paymentStatus}`);
        console.log(`    DB Order Razorpay Payment ID: ${dbOrder.razorpayPaymentId}`);
      } else {
        console.error(`[-] FAIL: Payment verification failed. Status: ${res4.status}, Error:`, verifyData.error);
      }
    }

    // Test Case 5: Duplicate Payment Verification Request
    if (onlineOrderId && razorpayOrderId) {
      console.log('\n[TEST 5] Testing Duplicate Payment Verification (Idempotency)...');
      const res5 = await fetch(`${BASE_URL}/api/payments/razorpay/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: onlineOrderId,
          razorpayOrderId: razorpayOrderId,
          razorpayPaymentId: 'pay_test_mock123',
          razorpaySignature: 'mock_signature',
        }),
      });
      const verifyData = await res5.json();
      if (res5.status === 200 && verifyData.success) {
        console.log('[+] PASS: Duplicate verification handled gracefully (returned success).');
      } else {
        console.error(`[-] FAIL: Duplicate verification failed. Status: ${res5.status}, Error:`, verifyData.error);
      }
    }

    // Test Case 6: Invalid Payment Signature
    let invalidSigOrderId = null;
    if (product) {
      console.log('\n[TEST 6] Testing Invalid Payment Signature Handling...');
      const res6a = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayloadOnline),
      });
      const order6a = await res6a.json();
      invalidSigOrderId = order6a._id;
      
      const res6b = await fetch(`${BASE_URL}/api/payments/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: invalidSigOrderId }),
      });
      const rzpData = await res6b.json();

      const res6c = await fetch(`${BASE_URL}/api/payments/razorpay/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: invalidSigOrderId,
          razorpayOrderId: rzpData.id,
          razorpayPaymentId: 'pay_test_mock456',
          razorpaySignature: 'completely_invalid_signature',
        }),
      });
      const verifyData = await res6c.json();
      if (res6c.status === 400 && !verifyData.success) {
        console.log('[+] PASS: Rejecting invalid signature correctly returned 400.');
        const dbOrder = await db.collection('orders').findOne({ _id: new mongoose.Types.ObjectId(invalidSigOrderId) });
        console.log(`    DB Order Payment Status: ${dbOrder.paymentStatus}`);
      } else {
        console.error(`[-] FAIL: Invalid signature was not rejected. Status: ${res6c.status}`);
      }
    }

    // Test Case 7: Mismatched Order IDs
    if (onlineOrderId && razorpayOrderId) {
      console.log('\n[TEST 7] Testing Razorpay Order ID Mismatch...');
      const res7 = await fetch(`${BASE_URL}/api/payments/razorpay/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: onlineOrderId,
          razorpayOrderId: 'order_some_mismatched_id_123',
          razorpayPaymentId: 'pay_test_mock789',
          razorpaySignature: 'mock_signature',
        }),
      });
      const verifyData = await res7.json();
      if (res7.status === 400 && verifyData.error === 'Razorpay Order ID mismatch') {
        console.log('[+] PASS: Order ID mismatch rejected correctly.');
      } else {
        console.error(`[-] FAIL: Order ID mismatch was not rejected. Status: ${res7.status}, Error:`, verifyData.error);
      }
    }

    // Clean up test orders from database
    console.log('\nCleaning up test orders from MongoDB...');
    const cleanupIds = [manualOrderId, onlineOrderId, invalidSigOrderId].filter(Boolean).map(id => new mongoose.Types.ObjectId(id));
    if (cleanupIds.length > 0) {
      const delRes = await db.collection('orders').deleteMany({ _id: { $in: cleanupIds } });
      console.log(`[+] Cleanup complete. Deleted ${delRes.deletedCount} test orders.`);
    }

  } catch (error) {
    console.error('\n[-] Execution error during tests:', error.message);
    console.log('    Ensure Next.js development server is running ("npm run dev") before running this test.');
  } finally {
    if (product) {
      console.log('Restoring original product pricing for "The Ivory Gown"...');
      await db.collection('products').updateOne({ _id: product._id }, { $set: { price: originalPrice, priceOnRequest: originalPriceOnRequest } });
      console.log('[+] Restored successfully.');
    }
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    console.log('====================================================');
  }
}

runTests();
