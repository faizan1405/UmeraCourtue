import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Server validation
    const { customerName, phone, email, address, city, state, pincode, items } = body;
    if (!customerName || !phone || !email || !address || !city || !state || !pincode || !items?.length) {
      return NextResponse.json({ error: 'Missing required shipping details or empty cart' }, { status: 400 });
    }

    const order = await Order.create({
      customerName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      notes: body.notes || '',
      items,
      subtotal: body.subtotal || '',
      totalAmount: body.totalAmount || '',
      paymentMethod: body.paymentMethod || 'manual',
      paymentProvider: body.paymentProvider || 'manual',
      paymentStatus: 'pending',
      orderStatus: 'pending',
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
