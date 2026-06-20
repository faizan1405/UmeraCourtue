import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

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
  if (!decoded || decoded.email !== ADMIN_EMAIL) {
    return null;
  }

  return decoded;
}

export async function validateCredentials(email, password) {
  if (email !== ADMIN_EMAIL) {
    return false;
  }

  // For first login, compare plain text. In production, hash the password.
  if (ADMIN_PASSWORD.startsWith('$2')) {
    // Password is already hashed
    return bcrypt.compareSync(password, ADMIN_PASSWORD);
  }

  // Plain text comparison (for initial setup)
  return password === ADMIN_PASSWORD;
}

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}
