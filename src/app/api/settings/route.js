import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { verifyAdmin } from '@/lib/auth';

// GET /api/settings
export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne({});
    if (!settings) {
      // Return defaults if no settings document exists yet
      return NextResponse.json({
        phone: '7774056979',
        whatsapp: '7774056979',
        email: 'umeracouture@gmail.com',
        address: '402, 5th Floor, Charyana Heights, Beside Italian Bakery, Raikhad, Ahmedabad, Gujarat - 380001',
        instagram: '',
        heroBanner: '/hero_banner.png',
        heroHeading: 'Modern Elegance',
        heroSubtitle: 'Discover the new era of luxury couture pieces crafted for the sophisticated.',
        heroButton1Text: 'Shop Collection',
        heroButton1Link: '/collections',
        heroButton2Text: 'Book Custom Order',
        heroButton2Link: '',
        featuredHeading: 'Curated Collections',
        featuredSubtitle: 'Explore our exclusive ranges of high-end fashion',
        aboutHeading: 'The Umera Story',
        aboutText: '"Umera Couture is a celebration of timeless elegance, refined craftsmanship, and modern sophistication. We create thoughtfully designed pieces that blend luxury with individuality, ensuring every outfit tells a story of confidence, grace, and style."',
        announcementText: 'Luxury Couture Pieces | Custom Orders Available',
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/settings
export async function PATCH(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const settings = await Settings.findOneAndUpdate(
      {},
      body,
      { new: true, upsert: true, runValidators: true }
    );
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
