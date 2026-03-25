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

// Helper to verify experience belongs to profile
async function verifyExperienceAccess(profileId: string, expId: string, userId: string) {
  const { profile, hasAccess } = await verifyProfileAccess(profileId, userId);

  if (!profile || !hasAccess) {
    return { experience: null, hasAccess };
  }

  const experience = await db.experienceEntry.findFirst({
    where: {
      id: expId,
      profileDraftId: profileId,
    },
  });

  return { experience, hasAccess: !!experience };
}

// PUT /api/profiles/[id]/experiences/[expId] - Update experience
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; expId: string }> }
) {
  const session = await getSession();
  
  if (!session) {
    return apiUnauthorized();
  }

  const { id, expId } = await params;

  try {
    const { experience, hasAccess } = await verifyExperienceAccess(id, expId, session.user.id);

    if (!experience) {
      return apiNotFound('Experience not found');
    }

    if (!hasAccess) {
      return apiError('Access denied to this experience', 403);
    }

    const body = await request.json();

    // Fields that can be updated
    const updateData: Record<string, unknown> = {};
    
    const allowedFields = [
      'title', 'company', 'companyId', 'companyLogoUrl', 'employmentType',
      'location', 'locationType', 'startDate', 'endDate', 'current',
      'description', 'isAIGenerated', 'order'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'startDate' || field === 'endDate') {
          updateData[field] = body[field] ? new Date(body[field]) : null;
        } else {
          updateData[field] = body[field];
        }
      }
    }

    const updatedExperience = await db.experienceEntry.update({
      where: { id: expId },
      data: updateData,
    });

    return apiSuccess(updatedExperience, 'Experience updated successfully');
  } catch (error) {
    console.error('Error updating experience:', error);
    return apiError('Failed to update experience', 500);
  }
}

// DELETE /api/profiles/[id]/experiences/[expId] - Delete experience
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; expId: string }> }
) {
  const session = await getSession();
  
  if (!session) {
    return apiUnauthorized();
  }

  const { id, expId } = await params;

  try {
    const { experience, hasAccess } = await verifyExperienceAccess(id, expId, session.user.id);

    if (!experience) {
      return apiNotFound('Experience not found');
    }

    if (!hasAccess) {
      return apiError('Access denied to this experience', 403);
    }

    await db.experienceEntry.delete({
      where: { id: expId },
    });

    return apiSuccess({ id: expId }, 'Experience deleted successfully');
  } catch (error) {
    console.error('Error deleting experience:', error);
    return apiError('Failed to delete experience', 500);
  }
}
