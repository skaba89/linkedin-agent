import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  apiSuccess,
  apiError,
  apiUnauthorized,
  apiNotFound,
  apiForbidden,
  getPaginationParams,
  calculatePaginationMeta,
  getOffset,
  validateEmail,
} from '@/lib/api';

// Helper to check if user has admin access to workspace
async function checkWorkspaceAdminAccess(workspaceId: string, userId: string) {
  const membership = await db.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
      role: { in: ['owner', 'admin'] },
    },
  });
  return membership;
}

// Helper to check if user has access to workspace
async function checkWorkspaceMemberAccess(workspaceId: string, userId: string) {
  const membership = await db.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
    },
  });
  return membership;
}

// GET /api/workspaces/[id]/members - List members
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

  const membership = await checkWorkspaceMemberAccess(id, userId);
  if (!membership) {
    return apiNotFound('Workspace not found or you do not have access');
  }

  const { searchParams } = new URL(request.url);
  const { page, limit } = getPaginationParams(searchParams);

  // Get total count
  const total = await db.workspaceMember.count({
    where: { workspaceId: id },
  });

  const members = await db.workspaceMember.findMany({
    where: { workspaceId: id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: [
      { role: 'asc' },
      { joinedAt: 'asc' },
    ],
    skip: getOffset(page, limit),
    take: limit,
  });

  const formattedMembers = members.map((m) => ({
    id: m.id,
    workspaceId: m.workspaceId,
    userId: m.userId,
    role: m.role,
    permissions: m.permissions ? JSON.parse(m.permissions) : null,
    joinedAt: m.joinedAt,
    user: m.user,
  }));

  return apiSuccess(formattedMembers, undefined, calculatePaginationMeta(total, page, limit));
}

// POST /api/workspaces/[id]/members - Add workspace member
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { id } = await params;
  const userId = session.user.id;

  // Check if user has admin access to workspace
  const workspaceMembership = await checkWorkspaceAdminAccess(id, userId);
  if (!workspaceMembership) {
    return apiForbidden('Only owners and admins can add members');
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return apiError('Invalid JSON body');
  }

  const { email, role = 'editor' } = body;

  if (!email || !validateEmail(email)) {
    return apiError('Valid email is required');
  }

  const validRoles = ['owner', 'admin', 'editor', 'viewer'];
  if (!validRoles.includes(role)) {
    return apiError(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
  }

  // Only owners can add other owners
  if (role === 'owner' && workspaceMembership.role !== 'owner') {
    return apiForbidden('Only owners can add other owners');
  }

  // Find user by email
  const userToAdd = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!userToAdd) {
    return apiError('User not found. They need to create an account first.');
  }

  // Check if user is already a member
  const existingMembership = await db.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: id,
        userId: userToAdd.id,
      },
    },
  });

  if (existingMembership) {
    return apiError('User is already a member of this workspace');
  }

  // Verify user is a member of the organization
  const workspace = await db.workspace.findUnique({
    where: { id },
    select: { organizationId: true },
  });

  if (!workspace) {
    return apiNotFound('Workspace not found');
  }

  const orgMembership = await db.organizationMember.findFirst({
    where: {
      organizationId: workspace.organizationId,
      userId: userToAdd.id,
      invitationStatus: 'accepted',
    },
  });

  if (!orgMembership) {
    return apiError('User must be a member of the organization first');
  }

  // Create new membership
  const newMembership = await db.workspaceMember.create({
    data: {
      workspaceId: id,
      userId: userToAdd.id,
      role,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
    },
  });

  return apiSuccess(
    {
      id: newMembership.id,
      workspaceId: newMembership.workspaceId,
      userId: newMembership.userId,
      role: newMembership.role,
      joinedAt: newMembership.joinedAt,
      user: newMembership.user,
    },
    'Member added successfully'
  );
}
