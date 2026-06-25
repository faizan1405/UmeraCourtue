const path = require('path');
const mongoose = require('mongoose');

const { loadEnvConfig } = require('@next/env');
loadEnvConfig(path.join(__dirname, '..'));

const MONGODB_URI = process.env.MONGODB_URI;

const ProductSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  price: { type: String, default: '' },
  priceOnRequest: { type: Boolean, default: true },
  sizes: { type: [String], default: [] },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const updates = [
      {
        slug: 'hot-pink-tiered-maxi-dress',
        price: '₹32,000',
        priceOnRequest: false,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom']
      },
      {
        slug: 'lavender-embroidered-kaftan-kurta',
        price: '₹24,000',
        priceOnRequest: false,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom']
      },
      {
        slug: 'mustard-embroidered-suit-set-dupatta',
        price: '₹38,000',
        priceOnRequest: false,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom']
      },
      {
        slug: 'baby-pink-kurta-set',
        price: '₹22,000',
        priceOnRequest: false,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom']
      }
    ];

    let modified = 0;
    for (const update of updates) {
      const result = await Product.updateOne(
        { slug: update.slug },
        { 
          $set: { 
            price: update.price, 
            priceOnRequest: update.priceOnRequest,
            sizes: update.sizes
          } 
        }
      );
      if (result.modifiedCount > 0) modified++;
    }
    
    console.log(`Updated ${modified} products with pricing and sizes.`);

  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.connection.close();
  }
}

run();
