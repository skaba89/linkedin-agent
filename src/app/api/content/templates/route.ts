// Content Templates API - List and Create
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

// GET /api/content/templates - List templates (public + user's)
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const { searchParams } = new URL(request.url);
    const { page, limit } = getPaginationParams(searchParams);
    
    // Filters
    const category = searchParams.get('category');
    const isPublic = searchParams.get('isPublic');
    const organizationId = searchParams.get('organizationId');

    // Build where clause - include public templates + user's own templates
    const where: Record<string, unknown> = {
      OR: [
        { isPublic: true },
        { userId: session.user.id },
        { 
          organization: {
            members: {
              some: {
                userId: session.user.id
              }
            }
          }
        }
      ]
    };

    if (category) {
      where.category = category;
    }

    if (isPublic !== null) {
      where.isPublic = isPublic === 'true';
    }

    if (organizationId) {
      // Verify user has access to organization
      const orgMember = await db.organizationMember.findFirst({
        where: {
          organizationId,
          userId: session.user.id
        }
      });

      if (!orgMember) {
        return apiError('Access to organization denied', 403);
      }
      where.organizationId = organizationId;
    }

    // Get total count
    const total = await db.template.count({ where });

    // Get templates
    const templates = await db.template.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true
          }
        },
        organization: {
          select: {
            id: true,
            name: true,
            logoUrl: true
          }
        }
      },
      orderBy: [
        { isPublic: 'desc' },
        { usageCount: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: getOffset(page, limit),
      take: limit
    });

    // Parse JSON fields for response
    const parsedTemplates = templates.map(template => ({
      ...template,
      variables: template.variables ? JSON.parse(template.variables) : null
    }));

    return apiSuccess(parsedTemplates, undefined, calculatePaginationMeta(total, page, limit));
  } catch (error) {
    console.error('Error fetching templates:', error);
    return apiError('Failed to fetch templates', 500);
  }
}

// POST /api/content/templates - Create a new template
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return apiError('Name is required', 400);
    }

    if (!body.content) {
      return apiError('Content is required', 400);
    }

    // Validate organization access if provided
    if (body.organizationId) {
      const orgMember = await db.organizationMember.findFirst({
        where: {
          organizationId: body.organizationId,
          userId: session.user.id
        }
      });

      if (!orgMember) {
        return apiError('Access to organization denied', 403);
      }
    }

    // Create template
    const template = await db.template.create({
      data: {
        userId: session.user.id,
        organizationId: body.organizationId || null,
        name: body.name,
        description: body.description || null,
        category: body.category || null,
        content: body.content,
        variables: body.variables ? JSON.stringify(body.variables) : null,
        isPublic: body.isPublic || false,
        isPremium: body.isPremium || false
      }
    });

    return apiSuccess(template, 'Template created successfully', undefined);
  } catch (error) {
    console.error('Error creating template:', error);
    return apiError('Failed to create template', 500);
  }
}
