const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const { loadEnvConfig } = require('@next/env');
loadEnvConfig(path.join(__dirname, '..'));

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in the environment or .env file.');
  process.exit(1);
}

// Define Schemas & Models
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  bannerImage: { type: String, default: '' },
  isVisible: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: '' },
  price: { type: String, default: '' },
  priceOnRequest: { type: Boolean, default: true },
  shortDescription: { type: String, default: '' },
  fullDescription: { type: String, default: '' },
  fabricDetails: { type: String, default: '' },
  sizes: { type: [String], default: [] },
  colors: { type: [String], default: [] },
  careInstructions: { type: String, default: '' },
  stockStatus: {
    type: String,
    enum: ['in_stock', 'out_of_stock', 'made_to_order'],
    default: 'in_stock',
  },
  images: { type: [String], default: [] },
  whatsappMessage: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const SettingsSchema = new mongoose.Schema({
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  instagram: { type: String, default: '' },
  heroBanner: { type: String, default: '' },
  heroHeading: { type: String, default: '' },
  heroSubtitle: { type: String, default: '' },
  heroButton1Text: { type: String, default: '' },
  heroButton1Link: { type: String, default: '' },
  heroButton2Text: { type: String, default: '' },
  heroButton2Link: { type: String, default: '' },
  featuredHeading: { type: String, default: '' },
  featuredSubtitle: { type: String, default: '' },
  aboutHeading: { type: String, default: '' },
  aboutText: { type: String, default: '' },
  announcementText: { type: String, default: '' },
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

const PolicySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['privacy', 'terms', 'shipping', 'sizeGuide'],
    required: true,
    unique: true,
  },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
}, { timestamps: true });

const Policy = mongoose.models.Policy || mongoose.model('Policy', PolicySchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB database...');
    // Connect without exposing connection string
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    console.log(`Successfully connected to database: "${mongoose.connection.name}"`);

    // 1. Seed categories (upsert based on slug)
    const categoriesData = [
      { name: 'New Arrivals', slug: 'new-arrivals', description: 'Latest additions to our collection', sortOrder: 1 },
      { name: 'Festive Wear', slug: 'festive-wear', description: 'Celebrate in style with our festive collection', sortOrder: 2 },
      { name: 'Casual Elegance', slug: 'casual-elegance', description: 'Everyday luxury pieces', sortOrder: 3 },
      { name: 'Formal Wear', slug: 'formal-wear', description: 'Sophisticated pieces for formal occasions', sortOrder: 4 },
      { name: 'Custom Couture', slug: 'custom-couture', description: 'Bespoke pieces crafted exclusively for you', sortOrder: 5 },
    ];

    console.log('Seeding categories...');
    for (const cat of categoriesData) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        cat,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log('Categories seeded successfully.');

    // 2. Seed products (upsert based on slug)
    const productsData = [
      {
        name: 'The Ivory Gown',
        slug: 'the-ivory-gown',
        category: 'festive-wear',
        price: '₹45,000',
        priceOnRequest: false,
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
        price: '₹38,000',
        priceOnRequest: false,
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
        price: '₹28,000',
        priceOnRequest: false,
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
        price: '₹42,000',
        priceOnRequest: false,
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
        price: '₹32,000',
        priceOnRequest: false,
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

    console.log('Seeding products...');
    for (const prod of productsData) {
      await Product.findOneAndUpdate(
        { slug: prod.slug },
        prod,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log('Products seeded successfully.');

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

    console.log('Seeding settings...');
    await Settings.findOneAndUpdate(
      {},
      settingsData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('Settings seeded successfully.');

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

    console.log('Seeding policies...');
    for (const pol of policiesData) {
      await Policy.findOneAndUpdate(
        { type: pol.type },
        pol,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log('Policies seeded successfully.');

    const stats = {
      categories: await Category.countDocuments(),
      products: await Product.countDocuments(),
      settings: await Settings.countDocuments(),
      policies: await Policy.countDocuments(),
    };
    console.log('\n--- Seeding Statistics ---');
    console.log(`Categories: ${stats.categories}`);
    console.log(`Products: ${stats.products}`);
    console.log(`Settings: ${stats.settings}`);
    console.log(`Policies: ${stats.policies}`);
    console.log('Database seeding completed successfully.\n');
  } catch (error) {
    console.error('Seeding failed with error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

seed();
