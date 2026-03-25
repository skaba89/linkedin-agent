// Content Calendar API - List and Create
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

// GET /api/content/calendar - List calendars
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const { searchParams } = new URL(request.url);
    const { page, limit } = getPaginationParams(searchParams);
    
    // Filters
    const workspaceId = searchParams.get('workspaceId');
    const isActive = searchParams.get('isActive');

    // Build where clause
    const where: Record<string, unknown> = {
      OR: [
        { userId: session.user.id },
        { 
          workspace: {
            members: {
              some: {
                userId: session.user.id
              }
            }
          }
        },
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

    if (workspaceId) {
      // Verify user has access to workspace
      const workspaceMember = await db.workspaceMember.findFirst({
        where: {
          workspaceId,
          userId: session.user.id
        }
      });

      if (!workspaceMember) {
        return apiError('Access to workspace denied', 403);
      }
      where.workspaceId = workspaceId;
      delete where.OR;
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    // Get total count
    const total = await db.contentCalendar.count({ where });

    // Get calendars
    const calendars = await db.contentCalendar.findMany({
      where,
      include: {
        workspace: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            contentPosts: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: getOffset(page, limit),
      take: limit
    });

    // Parse JSON fields for response
    const parsedCalendars = calendars.map(calendar => ({
      ...calendar,
      postingDays: calendar.postingDays ? JSON.parse(calendar.postingDays) : null,
      postingTimes: calendar.postingTimes ? JSON.parse(calendar.postingTimes) : null,
      _count: calendar._count
    }));

    return apiSuccess(parsedCalendars, undefined, calculatePaginationMeta(total, page, limit));
  } catch (error) {
    console.error('Error fetching calendars:', error);
    return apiError('Failed to fetch calendars', 500);
  }
}

// POST /api/content/calendar - Create a new calendar
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

    if (!body.startDate) {
      return apiError('Start date is required', 400);
    }

    // Validate workspace access if provided
    if (body.workspaceId) {
      const workspaceMember = await db.workspaceMember.findFirst({
        where: {
          workspaceId: body.workspaceId,
          userId: session.user.id
        }
      });

      if (!workspaceMember) {
        return apiError('Access to workspace denied', 403);
      }
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

    // Create calendar
    const calendar = await db.contentCalendar.create({
      data: {
        userId: session.user.id,
        workspaceId: body.workspaceId || null,
        organizationId: body.organizationId || null,
        name: body.name,
        description: body.description || null,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        postingDays: body.postingDays ? JSON.stringify(body.postingDays) : null,
        postingTimes: body.postingTimes ? JSON.stringify(body.postingTimes) : null,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    });

    return apiSuccess(calendar, 'Calendar created successfully', undefined);
  } catch (error) {
    console.error('Error creating calendar:', error);
    return apiError('Failed to create calendar', 500);
  }
}
