import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  apiSuccess,
  apiError,
  apiUnauthorized,
  apiNotFound,
  apiForbidden,
} from '@/lib/api';

// Helper to check if user has access to workspace
async function checkWorkspaceAccess(workspaceId: string, userId: string, minRole: string[] = ['owner', 'admin', 'editor', 'viewer']) {
  const membership = await db.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
    },
  });

  if (!membership) {
    return null;
  }

  const roleHierarchy = ['viewer', 'editor', 'admin', 'owner'];
  const hasAccess = minRole.includes(membership.role) || 
    roleHierarchy.indexOf(membership.role) >= Math.min(...minRole.map(r => roleHierarchy.indexOf(r)));

  return hasAccess ? membership : null;
}

// GET /api/workspaces/[id] - Get workspace with profile/pages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { id } = await params;
  const userId = session.user.id;

  const membership = await checkWorkspaceAccess(id, userId);
  if (!membership) {
    return apiNotFound('Workspace not found or you do not have access');
  }

  const workspace = await db.workspace.findUnique({
    where: { id },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          planType: true,
        },
      },
      linkedinProfile: {
        include: {
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
      },
      linkedinPages: {
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          members: true,
          contentPosts: true,
        },
      },
    },
  });

  if (!workspace) {
    return apiNotFound('Workspace not found');
  }

  return apiSuccess({
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
    organization: workspace.organization,
    linkedinProfile: workspace.linkedinProfile,
    linkedinPages: workspace.linkedinPages,
    memberCount: workspace._count.members,
    postsCount: workspace._count.contentPosts,
    userRole: membership.role,
  });
}

// PUT /api/workspaces/[id] - Update workspace
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { id } = await params;
  const userId = session.user.id;

  const membership = await checkWorkspaceAccess(id, userId, ['owner', 'admin']);
  if (!membership) {
    return apiForbidden('You do not have permission to update this workspace');
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return apiError('Invalid JSON body');
  }

  const { name, description, iconUrl, settings, isActive } = body;

  const updateData: {
    name?: string;
    description?: string | null;
    iconUrl?: string | null;
    settings?: string;
    isActive?: boolean;
  } = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return apiError('Workspace name must be a non-empty string');
    }
    updateData.name = name.trim();
  }

  if (description !== undefined) {
    updateData.description = description?.trim() || null;
  }

  if (iconUrl !== undefined) {
    updateData.iconUrl = iconUrl?.trim() || null;
  }

  if (settings !== undefined) {
    updateData.settings = JSON.stringify(settings);
  }

  if (isActive !== undefined) {
    updateData.isActive = Boolean(isActive);
  }

  if (Object.keys(updateData).length === 0) {
    return apiError('No valid fields to update');
  }

  const workspace = await db.workspace.update({
    where: { id },
    data: updateData,
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
    'Workspace updated successfully'
  );
}

// DELETE /api/workspaces/[id] - Delete workspace
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { id } = await params;
  const userId = session.user.id;

  // Only owners can delete workspaces
  const membership = await db.workspaceMember.findFirst({
    where: {
      workspaceId: id,
      userId,
      role: 'owner',
    },
  });

  if (!membership) {
    return apiForbidden('Only workspace owners can delete workspaces');
  }

  // Delete workspace (cascade will handle related records)
  await db.workspace.delete({
    where: { id },
  });

  return apiSuccess(null, 'Workspace deleted successfully');
}
