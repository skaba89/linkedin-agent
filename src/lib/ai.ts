// AI Service for LinkedIn Content Generation
import ZAI from 'z-ai-web-dev-sdk';
import { ContentTone, PostCategory } from '@/types';

// Initialize Z-AI SDK
async function getAIClient() {
  return await ZAI.create();
}

// AI Generation Types
interface GenerateProfileSummaryInput {
  firstName: string;
  lastName: string;
  headline?: string;
  experiences: Array<{
    title: string;
    company: string;
    description?: string;
  }>;
  skills: string[];
  tone?: ContentTone;
  language?: string;
}

interface GeneratePostInput {
  topic: string;
  category: PostCategory;
  tone: ContentTone;
  language: string;
  targetAudience?: string;
  keywords?: string[];
  length?: 'short' | 'medium' | 'long';
}

interface GenerateHeadlineInput {
  firstName: string;
  lastName: string;
  industry: string;
  currentRole?: string;
  skills?: string[];
  language?: string;
}

interface ImproveContentInput {
  content: string;
  improvement: 'clarity' | 'engagement' | 'professionalism' | 'conciseness';
  language?: string;
}

// Profile Generation Functions
export async function generateProfileSummary(input: GenerateProfileSummaryInput): Promise<string> {
  const zai = await getAIClient();
  
  const experienceText = input.experiences
    .map(e => `${e.title} chez ${e.company}${e.description ? `: ${e.description}` : ''}`)
    .join('\n');
  
  const prompt = `Tu es un expert en rédaction de profils LinkedIn professionnels et impactants.

Génère un résumé LinkedIn "À propos" professionnel et engageant pour:

Nom: ${input.firstName} ${input.lastName}
${input.headline ? `Titre actuel: ${input.headline}` : ''}

Expériences:
${experienceText}

Compétences clés: ${input.skills.join(', ')}

Ton: ${input.tone || 'professionnel'}
Langue: ${input.language || 'français'}

Le résumé doit:
- Être rédigé à la première personne
- Avoir un hook accrocheur dès la première phrase
- Mettre en valeur les réalisations et l'expertise
- Inclure un appel à l'action subtil
- Être optimisé pour le référencement LinkedIn
- Avoir entre 1500 et 2500 caractères

Génère uniquement le résumé, sans explications.`;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: 'Tu es un expert en rédaction de profils LinkedIn.' },
      { role: 'user', content: prompt },
    ],
  });

  return completion.choices[0]?.message?.content || '';
}

export async function generateHeadline(input: GenerateHeadlineInput): Promise<string[]> {
  const zai = await getAIClient();
  
  const prompt = `Tu es un expert en optimisation de profils LinkedIn.

Génère 5 titres LinkedIn (headlines) accrocheurs et professionnels pour:

Nom: ${input.firstName} ${input.lastName}
Industrie: ${input.industry}
${input.currentRole ? `Poste actuel: ${input.currentRole}` : ''}
${input.skills?.length ? `Compétences: ${input.skills.join(', ')}` : ''}

Langue: ${input.language || 'français'}

Règles:
- Maximum 220 caractères par titre
- Utiliser des mots-clés pertinents pour le SEO LinkedIn
- Éviter les clichés comme "Passionné par..."
- Inclure une proposition de valeur unique
- Varier les styles (descriptif, créatif, orienté résultat)

Réponds uniquement avec les 5 titres, un par ligne, sans numérotation.`;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: 'Tu es un expert en optimisation de titres LinkedIn.' },
      { role: 'user', content: prompt },
    ],
  });

  const content = completion.choices[0]?.message?.content || '';
  return content.split('\n').filter(line => line.trim());
}

export async function improveExperienceDescription(
  title: string,
  company: string,
  currentDescription: string
): Promise<string> {
  const zai = await getAIClient();
  
  const prompt = `Tu es un expert en rédaction de descriptions d'expérience LinkedIn.

Améliore cette description d'expérience pour la rendre plus impactante:

Poste: ${title}
Entreprise: ${company}
Description actuelle: ${currentDescription}

Améliorations à apporter:
- Utiliser des verbes d'action forts
- Quantifier les résultats quand possible
- Mettre en avant les réalisations concrètes
- Optimiser pour les recruteurs et le SEO
- Maximum 2000 caractères

Génère uniquement la description améliorée.`;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: 'Tu es un expert en rédaction de CV et profils LinkedIn.' },
      { role: 'user', content: prompt },
    ],
  });

  return completion.choices[0]?.message?.content || currentDescription;
}

