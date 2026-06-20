const path = require('path');
const mongoose = require('mongoose');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(path.join(__dirname, '..'));

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in the environment or .env file.');
  process.exit(1);
}

// Define Schema
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

async function addProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('Connected to DB.');

    const newProducts = [
      {
        name: 'Pink Tiered Maxi Dress',
        slug: 'pink-tiered-maxi-dress',
        category: 'casual-elegance',
        price: '₹8,500',
        priceOnRequest: false,
        shortDescription: 'Vibrant pink tiered maxi dress with puff sleeves.',
        fullDescription: 'A vibrant and comfortable pink tiered maxi dress featuring elegant puff sleeves. Perfect for casual outings and semi-formal daytime events.',
        fabricDetails: 'Cotton Blend',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Hot Pink'],
        careInstructions: 'Machine wash cold. Tumble dry low.',
        stockStatus: 'in_stock',
        images: ['/product_1.png'], // Placeholder
        isNewArrival: true,
        isVisible: true,
        sortOrder: 10
      },
      {
        name: 'Lilac Embroidered Kurta Set',
        slug: 'lilac-embroidered-kurta-set',
        category: 'festive-wear',
        price: '₹18,500',
        priceOnRequest: false,
        shortDescription: 'Elegant lilac kurta with delicate white embroidery.',
        fullDescription: 'An elegant lilac high-low kurta featuring intricate white floral embroidery on the bodice and pearl detailing on the sleeves. Paired with comfortable white trousers with tassel details.',
        fabricDetails: 'Chanderi Silk / Cotton',
        sizes: ['S', 'M', 'L', 'XL', 'Custom'],
        colors: ['Lilac'],
        careInstructions: 'Dry clean only.',
        stockStatus: 'in_stock',
        images: ['/product_2.png'], // Placeholder
        isNewArrival: true,
        isVisible: true,
        sortOrder: 11
      },
      {
        name: 'Mustard Embroidered Kurta Set',
        slug: 'mustard-embroidered-kurta-set',
        category: 'festive-wear',
        price: '₹22,000',
        priceOnRequest: false,
        shortDescription: 'Vibrant mustard kurta set with blue and white floral embroidery.',
        fullDescription: 'A vibrant mustard yellow kurta set featuring stunning blue and white floral embroidery on the neckline and scattered motifs. Comes with matching embroidered pants and a beautifully detailed dupatta.',
        fabricDetails: 'Georgette / Crape',
        sizes: ['S', 'M', 'L', 'XL', 'Custom'],
        colors: ['Mustard Yellow'],
        careInstructions: 'Dry clean only.',
        stockStatus: 'in_stock',
        images: ['/product_1.png'], // Placeholder
        isFeatured: true,
        isNewArrival: true,
        isVisible: true,
        sortOrder: 12
      }
    ];

    for (const prod of newProducts) {
      await Product.findOneAndUpdate(
        { slug: prod.slug },
        prod,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`Added/Updated: ${prod.name}`);
    }

    console.log('Successfully added new products.');
  } catch (err) {
    console.error('Error adding products:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

addProducts();
