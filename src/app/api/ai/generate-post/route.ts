// AI Generate Post API
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api';
import { generatePost } from '@/lib/ai';
import { ContentTone, PostCategory } from '@/types';

// POST /api/ai/generate-post - Generate LinkedIn post
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

    // Validate category
    const validCategories: PostCategory[] = [
      'thought_leadership',
      'company_update',
      'product_announcement',
      'hiring',
      'employer_branding',
      'industry_insight',
      'educational',
      'personal_story',
      'other'
    ];

    if (body.category && !validCategories.includes(body.category)) {
      return apiError('Invalid category', 400);
    }

    // Validate tone
    const validTones: ContentTone[] = ['professional', 'casual', 'inspirational', 'educational', 'promotional'];

    if (body.tone && !validTones.includes(body.tone)) {
      return apiError('Invalid tone', 400);
    }

    // Generate post
    const result = await generatePost({
      topic: body.topic,
      category: body.category || 'thought_leadership',
      tone: body.tone || 'professional',
      language: body.language || 'français',
      targetAudience: body.targetAudience,
      keywords: body.keywords,
      length: body.length || 'medium'
    });

    return apiSuccess({
      content: result.content,
      hooks: result.hooks,
      hashtags: result.hashtags,
      aiModel: 'z-ai'
    }, 'Post generated successfully');
  } catch (error) {
    console.error('Error generating post:', error);
    return apiError('Failed to generate post. Please try again.', 500);
  }
}