// Content Generation Functions
export async function generatePost(input: GeneratePostInput): Promise<{
  content: string;
  hooks: string[];
  hashtags: string[];
}> {
  const zai = await getAIClient();
  
  const lengthGuide = {
    short: '100-300 caractères',
    medium: '500-1000 caractères',
    long: '1500-2500 caractères',
  };

  const prompt = `Tu es un expert en création de contenu LinkedIn viral et engageant.

Crée un post LinkedIn sur le sujet: "${input.topic}"

Catégorie: ${input.category}
Ton: ${input.tone}
Langue: ${input.language}
Longueur: ${lengthGuide[input.length || 'medium']}
${input.targetAudience ? `Audience cible: ${input.targetAudience}` : ''}
${input.keywords?.length ? `Mots-clés à inclure: ${input.keywords.join(', ')}` : ''}

Structure du post:
1. Hook accrocheur (première ligne visible)
2. Développement avec valeur ajoutée
3. Appel à l'action ou question engageante

Génère également:
- 3 variantes de hooks alternatifs
- 5 hashtags pertinents

Format de réponse JSON:
{
  "content": "le contenu du post",
  "hooks": ["hook 1", "hook 2", "hook 3"],
  "hashtags": ["hashtag1", "hashtag2", ...]
}`;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: 'Tu es un expert en marketing de contenu LinkedIn. Réponds uniquement en JSON valide.' },
      { role: 'user', content: prompt },
    ],
  });

  const content = completion.choices[0]?.message?.content || '{}';
  
  try {
    return JSON.parse(content);
  } catch {
    return {
      content: content.replace(/```json\n?|\n?```/g, ''),
      hooks: [],
      hashtags: [],
    };
  }
}

export async function generateCarouselSlides(
  topic: string,
  slideCount: number = 5,
  language: string = 'français'
): Promise<Array<{ title: string; content: string }>> {
  const zai = await getAIClient();
  
  const prompt = `Tu es un expert en création de carrousels LinkedIn engageants.

Crée un carrousel LinkedIn de ${slideCount} slides sur: "${topic}"

Langue: ${language}

Règles pour chaque slide:
- Titre court et percutant (max 50 caractères)
- Contenu concis et visuel (max 100 caractères)
- Chaque slide apporte une information unique
- Progression logique du problème vers la solution
- Dernier slide = récapitulatif + CTA

Format de réponse JSON:
[
  { "title": "Titre slide 1", "content": "Contenu slide 1" },
  ...
]`;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: 'Tu es un expert en création de carrousels LinkedIn. Réponds uniquement en JSON valide.' },
      { role: 'user', content: prompt },
    ],
  });

  const content = completion.choices[0]?.message?.content || '[]';
  
  try {
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function improveContent(input: ImproveContentInput): Promise<string> {
  const zai = await getAIClient();
  
  const improvementGuides = {
    clarity: 'Rends le texte plus clair et facile à comprendre.',
    engagement: 'Rends le texte plus engageant et viral.',
    professionalism: 'Rends le texte plus professionnel et corporate.',
    conciseness: 'Rends le texte plus concis tout en gardant le sens.',
  };

  const prompt = `Améliore ce texte LinkedIn:

"${input.content}"

Amélioration demandée: ${improvementGuides[input.improvement]}
Langue: ${input.language || 'français'}

Génère uniquement le texte amélioré.`;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: 'Tu es un expert en rédaction de contenu LinkedIn.' },
      { role: 'user', content: prompt },
    ],
  });

  return completion.choices[0]?.message?.content || input.content;
}

