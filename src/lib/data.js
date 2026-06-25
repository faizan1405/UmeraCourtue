import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Settings from '@/models/Settings';
import Policy from '@/models/Policy';
import Enquiry from '@/models/Enquiry';

const PRODUCT_LIST_FIELDS = '_id name slug price priceOnRequest images category sizes colors isFeatured isNewArrival isVisible shortDescription sortOrder createdAt stockStatus tags fullDescription fabricDetails whatsappMessage careInstructions';

export const getProducts = cache(async function getProducts(filters = {}) {
  await connectDB();
  const query = { isVisible: true, ...filters };
  return Product.find(query).select(PRODUCT_LIST_FIELDS).sort({ sortOrder: 1, createdAt: -1 }).lean();
});

export const getAllProducts = unstable_cache(async function getAllProducts() {
  await connectDB();
  return Product.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean();
}, ['all-products'], { revalidate: 60, tags: ['products'] });

export const getProduct = cache(async function getProduct(id) {
  await connectDB();
  return Product.findById(id).lean();
});

export const getProductBySlug = unstable_cache(async function getProductBySlug(slug) {
  await connectDB();
  return Product.findOne({ slug, isVisible: true }).lean();
}, ['product-by-slug'], { revalidate: 60, tags: ['products'] });

export const getFeaturedProducts = unstable_cache(async function getFeaturedProducts() {
  await connectDB();
  return Product.find({ isFeatured: true, isVisible: true }).select(PRODUCT_LIST_FIELDS).sort({ sortOrder: 1 }).lean();
}, ['featured-products'], { revalidate: 60, tags: ['products'] });

export const getNewArrivals = unstable_cache(async function getNewArrivals() {
  await connectDB();
  return Product.find({ isNewArrival: true, isVisible: true }).select(PRODUCT_LIST_FIELDS).sort({ createdAt: -1 }).lean();
}, ['new-arrivals'], { revalidate: 60, tags: ['products'] });

export const getCategories = unstable_cache(async function getCategories(visibleOnly = true) {
  await connectDB();
  const query = visibleOnly ? { isVisible: true } : {};
  return Category.find(query).sort({ sortOrder: 1 }).lean();
}, ['categories'], { revalidate: 60, tags: ['categories'] });

export const getCategory = cache(async function getCategory(id) {
  await connectDB();
  return Category.findById(id).lean();
});

export const getCategoryBySlug = unstable_cache(async function getCategoryBySlug(slug) {
  await connectDB();
  return Category.findOne({ slug }).lean();
}, ['category-by-slug'], { revalidate: 60, tags: ['categories'] });

export const getSettings = unstable_cache(async function getSettings() {
  await connectDB();
  let settings = await Settings.findOne({}).lean();
  if (!settings) {
    settings = {
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
  }
  return JSON.parse(JSON.stringify(settings));
}, ['site-settings'], { revalidate: 300, tags: ['settings'] });

export const getPolicies = unstable_cache(async function getPolicies() {
  await connectDB();
  return Policy.find({}).lean();
}, ['all-policies'], { revalidate: 3600, tags: ['policies'] });

export const getPolicy = unstable_cache(async function getPolicy(type) {
  await connectDB();
  return Policy.findOne({ type }).lean();
}, ['policy-by-type'], { revalidate: 3600, tags: ['policies'] });

export async function getEnquiryCount() {
  await connectDB();
  return Enquiry.countDocuments({});
}

export async function getPendingEnquiryCount() {
  await connectDB();
  return Enquiry.countDocuments({ status: 'new' });
}

export async function getProductCount() {
  await connectDB();
  return Product.countDocuments({});
}

export async function getCategoryCount() {
  await connectDB();
  return Category.countDocuments({});
}

