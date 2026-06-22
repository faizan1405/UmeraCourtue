import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';

// POST /api/admin/revalidate — purge cached pages after admin changes
export async function POST(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Revalidate the entire site layout (all public pages)
    revalidatePath('/', 'layout');

    return NextResponse.json({ revalidated: true, timestamp: Date.now() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
