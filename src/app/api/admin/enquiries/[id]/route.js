import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import { verifyAdmin } from '@/lib/auth';

// PATCH /api/admin/enquiries/[id]
export async function PATCH(request, { params }) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const enquiry = await Enquiry.findByIdAndUpdate(id, body, { new: true });
    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }
    return NextResponse.json(enquiry);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
