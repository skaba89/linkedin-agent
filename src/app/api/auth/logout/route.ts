// Auth API Routes - Logout
import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';
import { apiSuccess } from '@/lib/api';

export async function POST() {
  try {
    await clearSession();
    return apiSuccess(null, 'Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    return apiSuccess(null, 'Logged out successfully');
  }
}
