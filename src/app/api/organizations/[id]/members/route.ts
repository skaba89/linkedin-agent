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

// Helper to check if user has admin access to organization
async function checkOrgAdminAccess(orgId: string, userId: string) {
  const membership = await db.organizationMember.findFirst({
    where: {
      organizationId: orgId,
      userId,
      role: { in: ['owner', 'admin'] },
      invitationStatus: 'accepted',
    },
  });
  return membership;
}

// Helper to check if user has access to organization
async function checkOrgMemberAccess(orgId: string, userId: string) {
  const membership = await db.organizationMember.findFirst({
    where: {
      organizationId: orgId,
      userId,
      invitationStatus: 'accepted',
    },
  });
  return membership;
}

// GET /api/organizations/[id]/members - List members
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

  const membership = await checkOrgMemberAccess(id, userId);
  if (!membership) {
    return apiNotFound('Organization not found or you do not have access');
  }

  const { searchParams } = new URL(request.url);
  const { page, limit } = getPaginationParams(searchParams);

  // Get total count
  const total = await db.organizationMember.count({
    where: { organizationId: id },
  });

  const members = await db.organizationMember.findMany({
    where: { organizationId: id },
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
    organizationId: m.organizationId,
    userId: m.userId,
    role: m.role,
    permissions: m.permissions ? JSON.parse(m.permissions) : null,
    invitationStatus: m.invitationStatus,
    invitedBy: m.invitedBy,
    invitedAt: m.invitedAt,
    joinedAt: m.joinedAt,
    user: m.user,
  }));

  return apiSuccess(formattedMembers, undefined, calculatePaginationMeta(total, page, limit));
}

// POST /api/organizations/[id]/members - Add member
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

  const membership = await checkOrgAdminAccess(id, userId);
  if (!membership) {
    return apiForbidden('Only owners and admins can add members');
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return apiError('Invalid JSON body');
  }

  const { email, role = 'member' } = body;

  if (!email || !validateEmail(email)) {
    return apiError('Valid email is required');
  }

  const validRoles = ['owner', 'admin', 'member', 'viewer'];
  if (!validRoles.includes(role)) {
    return apiError(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
  }

  // Only owners can add other owners
  if (role === 'owner' && membership.role !== 'owner') {
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
  const existingMembership = await db.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: id,
        userId: userToAdd.id,
      },
    },
  });

  if (existingMembership) {
    if (existingMembership.invitationStatus === 'accepted') {
      return apiError('User is already a member of this organization');
    }
    if (existingMembership.invitationStatus === 'pending') {
      return apiError('User already has a pending invitation');
    }
    // Re-invite declined user
    await db.organizationMember.update({
      where: { id: existingMembership.id },
      data: {
        role,
        invitationStatus: 'pending',
        invitedBy: userId,
        invitedAt: new Date(),
      },
    });
    return apiSuccess(
      {
        id: existingMembership.id,
        organizationId: id,
        userId: userToAdd.id,
        role,
        invitationStatus: 'pending',
        user: {
          id: userToAdd.id,
          email: userToAdd.email,
          firstName: userToAdd.firstName,
          lastName: userToAdd.lastName,
          avatarUrl: userToAdd.avatarUrl,
        },
      },
      'Invitation sent successfully'
    );
  }

  // Create new membership with pending status
  const newMembership = await db.organizationMember.create({
    data: {
      organizationId: id,
      userId: userToAdd.id,
      role,
      invitationStatus: 'pending',
      invitedBy: userId,
      invitedAt: new Date(),
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
      organizationId: newMembership.organizationId,
      userId: newMembership.userId,
      role: newMembership.role,
      invitationStatus: newMembership.invitationStatus,
      invitedBy: newMembership.invitedBy,
      invitedAt: newMembership.invitedAt,
      user: newMembership.user,
    },
    'Invitation sent successfully'
  );
}
