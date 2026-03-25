import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  apiSuccess,
  apiError,
  apiUnauthorized,
  apiNotFound,
  getPaginationParams,
  calculatePaginationMeta,
  getOffset,
  generateSlug,
} from '@/lib/api';

// Helper to check if user has access to organization
async function checkOrgAccess(orgId: string, userId: string) {
  const membership = await db.organizationMember.findFirst({
    where: {
      organizationId: orgId,
      userId,
      invitationStatus: 'accepted',
    },
  });
  return membership;
}

// GET /api/workspaces - List workspaces
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { searchParams } = new URL(request.url);
  const { page, limit } = getPaginationParams(searchParams);
  const organizationId = searchParams.get('organizationId');

  const userId = session.user.id;

  // Build where clause
  const whereClause: {
    workspace: {
      isActive: boolean;
      organizationId?: string;
    };
    userId: string;
  } = {
    userId,
    workspace: {
      isActive: true,
    },
  };

  // If organizationId is provided, filter by it
  if (organizationId) {
    // Verify user has access to the organization
    const orgAccess = await checkOrgAccess(organizationId, userId);
    if (!orgAccess) {
      return apiNotFound('Organization not found or you do not have access');
    }
    whereClause.workspace.organizationId = organizationId;
  }

  // Get total count
  const total = await db.workspaceMember.count({
    where: whereClause,
  });

  // Get workspaces where user is a member
  const memberships = await db.workspaceMember.findMany({
    where: whereClause,
    include: {
      workspace: {
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
            },
          },
          linkedinProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              headline: true,
              photoUrl: true,
              status: true,
            },
          },
          _count: {
            select: {
              members: true,
              linkedinPages: true,
              contentPosts: true,
            },
          },
        },
      },
    },
    orderBy: {
      joinedAt: 'desc',
    },
    skip: getOffset(page, limit),
    take: limit,
  });

  const workspaces = memberships.map((m) => ({
    id: m.workspace.id,
    organizationId: m.workspace.organizationId,
    name: m.workspace.name,
    slug: m.workspace.slug,
    description: m.workspace.description,
    iconUrl: m.workspace.iconUrl,
    workspaceType: m.workspace.workspaceType,
    isActive: m.workspace.isActive,
    createdAt: m.workspace.createdAt,
    updatedAt: m.workspace.updatedAt,
    organization: m.workspace.organization,
    linkedinProfile: m.workspace.linkedinProfile,
    memberCount: m.workspace._count.members,
    pagesCount: m.workspace._count.linkedinPages,
    postsCount: m.workspace._count.contentPosts,
    userRole: m.role,
  }));

  return apiSuccess(workspaces, undefined, calculatePaginationMeta(total, page, limit));
}

// POST /api/workspaces - Create workspace
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return apiError('Invalid JSON body');
  }

  const {
    organizationId,
    name,
    description,
    iconUrl,
    workspaceType = 'company',
    agencyClientId,
  } = body;

  if (!organizationId) {
    return apiError('Organization ID is required');
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return apiError('Workspace name is required');
  }

  const userId = session.user.id;

  // Check if user has access to the organization
  const orgMembership = await checkOrgAccess(organizationId, userId);
  if (!orgMembership) {
    return apiNotFound('Organization not found or you do not have access');
  }

  // Only owners and admins can create workspaces
  if (!['owner', 'admin'].includes(orgMembership.role)) {
    return apiError('Only owners and admins can create workspaces');
  }

  // Generate unique slug within organization
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (
    await db.workspace.findFirst({
      where: { organizationId, slug },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // Create workspace and add user as owner
  const workspace = await db.$transaction(async (tx) => {
    const ws = await tx.workspace.create({
      data: {
        organizationId,
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        iconUrl: iconUrl?.trim() || null,
        workspaceType,
        agencyClientId: agencyClientId || null,
      },
    });

    await tx.workspaceMember.create({
      data: {
        workspaceId: ws.id,
        userId,
        role: 'owner',
      },
    });

    return ws;
  });

  return apiSuccess(
    {
      id: workspace.id,
      organizationId: workspace.organizationId,
      name: workspace.name,
      slug: workspace.slug,
      description: workspace.description,
      iconUrl: workspace.iconUrl,
      workspaceType: workspace.workspaceType,
      isActive: workspace.isActive,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    },
    'Workspace created successfully'
  );
}
