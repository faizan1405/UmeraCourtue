import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';

// POST /api/enquiries — public endpoint for WhatsApp checkout
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const enquiry = await Enquiry.create({
      customerName: body.customerName || '',
      phone: body.phone || '',
      items: body.items || [],
      status: 'new',
    });
    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
