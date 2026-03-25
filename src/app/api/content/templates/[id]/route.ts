// Content Template API - Get, Update, Delete by ID
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized, apiNotFound } from '@/lib/api';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Helper to check template access
async function checkTemplateAccess(templateId: string, userId: string, requireOwnership: boolean = false) {
  const template = await db.template.findUnique({
    where: { id: templateId }
  });

  if (!template) {
    return { template: null, hasAccess: false, canModify: false };
  }

  // Public templates are readable by everyone
  if (template.isPublic && !requireOwnership) {
    return { template, hasAccess: true, canModify: false };
  }

  // Owner has full access
  if (template.userId === userId) {
    return { template, hasAccess: true, canModify: true };
  }

  // Check organization membership for non-owner access
  if (template.organizationId) {
    const orgMember = await db.organizationMember.findFirst({
      where: {
        organizationId: template.organizationId,
        userId
      }
    });

    if (orgMember) {
      if (requireOwnership) {
        const canModify = ['owner', 'admin'].includes(orgMember.role);
        return { template, hasAccess: canModify, canModify };
      }
      return { template, hasAccess: true, canModify: ['owner', 'admin'].includes(orgMember.role) };
    }
  }

  // Public templates
  if (template.isPublic) {
    return { template, hasAccess: true, canModify: false };
  }

  return { template, hasAccess: false, canModify: false };
}

// GET /api/content/templates/[id] - Get a single template
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { id } = await params;

  try {
    const { template, hasAccess } = await checkTemplateAccess(id, session.user.id);

    if (!template) {
      return apiNotFound('Template not found');
    }

    if (!hasAccess) {
      return apiError('Access denied', 403);
    }

    // Increment usage count
    await db.template.update({
      where: { id },
      data: { usageCount: { increment: 1 } }
    });

    // Parse JSON fields
    const responseTemplate = {
      ...template,
      variables: template.variables ? JSON.parse(template.variables) : null
    };

    return apiSuccess(responseTemplate);
  } catch (error) {
    console.error('Error fetching template:', error);
    return apiError('Failed to fetch template', 500);
  }
}

// PUT /api/content/templates/[id] - Update a template
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { id } = await params;

  try {
    const { template, hasAccess, canModify } = await checkTemplateAccess(id, session.user.id, true);

    if (!template) {
      return apiNotFound('Template not found');
    }

    if (!hasAccess || !canModify) {
      return apiError('Access denied. You can only modify your own templates.', 403);
    }

    const body = await request.json();

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.variables !== undefined) updateData.variables = body.variables ? JSON.stringify(body.variables) : null;
    if (body.isPublic !== undefined) updateData.isPublic = body.isPublic;
    if (body.isPremium !== undefined) updateData.isPremium = body.isPremium;

    // Update template
    const updatedTemplate = await db.template.update({
      where: { id },
      data: updateData
    });

    return apiSuccess(updatedTemplate, 'Template updated successfully');
  } catch (error) {
    console.error('Error updating template:', error);
    return apiError('Failed to update template', 500);
  }
}

// DELETE /api/content/templates/[id] - Delete a template
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return apiUnauthorized();
  }

  const { id } = await params;

  try {
    const { template, hasAccess, canModify } = await checkTemplateAccess(id, session.user.id, true);

    if (!template) {
      return apiNotFound('Template not found');
    }

    if (!hasAccess || !canModify) {
      return apiError('Access denied. You can only delete your own templates.', 403);
    }

    await db.template.delete({
      where: { id }
    });

    return apiSuccess({ id }, 'Template deleted successfully');
  } catch (error) {
    console.error('Error deleting template:', error);
    return apiError('Failed to delete template', 500);
  }
}
