// Auth API Routes - Session
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { apiSuccess, apiUnauthorized } from '@/lib/api';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return apiUnauthorized();
    }

    return apiSuccess({ user: session.user });
  } catch (error) {
    console.error('Session error:', error);
    return apiUnauthorized();
  }
}
