const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const { loadEnvConfig } = require('@next/env');
loadEnvConfig(path.join(__dirname, '..'));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const MONGODB_URI = process.env.MONGODB_URI;

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

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder: 'umera_products' });
    return result.secure_url;
  } catch (err) {
    console.error('Error uploading image', filePath, err);
    throw err;
  }
};

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    // Create categories
    const categories = [
      { name: 'Dresses', slug: 'dresses' },
      { name: 'Kurtas', slug: 'kurtas' },
      { name: 'Suit Sets', slug: 'suit-sets' },
      { name: 'Kurta Sets', slug: 'kurta-sets' }
    ];

    for (const cat of categories) {
      await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    console.log('Categories ensured');

    // Images
    const imgLavender = 'C:\\Users\\Faiza\\.gemini\\antigravity-ide\\brain\\3c6304a0-e259-445e-8dcf-d03dc48d9fe6\\media__1782390070442.jpg';
    const imgMustardSide = 'C:\\Users\\Faiza\\.gemini\\antigravity-ide\\brain\\3c6304a0-e259-445e-8dcf-d03dc48d9fe6\\media__1782390070467.jpg';
    const imgMustardNeckline = 'C:\\Users\\Faiza\\.gemini\\antigravity-ide\\brain\\3c6304a0-e259-445e-8dcf-d03dc48d9fe6\\media__1782390070490.jpg';
    const imgHotPink = 'C:\\Users\\Faiza\\.gemini\\antigravity-ide\\brain\\3c6304a0-e259-445e-8dcf-d03dc48d9fe6\\media__1782390070538.jpg';
    const imgMustardFull = 'C:\\Users\\Faiza\\.gemini\\antigravity-ide\\brain\\3c6304a0-e259-445e-8dcf-d03dc48d9fe6\\media__1782390070550.jpg';

    // Upload
    console.log('Uploading images...');
    const urlLavender = await uploadImage(imgLavender);
    const urlMustardSide = await uploadImage(imgMustardSide);
    const urlMustardNeckline = await uploadImage(imgMustardNeckline);
    const urlHotPink = await uploadImage(imgHotPink);
    const urlMustardFull = await uploadImage(imgMustardFull);
    console.log('Upload complete');

    const products = [
      {
        name: 'Hot Pink Tiered Maxi Dress',
        slug: 'hot-pink-tiered-maxi-dress',
        category: 'dresses',
        isNewArrival: true,
        colors: ['Hot Pink', 'Magenta'],
        fullDescription: 'Elegant flowy tiered maxi dress with puff sleeves and soft festive styling.',
        shortDescription: 'Elegant flowy tiered maxi dress with puff sleeves and soft festive styling.',
        images: [urlHotPink],
        isVisible: false,
        priceOnRequest: true
      },
      {
        name: 'Lavender Embroidered Kaftan Kurta',
        slug: 'lavender-embroidered-kaftan-kurta',
        category: 'kurtas',
        isNewArrival: true,
        colors: ['Lavender'],
        fullDescription: 'Soft lavender embroidered kaftan-style kurta with delicate neckline detailing.',
        shortDescription: 'Soft lavender embroidered kaftan-style kurta with delicate neckline detailing.',
        images: [urlLavender],
        isVisible: false,
        priceOnRequest: true
      },
      {
        name: 'Mustard Embroidered Suit Set with Dupatta',
        slug: 'mustard-embroidered-suit-set-dupatta',
        category: 'suit-sets',
        isNewArrival: true,
        colors: ['Mustard'],
        fullDescription: 'Mustard embroidered ethnic suit set with dupatta, detailed neckline work and elegant festive finish.',
        shortDescription: 'Mustard embroidered ethnic suit set with dupatta, detailed neckline work and elegant festive finish.',
        images: [urlMustardFull, urlMustardNeckline, urlMustardSide],
        isVisible: false,
        priceOnRequest: true
      },
      {
        name: 'Baby Pink Kurta Set',
        slug: 'baby-pink-kurta-set',
        category: 'kurta-sets',
        isNewArrival: true,
        colors: ['Baby Pink'],
        fullDescription: 'Light pink kurta set with simple embroidery detail and comfortable everyday festive styling.',
        shortDescription: 'Light pink kurta set with simple embroidery detail and comfortable everyday festive styling.',
        images: [], // Missing image
        isVisible: false,
        priceOnRequest: true
      }
    ];

    for (const prod of products) {
      await Product.findOneAndUpdate({ slug: prod.slug }, prod, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    console.log('Products inserted');

  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.connection.close();
  }
}

run();
