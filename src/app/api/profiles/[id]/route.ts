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

// GET /api/profiles/[id] - Get profile with all relations
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

    // Get full profile with all relations
    const fullProfile = await db.linkedInProfileDraft.findUnique({
      where: { id },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        experiences: {
          orderBy: { order: 'asc' },
        },
        educations: {
          orderBy: { order: 'asc' },
        },
        skills: {
          orderBy: { order: 'asc' },
        },
        certifications: {
          orderBy: { order: 'asc' },
        },
        projects: {
          orderBy: { order: 'asc' },
        },
        services: {
          orderBy: { order: 'asc' },
        },
        languages: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return apiSuccess(fullProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return apiError('Failed to fetch profile', 500);
  }
}

// PUT /api/profiles/[id] - Update profile
export async function PUT(
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
    
    // Fields that can be updated
    const updateData: Record<string, unknown> = {};
    
    const allowedFields = [
      'firstName', 'lastName', 'headline', 'photoUrl', 'bannerUrl',
      'location', 'countryCode', 'postalCode', 'industryId', 'industryName',
      'summary', 'websiteUrl', 'linkedinUrl', 'twitterHandle', 'status'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Handle status changes
    if (body.status === 'published') {
      updateData['publishedAt'] = new Date();
    }

    const updatedProfile = await db.linkedInProfileDraft.update({
      where: { id },
      data: updateData,
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return apiSuccess(updatedProfile, 'Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    return apiError('Failed to update profile', 500);
  }
}

// DELETE /api/profiles/[id] - Delete profile
export async function DELETE(
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

    // Delete profile (cascades to related records)
    await db.linkedInProfileDraft.delete({
      where: { id },
    });

    return apiSuccess({ id }, 'Profile deleted successfully');
  } catch (error) {
    console.error('Error deleting profile:', error);
    return apiError('Failed to delete profile', 500);
  }
}
