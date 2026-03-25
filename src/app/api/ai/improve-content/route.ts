// AI Improve Content API
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api';
import { improveContent } from '@/lib/ai';

// POST /api/ai/improve-content - Improve existing content
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.content) {
      return apiError('Content is required', 400);
    }

    // Validate improvement type
    const validImprovements = ['clarity', 'engagement', 'professionalism', 'conciseness'];
    if (!body.improvement || !validImprovements.includes(body.improvement)) {
      return apiError('Improvement type must be one of: clarity, engagement, professionalism, conciseness', 400);
    }

    // Improve content
    const improvedContent = await improveContent({
      content: body.content,
      improvement: body.improvement,
      language: body.language || 'français'
    });

    return apiSuccess({
      originalContent: body.content,
      improvedContent,
      improvement: body.improvement,
      aiModel: 'z-ai'
    }, 'Content improved successfully');
  } catch (error) {
    console.error('Error improving content:', error);
    return apiError('Failed to improve content. Please try again.', 500);
  }
}
