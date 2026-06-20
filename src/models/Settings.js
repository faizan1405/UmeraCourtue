import mongoose from 'mongoose';

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
}, {
  timestamps: true,
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
