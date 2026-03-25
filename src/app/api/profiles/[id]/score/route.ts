import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { 
  apiSuccess, 
  apiError, 
  apiUnauthorized,
  apiNotFound
} from '@/lib/api';
import { db } from '@/lib/db';
import { analyzeProfileOptimization } from '@/lib/ai';

// Helper to verify profile access
async function verifyProfileAccess(profileId: string, userId: string) {
  const profile = await db.linkedInProfileDraft.findUnique({
    where: { id: profileId },
    include: {
      workspace: {
        include: {
          members: {
            where: { userId },
          },
        },
      },
    },
  });

  if (!profile) {
    return { profile: null, hasAccess: false };
  }

  const hasAccess = profile.workspace.members.length > 0;
  return { profile, hasAccess };
}

// GET /api/profiles/[id]/score - Calculate and return profile score
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  
  if (!session) {
    return apiUnauthorized();
  }

  const { id } = await params;

  try {
    const { profile, hasAccess } = await verifyProfileAccess(id, session.user.id);

    if (!profile) {
      return apiNotFound('Profile not found');
    }

    if (!hasAccess) {
      return apiError('Access denied to this profile', 403);
    }

    // Get full profile data for scoring
    const fullProfile = await db.linkedInProfileDraft.findUnique({
      where: { id },
      include: {
        experiences: {
          orderBy: { order: 'asc' },
        },
        skills: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!fullProfile) {
      return apiNotFound('Profile not found');
    }

    // Use AI to analyze profile optimization
    const analysis = await analyzeProfileOptimization({
      headline: fullProfile.headline || undefined,
      summary: fullProfile.summary || undefined,
      experiences: fullProfile.experiences.map(exp => ({
        title: exp.title,
        description: exp.description || undefined,
      })),
      skills: fullProfile.skills.map(skill => skill.name),
      photo: fullProfile.photoUrl || undefined,
      banner: fullProfile.bannerUrl || undefined,
    });

    // Calculate completion rate based on filled fields
    const fields = [
      { name: 'firstName', filled: !!fullProfile.firstName },
      { name: 'lastName', filled: !!fullProfile.lastName },
      { name: 'headline', filled: !!fullProfile.headline },
      { name: 'photo', filled: !!fullProfile.photoUrl },
      { name: 'banner', filled: !!fullProfile.bannerUrl },
      { name: 'location', filled: !!fullProfile.location },
      { name: 'industry', filled: !!fullProfile.industryName },
      { name: 'summary', filled: !!fullProfile.summary && fullProfile.summary.length >= 100 },
      { name: 'experiences', filled: fullProfile.experiences.length > 0 },
      { name: 'skills', filled: fullProfile.skills.length >= 5 },
    ];

    const filledCount = fields.filter(f => f.filled).length;
    const completionRate = Math.round((filledCount / fields.length) * 100);

    // Update profile with calculated scores
    await db.linkedInProfileDraft.update({
      where: { id },
      data: {
        profileScore: analysis.score,
        completionRate,
        suggestions: JSON.stringify(analysis.suggestions),
      },
    });

    return apiSuccess({
      score: analysis.score,
      completionRate,
      breakdown: {
        fields: fields.map(f => ({
          name: f.name,
          filled: f.filled,
        })),
      },
      suggestions: analysis.suggestions,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error calculating profile score:', error);
    return apiError('Failed to calculate profile score', 500);
  }
}
