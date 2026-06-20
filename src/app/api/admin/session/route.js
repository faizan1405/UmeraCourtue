import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';

// GET /api/admin/session
export async function GET(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, email: admin.email });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
