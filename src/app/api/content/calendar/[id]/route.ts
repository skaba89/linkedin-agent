// Content Calendar API - Get, Update, Delete by ID
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized, apiNotFound } from '@/lib/api';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Helper to check calendar access
async function checkCalendarAccess(calendarId: string, userId: string, requireOwnership: boolean = false) {
  const calendar = await db.contentCalendar.findUnique({
    where: { id: calendarId }
  });

  if (!calendar) {
    return { calendar: null, hasAccess: false };
  }

  // Owner has full access
  if (calendar.userId === userId) {
    return { calendar, hasAccess: true };
  }

  // Check workspace membership for non-owner access
  if (calendar.workspaceId) {
    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId: calendar.workspaceId,
        userId
      }
    });

    if (workspaceMember) {
      if (requireOwnership) {
        const canModify = ['owner', 'admin', 'editor'].includes(workspaceMember.role);
        return { calendar, hasAccess: canModify };
      }
      return { calendar, hasAccess: true };
    }
  }

  // Check organization membership for non-owner access
  if (calendar.organizationId) {
    const orgMember = await db.organizationMember.findFirst({
      where: {
        organizationId: calendar.organizationId,
        userId
      }
    });

    if (orgMember) {
      if (requireOwnership) {
        const canModify = ['owner', 'admin'].includes(orgMember.role);
        return { calendar, hasAccess: canModify };
      }
      return { calendar, hasAccess: true };
    }
  }

  return { calendar, hasAccess: false };
}

// GET /api/content/calendar/[id] - Get a single calendar with posts
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { id } = await params;

  try {
    const { calendar, hasAccess } = await checkCalendarAccess(id, session.user.id);

    if (!calendar) {
      return apiNotFound('Calendar not found');
    }

    if (!hasAccess) {
      return apiError('Access denied', 403);
    }

    // Get posts for this calendar
    const posts = await db.contentPost.findMany({
      where: { calendarId: id },
      orderBy: { scheduledFor: 'asc' }
    });

    // Parse JSON fields
    const responseCalendar = {
      ...calendar,
      postingDays: calendar.postingDays ? JSON.parse(calendar.postingDays) : null,
      postingTimes: calendar.postingTimes ? JSON.parse(calendar.postingTimes) : null,
      posts: posts.map(post => ({
        ...post,
        hooks: post.hooks ? JSON.parse(post.hooks) : null,
        mediaUrls: post.mediaUrls ? JSON.parse(post.mediaUrls) : null,
        carouselSlides: post.carouselSlides ? JSON.parse(post.carouselSlides) : null
      }))
    };

    return apiSuccess(responseCalendar);
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return apiError('Failed to fetch calendar', 500);
  }
}

// PUT /api/content/calendar/[id] - Update a calendar
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { id } = await params;

  try {
    const { calendar, hasAccess } = await checkCalendarAccess(id, session.user.id, true);

    if (!calendar) {
      return apiNotFound('Calendar not found');
    }

    if (!hasAccess) {
      return apiError('Access denied', 403);
    }

    const body = await request.json();

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.postingDays !== undefined) updateData.postingDays = body.postingDays ? JSON.stringify(body.postingDays) : null;
    if (body.postingTimes !== undefined) updateData.postingTimes = body.postingTimes ? JSON.stringify(body.postingTimes) : null;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    // Update calendar
    const updatedCalendar = await db.contentCalendar.update({
      where: { id },
      data: updateData
    });

    return apiSuccess(updatedCalendar, 'Calendar updated successfully');
  } catch (error) {
    console.error('Error updating calendar:', error);
    return apiError('Failed to update calendar', 500);
  }
}

// DELETE /api/content/calendar/[id] - Delete a calendar
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { id } = await params;

  try {
    const { calendar, hasAccess } = await checkCalendarAccess(id, session.user.id, true);

    if (!calendar) {
      return apiNotFound('Calendar not found');
    }

    if (!hasAccess) {
      return apiError('Access denied', 403);
    }

    // Check if calendar has posts
    const postsCount = await db.contentPost.count({
      where: { calendarId: id }
    });

    if (postsCount > 0) {
      // Option to remove calendar from posts instead of blocking deletion
      await db.contentPost.updateMany({
        where: { calendarId: id },
        data: { calendarId: null }
      });
    }

    await db.contentCalendar.delete({
      where: { id }
    });

    return apiSuccess({ id }, 'Calendar deleted successfully');
  } catch (error) {
    console.error('Error deleting calendar:', error);
    return apiError('Failed to delete calendar', 500);
  }
}
