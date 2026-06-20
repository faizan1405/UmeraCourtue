import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function verifyAdmin(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  try {
    await connectDB();
    const admin = await Admin.findOne({ email: decoded.email });
    if (!admin) {
      return null;
    }
  } catch (error) {
    console.error('Error verifying admin from database:', error);
    return null;
  }

  return decoded;
}

export async function validateCredentials(email, password) {
  await connectDB();

  let admin = await Admin.findOne({ email });

  if (!admin) {
    // For first login, check if there's no admin in DB at all,
    // and matching credentials exist in env variables. If so, seed the admin.
    if (email === ADMIN_EMAIL && ADMIN_PASSWORD) {
      const plaintextPassword = ADMIN_PASSWORD;
      const hashedPassword = plaintextPassword.startsWith('$2')
        ? plaintextPassword
        : bcrypt.hashSync(plaintextPassword, 10);

      try {
        admin = await Admin.create({
          email: email,
          password: hashedPassword,
        });
        console.log(`[Auth] Auto-created Admin user in MongoDB from environment variables for: ${email}`);
      } catch (error) {
        console.error('Failed to auto-create admin user from environment variables:', error);
        return false;
      }
    } else {
      return false;
    }
  }

  // Verify entered password against hashed password in database
  const isMatch = admin.password.startsWith('$2')
    ? bcrypt.compareSync(password, admin.password)
    : password === admin.password;

  // Migration logic: If existing database entry is plaintext, secure it now
  if (isMatch && !admin.password.startsWith('$2')) {
    try {
      admin.password = bcrypt.hashSync(password, 10);
      await admin.save();
      console.log(`[Auth] Migrated legacy plaintext password to hashed for admin: ${email}`);
    } catch (error) {
      console.error('Failed to migrate admin password:', error);
    }
  }

  return isMatch;
}

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

