import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { 
  apiSuccess, 
  apiError, 
  apiUnauthorized,
  getPaginationParams,
  calculatePaginationMeta,
  getOffset
} from '@/lib/api';
import { db } from '@/lib/db';

// GET /api/profiles - List user's profile drafts
export async function GET(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return apiUnauthorized();
  }

  const { searchParams } = new URL(request.url);
  const { page, limit } = getPaginationParams(searchParams);
  const status = searchParams.get('status');
  const workspaceId = searchParams.get('workspaceId');

  try {
    // Get user's workspaces through workspace members
    const workspaceMembers = await db.workspaceMember.findMany({
      where: { userId: session.user.id },
      select: { workspaceId: true },
    });

    const workspaceIds = workspaceMembers.map(wm => wm.workspaceId);

    if (workspaceIds.length === 0) {
      return apiSuccess({
        items: [],
        page,
        limit,
        total: 0,
        hasMore: false,
      });
    }

    // Build where clause
    const where: {
      workspaceId: { in: string[] };
      status?: string;
    } = {
      workspaceId: { in: workspaceIds },
    };

    if (status) {
      where.status = status;
    }

    // If specific workspace requested, verify access
    if (workspaceId) {
      if (!workspaceIds.includes(workspaceId)) {
        return apiError('Access denied to this workspace', 403);
      }
      where.workspaceId = { in: [workspaceId] };
    }

    // Get total count
    const total = await db.linkedInProfileDraft.count({ where });

    // Get profiles with pagination
    const profiles = await db.linkedInProfileDraft.findMany({
      where,
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            experiences: true,
            educations: true,
            skills: true,
            certifications: true,
            projects: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip: getOffset(page, limit),
      take: limit,
    });

    const meta = calculatePaginationMeta(total, page, limit);

    return apiSuccess({
      items: profiles,
      ...meta,
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return apiError('Failed to fetch profiles', 500);
  }
}

// POST /api/profiles - Create new profile draft
export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const body = await request.json();
    const { workspaceId, ...profileData } = body;

    // Verify workspace access
    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!workspaceMember) {
      return apiError('Access denied to this workspace', 403);
    }

    // Check if workspace already has a profile
    const existingProfile = await db.linkedInProfileDraft.findUnique({
      where: { workspaceId },
    });

    if (existingProfile) {
      return apiError('This workspace already has a profile draft', 400);
    }

    // Create profile draft
    const profile = await db.linkedInProfileDraft.create({
      data: {
        workspaceId,
        firstName: profileData.firstName || session.user.firstName,
        lastName: profileData.lastName || session.user.lastName,
        headline: profileData.headline,
        photoUrl: profileData.photoUrl,
        bannerUrl: profileData.bannerUrl,
        location: profileData.location,
        countryCode: profileData.countryCode,
        postalCode: profileData.postalCode,
        industryId: profileData.industryId,
        industryName: profileData.industryName,
        summary: profileData.summary,
        websiteUrl: profileData.websiteUrl,
        linkedinUrl: profileData.linkedinUrl,
        twitterHandle: profileData.twitterHandle,
        status: 'draft',
      },
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

    return apiSuccess(profile, 'Profile draft created successfully');
  } catch (error) {
    console.error('Error creating profile:', error);
    return apiError('Failed to create profile draft', 500);
  }
}
