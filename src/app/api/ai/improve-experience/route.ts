import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api';
import { improveExperienceDescription } from '@/lib/ai';

// POST /api/ai/improve-experience - Improve experience description with AI
export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const body = await request.json();
    const { title, company, description } = body;

    if (!title || !company) {
      return apiError('Titre et entreprise sont requis', 400);
    }

    const improvedDescription = await improveExperienceDescription(
      title,
      company,
      description || ''
    );

    return apiSuccess({ description: improvedDescription });
  } catch (error) {
    console.error('Error improving experience description:', error);
    return apiError('Erreur lors de l\'amélioration de la description', 500);
  }
}
