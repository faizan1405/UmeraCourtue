import mongoose from 'mongoose';

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
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
