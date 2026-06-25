const path = require('path');
const mongoose = require('mongoose');

const { loadEnvConfig } = require('@next/env');
loadEnvConfig(path.join(__dirname, '..'));

const MONGODB_URI = process.env.MONGODB_URI;

const ProductSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const slugs = [
      'hot-pink-tiered-maxi-dress',
      'lavender-embroidered-kaftan-kurta',
      'mustard-embroidered-suit-set-dupatta',
      'baby-pink-kurta-set'
    ];

    const result = await Product.updateMany(
      { slug: { $in: slugs } },
      { $set: { isVisible: true } }
    );
    
    console.log(`Updated ${result.modifiedCount} products to be visible.`);

  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.connection.close();
  }
}

run();
