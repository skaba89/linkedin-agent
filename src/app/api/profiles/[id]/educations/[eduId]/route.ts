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

// Helper to verify education belongs to profile
async function verifyEducationAccess(profileId: string, eduId: string, userId: string) {
  const { profile, hasAccess } = await verifyProfileAccess(profileId, userId);

  if (!profile || !hasAccess) {
    return { education: null, hasAccess };
  }

  const education = await db.educationEntry.findFirst({
    where: {
      id: eduId,
      profileDraftId: profileId,
    },
  });

  return { education, hasAccess: !!education };
}

// PUT /api/profiles/[id]/educations/[eduId] - Update education
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; eduId: string }> }
) {
  const session = await getSession();
  
  if (!session) {
    return apiUnauthorized();
  }

  const { id, eduId } = await params;

  try {
    const { education, hasAccess } = await verifyEducationAccess(id, eduId, session.user.id);

    if (!education) {
      return apiNotFound('Education not found');
    }

    if (!hasAccess) {
      return apiError('Access denied to this education', 403);
    }

    const body = await request.json();

    // Fields that can be updated
    const updateData: Record<string, unknown> = {};
    
    const allowedFields = [
      'school', 'schoolId', 'schoolLogoUrl', 'degree', 'fieldOfStudy',
      'startDate', 'endDate', 'description', 'isAIGenerated', 'order'
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

    const updatedEducation = await db.educationEntry.update({
      where: { id: eduId },
      data: updateData,
    });

    return apiSuccess(updatedEducation, 'Education updated successfully');
  } catch (error) {
    console.error('Error updating education:', error);
    return apiError('Failed to update education', 500);
  }
}

// DELETE /api/profiles/[id]/educations/[eduId] - Delete education
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; eduId: string }> }
) {
  const session = await getSession();
  
  if (!session) {
    return apiUnauthorized();
  }

  const { id, eduId } = await params;

  try {
    const { education, hasAccess } = await verifyEducationAccess(id, eduId, session.user.id);

    if (!education) {
      return apiNotFound('Education not found');
    }

    if (!hasAccess) {
      return apiError('Access denied to this education', 403);
    }

    await db.educationEntry.delete({
      where: { id: eduId },
    });

    return apiSuccess({ id: eduId }, 'Education deleted successfully');
  } catch (error) {
    console.error('Error deleting education:', error);
    return apiError('Failed to delete education', 500);
  }
}
