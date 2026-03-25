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

// DELETE /api/organizations/[id]/members/[memberId] - Remove member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { id, memberId } = await params;
  const userId = session.user.id;

  // Get the member to remove
  const memberToRemove = await db.organizationMember.findUnique({
    where: { id: memberId },
    include: {
      organization: true,
    },
  });

  if (!memberToRemove || memberToRemove.organizationId !== id) {
    return apiNotFound('Member not found');
  }

  // Check if user is trying to remove themselves
  const isSelf = memberToRemove.userId === userId;

  // Get current user's membership
  const currentUserMembership = await db.organizationMember.findFirst({
    where: {
      organizationId: id,
      userId,
      invitationStatus: 'accepted',
    },
  });

  if (!currentUserMembership) {
    return apiNotFound('Organization not found or you do not have access');
  }

  // Role hierarchy
  const roleHierarchy = ['viewer', 'member', 'admin', 'owner'];
  const currentUserRoleIndex = roleHierarchy.indexOf(currentUserMembership.role);
  const targetRoleIndex = roleHierarchy.indexOf(memberToRemove.role);

  // Users can remove themselves, otherwise need admin access
  if (!isSelf) {
    if (!['owner', 'admin'].includes(currentUserMembership.role)) {
      return apiForbidden('Only owners and admins can remove members');
    }

    // Cannot remove someone with equal or higher role
    if (targetRoleIndex >= currentUserRoleIndex) {
      return apiForbidden('Cannot remove a member with equal or higher role');
    }
  }

  // Check if this is the last owner
  if (memberToRemove.role === 'owner') {
    const ownerCount = await db.organizationMember.count({
      where: {
        organizationId: id,
        role: 'owner',
        invitationStatus: 'accepted',
      },
    });

    if (ownerCount <= 1) {
      return apiError('Cannot remove the last owner. Transfer ownership first or delete the organization.');
    }
  }

  // Remove member
  await db.organizationMember.delete({
    where: { id: memberId },
  });

  return apiSuccess(null, 'Member removed successfully');
}
