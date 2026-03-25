// Authentication utilities for LinkedIn Presence Manager
// Using Web Crypto API for Edge Runtime compatibility
// Updated: removed bcryptjs dependency
import { db } from './db';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { User, AccountType } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Simple jose-based JWT implementation
const secretKey = new TextEncoder().encode(JWT_SECRET);

// Hash password using Web Crypto API (SHA-256 based)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + JWT_SECRET); // Add salt
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `sha256:${hashHex}`;
}

// Verify password
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash.startsWith('sha256:')) {
    // Legacy bcrypt format - not supported in edge runtime
    return false;
  }
  const newHash = await hashPassword(password);
  return newHash === storedHash;
}

export async function createToken(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
  return token;
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { userId: string };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{ user: User } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    const dbUser = await db.user.findUnique({
      where: { id: payload.userId },
    });

    if (!dbUser || !dbUser.isActive) return null;

    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        avatarUrl: dbUser.avatarUrl,
        phone: dbUser.phone,
        accountType: dbUser.accountType as AccountType,
        isEmailVerified: dbUser.isEmailVerified,
        isActive: dbUser.isActive,
        onboardingCompleted: dbUser.onboardingCompleted,
        onboardingStep: dbUser.onboardingStep,
        lastLoginAt: dbUser.lastLoginAt,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      },
    };
  } catch {
    return null;
  }
}

export async function setSession(userId: string): Promise<void> {
  const token = await createToken(userId);
  const cookieStore = await cookies();
  
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_EXPIRY / 1000,
    path: '/',
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  accountType: AccountType;
}): Promise<User> {
  const existingUser = await db.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const passwordHash = await hashPassword(data.password);

  const user = await db.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      accountType: data.accountType,
      onboardingStep: 'welcome',
    },
  });

  // Create personal workspace for individual users
  if (data.accountType === 'individual') {
    const organization = await db.organization.create({
      data: {
        name: `${data.firstName} ${data.lastName}`,
        slug: `${data.firstName.toLowerCase()}-${data.lastName.toLowerCase()}-${user.id.slice(0, 6)}`,
        orgType: 'company',
        planType: 'free',
      },
    });

    await db.organizationMember.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        role: 'owner',
      },
    });

    const workspace = await db.workspace.create({
      data: {
        organizationId: organization.id,
        name: 'Mon Espace',
        slug: `personal-${user.id.slice(0, 6)}`,
        workspaceType: 'personal',
      },
    });

    await db.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: 'owner',
      },
    });
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    accountType: user.accountType as AccountType,
    isEmailVerified: user.isEmailVerified,
    isActive: user.isActive,
    onboardingCompleted: user.onboardingCompleted,
    onboardingStep: user.onboardingStep,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function loginUser(email: string, password: string): Promise<User> {
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.passwordHash) {
    throw new Error('Please sign in with your connected account');
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  // Update last login
  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    accountType: user.accountType as AccountType,
    isEmailVerified: user.isEmailVerified,
    isActive: user.isActive,
    onboardingCompleted: user.onboardingCompleted,
    onboardingStep: user.onboardingStep,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function updateOnboardingStep(userId: string, step: string): Promise<void> {
  const isCompleted = step === 'completed';
  
  await db.user.update({
    where: { id: userId },
    data: {
      onboardingStep: isCompleted ? null : step,
      onboardingCompleted: isCompleted,
    },
  });
}
