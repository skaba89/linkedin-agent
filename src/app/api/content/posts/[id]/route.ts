// Content Post API - Get, Update, Delete by ID
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized, apiNotFound } from '@/lib/api';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Helper to check post access
async function checkPostAccess(postId: string, userId: string, requireOwnership: boolean = false) {
  const post = await db.contentPost.findUnique({
    where: { id: postId }
  });

  if (!post) {
    return { post: null, hasAccess: false };
  }

  // Owner has full access
  if (post.userId === userId) {
    return { post, hasAccess: true };
  }

  // Check workspace membership for non-owner access
  if (post.workspaceId) {
    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId: post.workspaceId,
        userId
      }
    });

    if (workspaceMember) {
      // Editors and owners can modify, viewers can only read
      if (requireOwnership) {
        const canModify = ['owner', 'admin', 'editor'].includes(workspaceMember.role);
        return { post, hasAccess: canModify };
      }
      return { post, hasAccess: true };
    }
  }

  return { post, hasAccess: false };
}

// GET /api/content/posts/[id] - Get a single post
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { id } = await params;

  try {
    const { post, hasAccess } = await checkPostAccess(id, session.user.id);

    if (!post) {
      return apiNotFound('Post not found');
    }

    if (!hasAccess) {
      return apiError('Access denied', 403);
    }

    // Parse JSON fields
    const responsePost = {
      ...post,
      hooks: post.hooks ? JSON.parse(post.hooks) : null,
      mediaUrls: post.mediaUrls ? JSON.parse(post.mediaUrls) : null,
      carouselSlides: post.carouselSlides ? JSON.parse(post.carouselSlides) : null
    };

    return apiSuccess(responsePost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return apiError('Failed to fetch post', 500);
  }
}

// PUT /api/content/posts/[id] - Update a post
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { id } = await params;

  try {
    const { post, hasAccess } = await checkPostAccess(id, session.user.id, true);

    if (!post) {
      return apiNotFound('Post not found');
    }

    if (!hasAccess) {
      return apiError('Access denied', 403);
    }

    const body = await request.json();

    // Don't allow updating published posts
    if (post.status === 'published') {
      return apiError('Cannot update a published post', 400);
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    if (body.postType !== undefined) updateData.postType = body.postType;
    if (body.postCategory !== undefined) updateData.postCategory = body.postCategory;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.hooks !== undefined) updateData.hooks = body.hooks ? JSON.stringify(body.hooks) : null;
    if (body.mediaUrls !== undefined) updateData.mediaUrls = body.mediaUrls ? JSON.stringify(body.mediaUrls) : null;
    if (body.mediaType !== undefined) updateData.mediaType = body.mediaType;
    if (body.carouselSlides !== undefined) updateData.carouselSlides = body.carouselSlides ? JSON.stringify(body.carouselSlides) : null;
    if (body.targetAudience !== undefined) updateData.targetAudience = body.targetAudience;
    if (body.targetIndustry !== undefined) updateData.targetIndustry = body.targetIndustry;
    if (body.targetRole !== undefined) updateData.targetRole = body.targetRole;
    if (body.tone !== undefined) updateData.tone = body.tone;
    if (body.language !== undefined) updateData.language = body.language;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.scheduledFor !== undefined) updateData.scheduledFor = body.scheduledFor ? new Date(body.scheduledFor) : null;
    if (body.publishToProfile !== undefined) updateData.publishToProfile = body.publishToProfile;
    if (body.publishToPageId !== undefined) updateData.publishToPageId = body.publishToPageId;
    if (body.calendarId !== undefined) updateData.calendarId = body.calendarId;

    // Update post
    const updatedPost = await db.contentPost.update({
      where: { id },
      data: updateData
    });

    return apiSuccess(updatedPost, 'Post updated successfully');
  } catch (error) {
    console.error('Error updating post:', error);
    return apiError('Failed to update post', 500);
  }
}

// DELETE /api/content/posts/[id] - Delete a post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { id } = await params;

  try {
    const { post, hasAccess } = await checkPostAccess(id, session.user.id, true);

    if (!post) {
      return apiNotFound('Post not found');
    }

    if (!hasAccess) {
      return apiError('Access denied', 403);
    }

    // Don't allow deleting published posts (should unpublish first)
    if (post.status === 'published') {
      return apiError('Cannot delete a published post. Unpublish it first.', 400);
    }

    await db.contentPost.delete({
      where: { id }
    });

    return apiSuccess({ id }, 'Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
    return apiError('Failed to delete post', 500);
  }
}
