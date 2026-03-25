import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  apiSuccess,
  apiError,
  apiUnauthorized,
  getPaginationParams,
  calculatePaginationMeta,
  getOffset,
  generateSlug,
} from '@/lib/api';

// GET /api/organizations - List user's organizations
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { searchParams } = new URL(request.url);
  const { page, limit } = getPaginationParams(searchParams);

  const userId = session.user.id;

  // Get total count
  const total = await db.organizationMember.count({
    where: {
      userId,
      invitationStatus: 'accepted',
    },
  });

  // Get organizations where user is a member
  const memberships = await db.organizationMember.findMany({
    where: {
      userId,
      invitationStatus: 'accepted',
    },
    include: {
      organization: {
        include: {
          _count: {
            select: {
              members: true,
              workspaces: true,
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

  const organizations = memberships.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
    slug: m.organization.slug,
    description: m.organization.description,
    logoUrl: m.organization.logoUrl,
    website: m.organization.website,
    orgType: m.organization.orgType,
    planType: m.organization.planType,
    createdAt: m.organization.createdAt,
    updatedAt: m.organization.updatedAt,
    memberCount: m.organization._count.members,
    workspaceCount: m.organization._count.workspaces,
    userRole: m.role,
  }));

  return apiSuccess(organizations, undefined, calculatePaginationMeta(total, page, limit));
}

// POST /api/organizations - Create organization
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

  const { name, description, logoUrl, website, orgType = 'company' } = body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return apiError('Organization name is required');
  }

  const userId = session.user.id;

  // Generate unique slug
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (await db.organization.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // Create organization and add user as owner in a transaction
  const organization = await db.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        logoUrl: logoUrl?.trim() || null,
        website: website?.trim() || null,
        orgType,
        planType: 'free',
      },
    });

    await tx.organizationMember.create({
      data: {
        organizationId: org.id,
        userId,
        role: 'owner',
        invitationStatus: 'accepted',
      },
    });

    return org;
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
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    },
    'Organization created successfully'
  );
}
