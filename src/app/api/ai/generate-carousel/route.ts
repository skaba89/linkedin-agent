// AI Generate Carousel API
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api';
import { generateCarouselSlides } from '@/lib/ai';

// POST /api/ai/generate-carousel - Generate carousel slides
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

    // Validate slide count
    const slideCount = body.slideCount || 5;
    if (slideCount < 3 || slideCount > 10) {
      return apiError('Slide count must be between 3 and 10', 400);
    }

    // Generate carousel slides
    const slides = await generateCarouselSlides(
      body.topic,
      slideCount,
      body.language || 'français'
    );

    return apiSuccess({
      slides,
      slideCount: slides.length,
      aiModel: 'z-ai'
    }, 'Carousel slides generated successfully');
  } catch (error) {
    console.error('Error generating carousel:', error);
    return apiError('Failed to generate carousel. Please try again.', 500);
  }
}
