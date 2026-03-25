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

// Helper to check if user has access to organization
async function checkOrgAccess(orgId: string, userId: string, minRole: string[] = ['owner', 'admin', 'member', 'viewer']) {
  const membership = await db.organizationMember.findFirst({
    where: {
      organizationId: orgId,
      userId,
      invitationStatus: 'accepted',
    },
  });

  if (!membership) {
    return null;
  }

  const roleHierarchy = ['viewer', 'member', 'admin', 'owner'];
  const hasAccess = minRole.includes(membership.role) || 
    roleHierarchy.indexOf(membership.role) >= Math.min(...minRole.map(r => roleHierarchy.indexOf(r)));

  return hasAccess ? membership : null;
}

// GET /api/organizations/[id] - Get organization details
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

  const membership = await checkOrgAccess(id, userId);
  if (!membership) {
    return apiNotFound('Organization not found or you do not have access');
  }

  const organization = await db.organization.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          members: true,
          workspaces: true,
        },
      },
    },
  });

  if (!organization) {
    return apiNotFound('Organization not found');
  }

  return apiSuccess({
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    description: organization.description,
    logoUrl: organization.logoUrl,
    website: organization.website,
    orgType: organization.orgType,
    planType: organization.planType,
    settings: organization.settings ? JSON.parse(organization.settings) : null,
    planLimits: organization.planLimits ? JSON.parse(organization.planLimits) : null,
    createdAt: organization.createdAt,
    updatedAt: organization.updatedAt,
    memberCount: organization._count.members,
    workspaceCount: organization._count.workspaces,
    userRole: membership.role,
  });
}

// PUT /api/organizations/[id] - Update organization
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

  const membership = await checkOrgAccess(id, userId, ['owner', 'admin']);
  if (!membership) {
    return apiForbidden('You do not have permission to update this organization');
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return apiError('Invalid JSON body');
  }

  const { name, description, logoUrl, website, settings } = body;

  const updateData: {
    name?: string;
    description?: string | null;
    logoUrl?: string | null;
    website?: string | null;
    settings?: string;
  } = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return apiError('Organization name must be a non-empty string');
    }
    updateData.name = name.trim();
  }

  if (description !== undefined) {
    updateData.description = description?.trim() || null;
  }

  if (logoUrl !== undefined) {
    updateData.logoUrl = logoUrl?.trim() || null;
  }

  if (website !== undefined) {
    updateData.website = website?.trim() || null;
  }

  if (settings !== undefined) {
    updateData.settings = JSON.stringify(settings);
  }

  if (Object.keys(updateData).length === 0) {
    return apiError('No valid fields to update');
  }

  const organization = await db.organization.update({
    where: { id },
    data: updateData,
  });

  return apiSuccess(
    {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      description: organization.description,
      logoUrl: organization.logoUrl,
      website: organization.website,
      orgType: organization.orgType,
      planType: organization.planType,
      settings: organization.settings ? JSON.parse(organization.settings) : null,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    },
    'Organization updated successfully'
  );
}

// DELETE /api/organizations/[id] - Delete organization
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

  // Only owners can delete organizations
  const membership = await db.organizationMember.findFirst({
    where: {
      organizationId: id,
      userId,
      role: 'owner',
      invitationStatus: 'accepted',
    },
  });

  if (!membership) {
    return apiForbidden('Only owners can delete organizations');
  }

  // Check if there are other owners
  const otherOwners = await db.organizationMember.count({
    where: {
      organizationId: id,
      role: 'owner',
      userId: { not: userId },
    },
  });

  // Delete organization (cascade will handle related records)
  await db.organization.delete({
    where: { id },
  });

  return apiSuccess(null, 'Organization deleted successfully');
}