// Profile Analysis Functions
export async function analyzeProfileOptimization(
  profile: {
    headline?: string;
    summary?: string;
    experiences: Array<{ title: string; description?: string }>;
    skills: string[];
    photo?: string;
    banner?: string;
  }
): Promise<{
  score: number;
  suggestions: Array<{ field: string; priority: string; message: string; action: string }>;
}> {
  const zai = await getAIClient();
  
  const prompt = `Tu es un expert en optimisation de profils LinkedIn.

Analyse ce profil LinkedIn et donne un score d'optimisation sur 100:

Titre: ${profile.headline || 'Non renseigné'}
Résumé: ${profile.summary || 'Non renseigné'}
Nombre d'expériences: ${profile.experiences.length}
Expériences avec description: ${profile.experiences.filter(e => e.description).length}
Compétences: ${profile.skills.length}
Photo: ${profile.photo ? 'Présente' : 'Absente'}
Bannière: ${profile.banner ? 'Présente' : 'Absente'}

Fournis:
1. Un score global sur 100
2. Des suggestions d'amélioration classées par priorité (high, medium, low)

Format JSON:
{
  "score": 75,
  "suggestions": [
    {
      "field": "photo",
      "priority": "high",
      "message": "Ajoutez une photo professionnelle",
      "action": "Téléchargez une photo de profil professionnelle"
    }
  ]
}`;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: 'Tu es un expert en optimisation de profils LinkedIn. Réponds uniquement en JSON valide.' },
      { role: 'user', content: prompt },
    ],
  });

  const content = completion.choices[0]?.message?.content || '{}';
  
  try {
    return JSON.parse(content);
  } catch {
    return {
      score: 50,
      suggestions: [],
    };
  }
}

// Company Page Generation
export async function generateCompanyDescription(
  companyName: string,
  industry: string,
  services: string[],
  values?: string[]
): Promise<string> {
  const zai = await getAIClient();
  
  const prompt = `Tu es un expert en communication d'entreprise.

Crée une description de page LinkedIn entreprise pour:

Entreprise: ${companyName}
Industrie: ${industry}
Services: ${services.join(', ')}
${values?.length ? `Valeurs: ${values.join(', ')}` : ''}

La description doit:
- Être professionnelle et engageante
- Mettre en avant la proposition de valeur unique
- Être optimisée pour le SEO LinkedIn
- Avoir entre 500 et 1000 caractères

Génère uniquement la description.`;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: 'Tu es un expert en communication corporate.' },
      { role: 'user', content: prompt },
    ],
  });

  return completion.choices[0]?.message?.content || '';
}

// Hook Generation
export async function generateHooks(topic: string, count: number = 5): Promise<string[]> {
  const zai = await getAIClient();
  
  const prompt = `Génère ${count} hooks (accroches) LinkedIn percutants pour un post sur: "${topic}"

Règles:
- Maximum 150 caractères par hook
- Créer de la curiosité ou l'urgence
- Éviter les clichés
- Varier les styles (question, statistique, histoire, promesse)

Réponds uniquement avec les hooks, un par ligne.`;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: 'Tu es un expert en copywriting LinkedIn.' },
      { role: 'user', content: prompt },
    ],
  });

  const content = completion.choices[0]?.message?.content || '';
  return content.split('\n').filter(line => line.trim());
}

// Content Ideas Generation
export async function generateContentIdeas(
  industry: string,
  role: string,
  count: number = 10
): Promise<Array<{ title: string; category: string; description: string }>> {
  const zai = await getAIClient();
  
  const prompt = `Génère ${count} idées de contenu LinkedIn pour:

Industrie: ${industry}
Rôle: ${role}

Pour chaque idée, fournis:
- Un titre accrocheur
- Une catégorie (thought_leadership, company_update, product_announcement, hiring, employer_branding, industry_insight, educational, personal_story)
- Une brève description

Format JSON:
[
  {
    "title": "Titre de l'idée",
    "category": "thought_leadership",
    "description": "Description courte"
  }
]`;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: 'Tu es un expert en stratégie de contenu LinkedIn. Réponds uniquement en JSON valide.' },
      { role: 'user', content: prompt },
    ],
  });

  const content = completion.choices[0]?.message?.content || '[]';
  
  try {
    return JSON.parse(content);
  } catch {
    return [];
  }
}
