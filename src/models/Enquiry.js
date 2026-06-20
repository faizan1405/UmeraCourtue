import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema({
  customerName: { type: String, default: '' },
  phone: { type: String, default: '' },
  items: [{
    productName: { type: String, default: '' },
    size: { type: String, default: '' },
    color: { type: String, default: '' },
    quantity: { type: Number, default: 1 },
  }],
  status: {
    type: String,
    enum: ['new', 'contacted', 'confirmed', 'completed', 'cancelled'],
    default: 'new',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
