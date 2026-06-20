import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Policy from '@/models/Policy';
import { verifyAdmin } from '@/lib/auth';

// GET /api/policies
export async function GET() {
  try {
    await connectDB();
    const policies = await Policy.find({});
    return NextResponse.json(policies);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/policies — update a policy by type
export async function PATCH(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { type, title, content } = body;

    if (!type) {
      return NextResponse.json({ error: 'Policy type is required' }, { status: 400 });
    }

    const policy = await Policy.findOneAndUpdate(
      { type },
      { title, content },
      { new: true, upsert: true, runValidators: true }
    );
    return NextResponse.json(policy);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
