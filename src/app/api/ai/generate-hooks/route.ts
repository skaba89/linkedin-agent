// AI Generate Hooks API
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api';
import { generateHooks } from '@/lib/ai';

// POST /api/ai/generate-hooks - Generate post hooks
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.topic) {
      return apiError('Topic is required', 400);
    }

    // Validate count
    const count = body.count || 5;
    if (count < 1 || count > 10) {
      return apiError('Count must be between 1 and 10', 400);
    }

    // Generate hooks
    const hooks = await generateHooks(body.topic, count);

    return apiSuccess({
      hooks,
      topic: body.topic,
      aiModel: 'z-ai'
    }, 'Hooks generated successfully');
  } catch (error) {
    console.error('Error generating hooks:', error);
    return apiError('Failed to generate hooks. Please try again.', 500);
  }
}
