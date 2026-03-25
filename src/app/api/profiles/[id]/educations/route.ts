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

// GET /api/profiles/[id]/educations - List educations
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

    const educations = await db.educationEntry.findMany({
      where: { profileDraftId: id },
      orderBy: { order: 'asc' },
    });

    return apiSuccess(educations);
  } catch (error) {
    console.error('Error fetching educations:', error);
    return apiError('Failed to fetch educations', 500);
  }
}

// POST /api/profiles/[id]/educations - Add education
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
    const maxOrder = await db.educationEntry.aggregate({
      where: { profileDraftId: id },
      _max: { order: true },
    });

    const nextOrder = (maxOrder._max.order || 0) + 1;

    // Create education
    const education = await db.educationEntry.create({
      data: {
        profileDraftId: id,
        school: body.school,
        schoolId: body.schoolId,
        schoolLogoUrl: body.schoolLogoUrl,
        degree: body.degree,
        fieldOfStudy: body.fieldOfStudy,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        description: body.description,
        isAIGenerated: body.isAIGenerated || false,
        order: nextOrder,
      },
    });

    return apiSuccess(education, 'Education added successfully');
  } catch (error) {
    console.error('Error creating education:', error);
    return apiError('Failed to create education', 500);
  }
}
