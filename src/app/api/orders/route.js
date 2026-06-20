import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Server validation
    const { customerName, phone, email, address, city, state, pincode, items } = body;
    if (!customerName || !phone || !email || !address || !city || !state || !pincode || !items?.length) {
      return NextResponse.json({ error: 'Missing required shipping details or empty cart' }, { status: 400 });
    }

    let calculatedTotal = 0;
    let containsPriceOnRequest = false;
    const validatedItems = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return NextResponse.json({ error: `Invalid Product ID format: ${item.productId}` }, { status: 400 });
      }

      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) {
        return NextResponse.json({ error: `Product not found: ${item.productName || item.productId}` }, { status: 404 });
      }

      let unitPriceVal = 'Price on Request';
      let lineTotalVal = 'Price on Request';

      if (dbProduct.priceOnRequest || dbProduct.price === 'Price on Request' || !dbProduct.price) {
        containsPriceOnRequest = true;
      } else {
        const cleanedPrice = parseFloat(dbProduct.price.toString().replace(/[^\d.]/g, ''));
        if (isNaN(cleanedPrice)) {
          containsPriceOnRequest = true;
        } else {
          calculatedTotal += cleanedPrice * item.quantity;
          unitPriceVal = `₹${cleanedPrice.toLocaleString('en-IN')}`;
          lineTotalVal = `₹${(cleanedPrice * item.quantity).toLocaleString('en-IN')}`;
        }
      }

      validatedItems.push({
        productId: item.productId,
        productName: dbProduct.name,
        productImage: dbProduct.images?.[0] || item.productImage || '',
        size: item.size || '',
        color: item.color || '',
        quantity: item.quantity,
        unitPrice: unitPriceVal,
        lineTotal: lineTotalVal,
      });
    }

    if (containsPriceOnRequest) {
      return NextResponse.json({ error: 'Cannot check out with items missing a price. Please contact support.' }, { status: 400 });
    }

    const finalSubtotal = `₹${calculatedTotal.toLocaleString('en-IN')}`;
    const finalTotalAmount = `₹${calculatedTotal.toLocaleString('en-IN')}`;
    const finalPaymentMethod = body.paymentMethod || 'online';
    const finalPaymentProvider = body.paymentProvider || 'razorpay';

    const order = await Order.create({
      customerName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      notes: body.notes || '',
      items: validatedItems,
      subtotal: finalSubtotal,
      totalAmount: finalTotalAmount,
      paymentMethod: finalPaymentMethod,
      paymentProvider: finalPaymentProvider,
      paymentStatus: 'pending',
      orderStatus: 'pending',
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

