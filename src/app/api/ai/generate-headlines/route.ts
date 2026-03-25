// AI Generate Headlines API
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api';
import { generateHeadline } from '@/lib/ai';

// POST /api/ai/generate-headlines - Generate headline options
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.firstName) {
      return apiError('First name is required', 400);
    }

    if (!body.lastName) {
      return apiError('Last name is required', 400);
    }

    if (!body.industry) {
      return apiError('Industry is required', 400);
    }

    // Generate headlines
    const headlines = await generateHeadline({
      firstName: body.firstName,
      lastName: body.lastName,
      industry: body.industry,
      currentRole: body.currentRole,
      skills: body.skills,
      language: body.language || 'français'
    });

    return apiSuccess({
      headlines,
      aiModel: 'z-ai'
    }, 'Headlines generated successfully');
  } catch (error) {
    console.error('Error generating headlines:', error);
    return apiError('Failed to generate headlines. Please try again.', 500);
  }
}
