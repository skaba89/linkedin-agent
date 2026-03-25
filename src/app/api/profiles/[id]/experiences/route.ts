import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { 
  apiSuccess, 
  apiError, 
  apiUnauthorized,
  apiNotFound
} from '@/lib/api';
import { db } from '@/lib/db';

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

// GET /api/profiles/[id]/experiences - List experiences
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

    const experiences = await db.experienceEntry.findMany({
      where: { profileDraftId: id },
      orderBy: { order: 'asc' },
    });

    return apiSuccess(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return apiError('Failed to fetch experiences', 500);
  }
}

// POST /api/profiles/[id]/experiences - Add experience
export async function POST(
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

    const body = await request.json();

    // Get max order for this profile
    const maxOrder = await db.experienceEntry.aggregate({
      where: { profileDraftId: id },
      _max: { order: true },
    });

    const nextOrder = (maxOrder._max.order || 0) + 1;

    // Create experience
    const experience = await db.experienceEntry.create({
      data: {
        profileDraftId: id,
        title: body.title,
        company: body.company,
        companyId: body.companyId,
        companyLogoUrl: body.companyLogoUrl,
        employmentType: body.employmentType,
        location: body.location,
        locationType: body.locationType,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        current: body.current || false,
        description: body.description,
        isAIGenerated: body.isAIGenerated || false,
        order: nextOrder,
      },
    });

    return apiSuccess(experience, 'Experience added successfully');
  } catch (error) {
    console.error('Error creating experience:', error);
    return apiError('Failed to create experience', 500);
  }
}
