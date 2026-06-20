const mongoose = require('mongoose');
const { loadEnvConfig } = require('@next/env');
const path = require('path');
loadEnvConfig(path.join(__dirname, '..'));
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const products = await db.collection('products').find({ slug: { $in: ['pink-tiered-maxi-dress', 'lilac-embroidered-kurta-set', 'mustard-embroidered-kurta-set'] } }).toArray();
  products.forEach(p => console.log(p.name + ': ' + p._id));
  process.exit(0);
}).catch(console.error);
