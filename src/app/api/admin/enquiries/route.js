import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import { verifyAdmin } from '@/lib/auth';

// GET /api/admin/enquiries
export async function GET(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query = status ? { status } : {};
    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });
    return NextResponse.json(enquiries);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
