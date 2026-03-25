// Auth API Routes - Registration
import { NextRequest, NextResponse } from 'next/server';
import { registerUser, setSession } from '@/lib/auth';
import { apiError, apiSuccess, validateEmail, validatePassword } from '@/lib/api';
import { AccountType } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { email, password, confirmPassword, firstName, lastName, accountType } = body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return apiError('All required fields must be provided');
    }

    if (!validateEmail(email)) {
      return apiError('Invalid email address');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return apiError(passwordValidation.errors.join('. '));
    }

    if (password !== confirmPassword) {
      return apiError('Passwords do not match');
    }

    const validAccountTypes: AccountType[] = ['individual', 'company', 'agency'];
    if (accountType && !validAccountTypes.includes(accountType)) {
      return apiError('Invalid account type');
    }

    // Create user
    const user = await registerUser({
      email,
      password,
      firstName,
      lastName,
      accountType: accountType || 'individual',
    });

    // Set session
    await setSession(user.id);

    return apiSuccess({ user }, 'Account created successfully');
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      if (error.message === 'Email already registered') {
        return apiError(error.message, 409);
      }
      return apiError(error.message);
    }
    return apiError('An unexpected error occurred', 500);
  }
}
