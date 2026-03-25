import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api';
import ZAI from 'z-ai-web-dev-sdk';

interface SkillSuggestion {
  name: string;
  category: string;
}

// POST /api/ai/suggest-skills - Suggest skills based on profile
export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const body = await request.json();
    const { experiences, currentSkills, industry } = body;

    const zai = await ZAI.create();

    const prompt = `Tu es un expert en optimisation de profils LinkedIn.

Suggère 10 compétences pertinentes pour un profil LinkedIn basé sur:

Industrie: ${industry || 'Non spécifiée'}

Expériences:
${experiences?.map((exp: { title: string; company: string }) => `- ${exp.title} chez ${exp.company}`).join('\n') || 'Non spécifiées'}

Compétences actuelles:
${currentSkills?.join(', ') || 'Aucune'}

Règles:
- Proposer des compétences techniques ET transversales
- Éviter les compétences déjà présentes
- Utiliser des termes standards LinkedIn
- Varier les niveaux d'expertise

Format JSON:
[
  { "name": "Nom de la compétence", "category": "technical|soft|tools" }
]`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'Tu es un expert en optimisation de profils LinkedIn. Réponds uniquement en JSON valide.' },
        { role: 'user', content: prompt },
      ],
    });

    const content = completion.choices[0]?.message?.content || '[]';
    
    let suggestions: SkillSuggestion[] = [];
    try {
      suggestions = JSON.parse(content);
    } catch {
      // If parsing fails, return empty array
      suggestions = [];
    }

    return apiSuccess({ suggestions });
  } catch (error) {
    console.error('Error suggesting skills:', error);
    return apiError('Erreur lors de la suggestion des compétences', 500);
  }
}
