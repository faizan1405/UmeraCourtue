import mongoose from 'mongoose';

const PolicySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['privacy', 'terms', 'shipping', 'sizeGuide'],
    required: true,
    unique: true,
  },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
}, {
  timestamps: true,
});

export default mongoose.models.Policy || mongoose.model('Policy', PolicySchema);
