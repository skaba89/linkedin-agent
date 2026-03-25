import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api';
import { generateProfileSummary } from '@/lib/ai';

// POST /api/ai/generate-summary - Generate profile summary with AI
export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const body = await request.json();
    const { firstName, lastName, headline, experiences, skills, tone, language } = body;

    if (!firstName || !lastName) {
      return apiError('Prénom et nom sont requis', 400);
    }

    const summary = await generateProfileSummary({
      firstName,
      lastName,
      headline,
      experiences: experiences || [],
      skills: skills || [],
      tone: tone || 'professional',
      language: language || 'français',
    });

    return apiSuccess({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return apiError('Erreur lors de la génération du résumé', 500);
  }
}
