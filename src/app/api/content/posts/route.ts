// Content Posts API - List and Create
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
import { PostType, PostStatus } from '@/types';

// GET /api/content/posts - List posts with filtering
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const { searchParams } = new URL(request.url);
    const { page, limit } = getPaginationParams(searchParams);
    
    // Filters
    const status = searchParams.get('status') as PostStatus | null;
    const postType = searchParams.get('postType') as PostType | null;
    const workspaceId = searchParams.get('workspaceId');
    const calendarId = searchParams.get('calendarId');
    const scheduled = searchParams.get('scheduled'); // 'true', 'false', or null
    const search = searchParams.get('search');

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
        }
      ]
    };

    if (status) {
      where.status = status;
    }

    if (postType) {
      where.postType = postType;
    }

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
      // Remove the OR clause when filtering by workspace
      delete where.OR;
    }

    if (calendarId) {
      where.calendarId = calendarId;
    }

    if (scheduled === 'true') {
      where.scheduledFor = { not: null };
    } else if (scheduled === 'false') {
      where.scheduledFor = null;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ];
    }

    // Get total count
    const total = await db.contentPost.count({ where });

    // Get posts
    const posts = await db.contentPost.findMany({
      where,
      include: {
        workspace: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { scheduledFor: 'asc' },
        { createdAt: 'desc' }
      ],
      skip: getOffset(page, limit),
      take: limit
    });

    // Parse JSON fields for response
    const parsedPosts = posts.map(post => ({
      ...post,
      hooks: post.hooks ? JSON.parse(post.hooks) : null,
      mediaUrls: post.mediaUrls ? JSON.parse(post.mediaUrls) : null,
      carouselSlides: post.carouselSlides ? JSON.parse(post.carouselSlides) : null
    }));

    return apiSuccess(parsedPosts, undefined, calculatePaginationMeta(total, page, limit));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return apiError('Failed to fetch posts', 500);
  }
}

// POST /api/content/posts - Create a new post
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.content) {
      return apiError('Content is required', 400);
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

    // Validate calendar access if provided
    if (body.calendarId) {
      const calendar = await db.contentCalendar.findFirst({
        where: {
          id: body.calendarId,
          OR: [
            { userId: session.user.id },
            { 
              workspace: {
                members: {
                  some: { userId: session.user.id }
                }
              }
            }
          ]
        }
      });

      if (!calendar) {
        return apiError('Calendar not found or access denied', 404);
      }
    }

    // Create post
    const post = await db.contentPost.create({
      data: {
        userId: session.user.id,
        workspaceId: body.workspaceId || null,
        organizationId: body.organizationId || null,
        postType: body.postType || 'text',
        postCategory: body.postCategory || null,
        title: body.title || null,
        content: body.content,
        hooks: body.hooks ? JSON.stringify(body.hooks) : null,
        mediaUrls: body.mediaUrls ? JSON.stringify(body.mediaUrls) : null,
        mediaType: body.mediaType || null,
        carouselSlides: body.carouselSlides ? JSON.stringify(body.carouselSlides) : null,
        targetAudience: body.targetAudience || null,
        targetIndustry: body.targetIndustry || null,
        targetRole: body.targetRole || null,
        tone: body.tone || null,
        language: body.language || 'en',
        aiPrompt: body.aiPrompt || null,
        aiModel: body.aiModel || null,
        isAIGenerated: body.isAIGenerated || false,
        status: body.status || 'draft',
        scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : null,
        publishToProfile: body.publishToProfile || false,
        publishToPageId: body.publishToPageId || null,
        templateId: body.templateId || null,
        calendarId: body.calendarId || null
      }
    });

    return apiSuccess(post, 'Post created successfully', undefined);
  } catch (error) {
    console.error('Error creating post:', error);
    return apiError('Failed to create post', 500);
  }
}
