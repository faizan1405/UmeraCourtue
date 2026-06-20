import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Settings from '@/models/Settings';
import Policy from '@/models/Policy';
import { verifyAdmin } from '@/lib/auth';

// POST /api/admin/seed — one-time seed data
export async function POST(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // 1. Seed categories (upsert based on slug)
    const categoriesData = [
      { name: 'New Arrivals', slug: 'new-arrivals', description: 'Latest additions to our collection', sortOrder: 1 },
      { name: 'Festive Wear', slug: 'festive-wear', description: 'Celebrate in style with our festive collection', sortOrder: 2 },
      { name: 'Casual Elegance', slug: 'casual-elegance', description: 'Everyday luxury pieces', sortOrder: 3 },
      { name: 'Formal Wear', slug: 'formal-wear', description: 'Sophisticated pieces for formal occasions', sortOrder: 4 },
      { name: 'Custom Couture', slug: 'custom-couture', description: 'Bespoke pieces crafted exclusively for you', sortOrder: 5 },
    ];

    for (const cat of categoriesData) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        cat,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // 2. Seed products (upsert based on slug)
    const productsData = [
      {
        name: 'The Ivory Gown',
        slug: 'the-ivory-gown',
        category: 'festive-wear',
        price: '',
        priceOnRequest: true,
        shortDescription: 'A breathtaking masterpiece of modern couture.',
        fullDescription: 'A breathtaking masterpiece of modern couture. This gown features delicate hand-embroidery, a sweeping train, and is crafted from the finest pure silk organza. Perfect for high-end events and bridal occasions.',
        fabricDetails: '100% Silk Organza, Pearl Embellishments, Silk Crepe Lining',
        sizes: ['XS', 'S', 'M', 'L', 'Custom'],
        colors: ['Ivory'],
        careInstructions: 'Dry clean only. Store in provided garment bag away from direct sunlight.',
        stockStatus: 'in_stock',
        images: ['/product_1.png'],
        isFeatured: true,
        isNewArrival: true,
        sortOrder: 1,
      },
      {
        name: 'Champagne Elegance',
        slug: 'champagne-elegance',
        category: 'formal-wear',
        price: '',
        priceOnRequest: true,
        shortDescription: 'Timeless sophistication in champagne hues.',
        fullDescription: 'An enchanting ensemble that exudes grace and refinement. Crafted from premium silk with intricate detailing.',
        fabricDetails: 'Premium Silk, Hand-embroidered Details',
        sizes: ['S', 'M', 'L', 'Custom'],
        colors: ['Champagne'],
        careInstructions: 'Dry clean only.',
        stockStatus: 'in_stock',
        images: ['/product_2.png'],
        isFeatured: true,
        isNewArrival: true,
        sortOrder: 2,
      },
      {
        name: 'Midnight Noir Dress',
        slug: 'midnight-noir-dress',
        category: 'formal-wear',
        price: '',
        priceOnRequest: true,
        shortDescription: 'Bold elegance in deep midnight tones.',
        fullDescription: 'A striking piece that commands attention. The Midnight Noir Dress features clean lines and sophisticated tailoring.',
        fabricDetails: 'Pure Crepe, Satin Lining',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Black'],
        careInstructions: 'Dry clean only.',
        stockStatus: 'in_stock',
        images: ['/product_1.png'],
        isFeatured: false,
        isNewArrival: true,
        sortOrder: 3,
      },
      {
        name: 'Blush Dream Couture',
        slug: 'blush-dream-couture',
        category: 'festive-wear',
        price: '',
        priceOnRequest: true,
        shortDescription: 'Delicate blush tones for the romantic soul.',
        fullDescription: 'A dreamy creation in soft blush tones, featuring delicate lacework and flowing silhouettes.',
        fabricDetails: 'French Lace, Organza Overlay',
        sizes: ['Custom Only'],
        colors: ['Blush Pink'],
        careInstructions: 'Dry clean only.',
        stockStatus: 'made_to_order',
        images: ['/product_2.png'],
        isFeatured: true,
        isNewArrival: false,
        sortOrder: 4,
      },
      {
        name: 'Golden Aura Ensemble',
        slug: 'golden-aura-ensemble',
        category: 'festive-wear',
        price: '',
        priceOnRequest: true,
        shortDescription: 'Radiant gold for festive celebrations.',
        fullDescription: 'A stunning ensemble that captures the essence of celebration with golden embellishments and luxurious fabrics.',
        fabricDetails: 'Silk Brocade, Gold Thread Embroidery',
        sizes: ['S', 'M', 'L'],
        colors: ['Gold'],
        careInstructions: 'Dry clean only.',
        stockStatus: 'in_stock',
        images: ['/product_1.png'],
        isFeatured: false,
        isNewArrival: false,
        sortOrder: 5,
      },
      {
        name: 'Pearl Embroidered Dress',
        slug: 'pearl-embroidered-dress',
        category: 'casual-elegance',
        price: '',
        priceOnRequest: true,
        shortDescription: 'Pearls meet modern design.',
        fullDescription: 'An exquisite dress adorned with hand-stitched pearl embroidery, perfect for intimate gatherings.',
        fabricDetails: 'Georgette, Pearl Embellishments',
        sizes: ['XS', 'S', 'M'],
        colors: ['Off White'],
        careInstructions: 'Dry clean only.',
        stockStatus: 'in_stock',
        images: ['/product_2.png'],
        isFeatured: false,
        isNewArrival: true,
        sortOrder: 6,
      },
    ];

    for (const prod of productsData) {
      await Product.findOneAndUpdate(
        { slug: prod.slug },
        prod,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // 3. Seed settings (upsert single document)
    const settingsData = {
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
    };

    await Settings.findOneAndUpdate(
      {},
      settingsData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 4. Seed policies (upsert based on type)
    const policiesData = [
      {
        type: 'privacy',
        title: 'Privacy Policy',
        content: `<p>At Umera Couture, we value your privacy and are committed to protecting your personal information.</p>
<h3>Information We Collect</h3>
<p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, and measurement details for custom tailoring.</p>
<h3>How We Use Your Information</h3>
<p>We use the information we collect to fulfill your custom orders, provide customer service, and communicate with you about products, services, offers, and promotions from Umera Couture.</p>`,
      },
      {
        type: 'terms',
        title: 'Terms & Conditions',
        content: `<p>Welcome to Umera Couture. By accessing or using our website, you agree to be bound by these terms.</p>
<h3>Custom Orders</h3>
<p>All custom couture pieces require a 50% advance payment before production begins. Because these items are tailored to your specific measurements, custom orders cannot be cancelled once production has started.</p>
<h3>Product Variations</h3>
<p>Due to the handcrafted nature of our garments and variations in display screens, slight variations in color and embellishment placement may occur. These are not considered defects but rather part of the unique beauty of couture.</p>`,
      },
      {
        type: 'shipping',
        title: 'Shipping & Returns',
        content: `<h3>Shipping Policy</h3>
<p>We offer worldwide shipping. Ready-to-wear pieces are dispatched within 3-5 business days. Custom couture pieces require 3-6 weeks for production, depending on the complexity of the design. You will be notified of the estimated delivery timeline during your WhatsApp consultation.</p>
<h3>Return Policy</h3>
<p>For ready-to-wear items, we accept returns within 7 days of delivery, provided the item is unworn, unwashed, and in its original condition with all tags attached. <strong>Please note that custom-tailored pieces are final sale and cannot be returned or exchanged.</strong></p>`,
      },
      {
        type: 'sizeGuide',
        title: 'Size Guide',
        content: `<p>Please use the following chart to find your perfect fit. If your measurements fall between sizes, we recommend ordering the larger size or contacting us for a custom fit.</p>
<table><thead><tr><th>Size</th><th>UK/AU</th><th>US</th><th>Bust (in)</th><th>Waist (in)</th><th>Hips (in)</th></tr></thead><tbody><tr><td>XS</td><td>6</td><td>2</td><td>32</td><td>24</td><td>35</td></tr><tr><td>S</td><td>8</td><td>4</td><td>34</td><td>26</td><td>37</td></tr><tr><td>M</td><td>10</td><td>6</td><td>36</td><td>28</td><td>39</td></tr><tr><td>L</td><td>12</td><td>8</td><td>38</td><td>30</td><td>41</td></tr></tbody></table>
<p>We offer custom tailoring for the perfect fit. Simply select "Custom" when adding an item to your bag, and our team will reach out via WhatsApp to guide you through the measurement process.</p>`,
      },
    ];

    for (const pol of policiesData) {
      await Policy.findOneAndUpdate(
        { type: pol.type },
        pol,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return NextResponse.json({
      message: 'Seed data inserted/updated successfully',
      categories: await Category.countDocuments(),
      products: await Product.countDocuments(),
      settings: await Settings.countDocuments(),
      policies: await Policy.countDocuments(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
