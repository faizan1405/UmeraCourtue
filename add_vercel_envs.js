const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const requiredVars = [
  'MONGODB_URI',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_ADMIN_URL',
  'NEXT_PUBLIC_ADMIN_LOGIN_URL',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'NEXT_PUBLIC_RAZORPAY_KEY_ID'
];

const parsedEnv = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let key = match[1].trim();
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    parsedEnv[key] = val;
  }
});

for (const key of requiredVars) {
  const val = parsedEnv[key];
  if (!val) continue;

  console.log(`Adding ${key}...`);
  fs.writeFileSync('temp_val.txt', val);
  
  const envs = ['production', 'preview', 'development'];
  for (const env of envs) {
    try {
      execSync(`npx.cmd vercel env add ${key} ${env} < temp_val.txt`, { stdio: 'pipe' });
      console.log(`  Added ${key} to ${env}`);
    } catch (err) {
      // If failed, try with --force (overwriting existing)
      try {
        execSync(`npx.cmd vercel env add ${key} ${env} --force < temp_val.txt`, { stdio: 'pipe' });
        console.log(`  Updated ${key} in ${env} (forced)`);
      } catch (err2) {
        console.log(`  Failed to add ${key} to ${env}: ${err2.message}`);
      }
    }
  }
  fs.unlinkSync('temp_val.txt');
}
console.log('All required environment variables processed.');
