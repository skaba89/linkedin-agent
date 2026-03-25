// Auth API Routes - Login
import { NextRequest } from 'next/server';
import { loginUser, setSession } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return apiError('Email and password are required');
    }

    const user = await loginUser(email, password);
    await setSession(user.id);

    return apiSuccess({ user }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      return apiError(error.message, 401);
    }
    return apiError('An unexpected error occurred', 500);
  }
}
