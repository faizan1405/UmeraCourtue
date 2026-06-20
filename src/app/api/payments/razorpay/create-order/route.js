import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    await connectDB();
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId parameter' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: 'Invalid orderId format' }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order is already paid to prevent duplicate processing
    if (order.paymentStatus === 'paid') {
      return NextResponse.json({ error: 'This order has already been paid' }, { status: 400 });
    }

    // Convert amount to paise. Handle "Price on Request"
    if (order.totalAmount === 'Price on Request' || !order.totalAmount) {
      return NextResponse.json({ error: 'Cannot pay online for Price on Request items' }, { status: 400 });
    }

    const cleanedAmount = parseFloat(order.totalAmount.toString().replace(/[^\d.]/g, ''));
    if (isNaN(cleanedAmount) || cleanedAmount <= 0) {
      return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    const amountInPaise = Math.round(cleanedAmount * 100);

    // Call Razorpay API using native fetch
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay keys not configured on server' }, { status: 500 });
    }

    let data;
    if (keyId === 'rzp_test_DUMMYKEY123') {
      // Mock order generation for testing
      data = {
        id: `order_mock_${Math.random().toString(36).substring(2, 11)}`,
        amount: amountInPaise,
        currency: 'INR',
      };
    } else {
      const authString = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authString}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: orderId.toString(),
        }),
      });

      data = await response.json();
      if (!response.ok) {
        return NextResponse.json({ error: data.error?.description || 'Razorpay order creation failed' }, { status: response.status });
      }
    }

    // Update local order with Razorpay Order ID
    order.razorpayOrderId = data.id;
    order.paymentProvider = 'razorpay';
    order.paymentMethod = 'online';
    await order.save();

    return NextResponse.json({
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: keyId,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
