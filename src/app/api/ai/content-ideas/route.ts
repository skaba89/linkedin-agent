// AI Content Ideas API
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api';
import { generateContentIdeas } from '@/lib/ai';

// POST /api/ai/content-ideas - Generate content ideas
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.industry) {
      return apiError('Industry is required', 400);
    }

    if (!body.role) {
      return apiError('Role is required', 400);
    }

    // Validate count
    const count = body.count || 10;
    if (count < 1 || count > 20) {
      return apiError('Count must be between 1 and 20', 400);
    }

    // Generate content ideas
    const ideas = await generateContentIdeas(
      body.industry,
      body.role,
      count
    );

    return apiSuccess({
      ideas,
      industry: body.industry,
      role: body.role,
      aiModel: 'z-ai'
    }, 'Content ideas generated successfully');
  } catch (error) {
    console.error('Error generating content ideas:', error);
    return apiError('Failed to generate content ideas. Please try again.', 500);
  }
}
