// API Utilities for LinkedIn Presence Manager
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';
import { getSession } from './auth';

// Standard API response helpers
export function apiSuccess<T>(data: T, message?: string, meta?: ApiResponse['meta']): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message,
    meta,
  } as ApiResponse<T>);
}

export function apiError(message: string, status: number = 400): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    } as ApiResponse,
    { status }
  );
}

export function apiNotFound(message: string = 'Resource not found'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    } as ApiResponse,
    { status: 404 }
  );
}

export function apiUnauthorized(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    } as ApiResponse,
    { status: 401 }
  );
}

export function apiForbidden(message: string = 'Forbidden'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    } as ApiResponse,
    { status: 403 }
  );
}

export function apiValidationError(errors: Record<string, string[]>): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      data: errors,
    } as ApiResponse,
    { status: 422 }
  );
}

// Auth middleware for API routes
export async function withAuth<T>(
  handler: (userId: string) => Promise<NextResponse<T>>
): Promise<NextResponse> {
  const session = await getSession();
  
  if (!session) {
    return apiUnauthorized();
  }
  
  return handler(session.user.id);
}

// Rate limiting (simple in-memory implementation)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const limit = rateLimits.get(identifier);
  
  if (!limit || limit.resetAt < now) {
    rateLimits.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }
  
  if (limit.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: limit.resetAt };
  }
  
  limit.count++;
  return { allowed: true, remaining: maxRequests - limit.count, resetAt: limit.resetAt };
}

// Pagination helper
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  return { page, limit };
}

export function calculatePaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  return {
    page,
    limit,
    total,
    hasMore: page * limit < total,
  };
}

export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

// Input validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }
  
  return { valid: errors.length === 0, errors };
}

export function sanitizeString(str: string, maxLength: number = 1000): string {
  return str.trim().slice(0, maxLength);
}

export function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Slug generation
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Date formatting
export function formatDate(date: Date | string, locale: string = 'fr-FR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string, locale: string = 'fr-FR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return 'À l\'instant';
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffHour < 24) return `Il y a ${diffHour}h`;
  if (diffDay < 7) return `Il y a ${diffDay}j`;
  
  return formatDate(d);
}
