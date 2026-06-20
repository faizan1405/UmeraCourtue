import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';

// POST /api/enquiries — public endpoint for WhatsApp checkout
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { customerName, phone, items } = body;
    
    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
    }
    
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const enquiry = await Enquiry.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      items: items || [],
      status: 'new',
    });
    
    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

