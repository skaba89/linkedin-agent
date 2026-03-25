// Global State Management with Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Workspace, Organization, Notification } from '@/types';

// ============================================
// AUTH STORE
// ============================================

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => {
        set({ user: null, isAuthenticated: false });
        // Clear cookie via API
        fetch('/api/auth/logout', { method: 'POST' });
      },
      checkAuth: async () => {
        try {
          const response = await fetch('/api/auth/session');
          const result = await response.json();
          if (result.success && result.data?.user) {
            set({ user: result.data.user, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ============================================
// WORKSPACE STORE
// ============================================

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  organizations: Organization[];
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setOrganizations: (organizations: Organization[]) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, data: Partial<Workspace>) => void;
  removeWorkspace: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      currentWorkspace: null,
      workspaces: [],
      organizations: [],
      setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
      setWorkspaces: (workspaces) => set({ workspaces }),
      setOrganizations: (organizations) => set({ organizations }),
      addWorkspace: (workspace) =>
        set((state) => ({
          workspaces: [...state.workspaces, workspace],
        })),
      updateWorkspace: (id, data) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id ? { ...w, ...data } : w
          ),
          currentWorkspace:
            state.currentWorkspace?.id === id
              ? { ...state.currentWorkspace, ...data }
              : state.currentWorkspace,
        })),
      removeWorkspace: (id) =>
        set((state) => ({
          workspaces: state.workspaces.filter((w) => w.id !== id),
          currentWorkspace:
            state.currentWorkspace?.id === id ? null : state.currentWorkspace,
        })),
    }),
    {
      name: 'workspace-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentWorkspace: state.currentWorkspace,
        workspaces: state.workspaces,
      }),
    }
  )
);

// ============================================
// NOTIFICATION STORE
// ============================================

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
        })),
      markAsRead: (id) =>
        set((state) => {
          const prevUnread = state.notifications.find((n) => n.id === id)?.isRead;
          return {
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true, readAt: new Date() } : n
            ),
            unreadCount: prevUnread === false ? state.unreadCount - 1 : state.unreadCount,
          };
        }),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            isRead: true,
            readAt: n.readAt || new Date(),
          })),
          unreadCount: 0,
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: state.notifications.find((n) => n.id === id && !n.isRead)
            ? state.unreadCount - 1
            : state.unreadCount,
        })),
      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications.slice(0, 50), // Keep only last 50
      }),
    }
  )
);

// ============================================
// UI STORE
// ============================================

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      theme: 'system',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebarCollapse: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================
// CONTENT EDITOR STORE
// ============================================

import { ContentPost, PostType, ContentTone, PostCategory } from '@/types';

interface ContentEditorState {
  currentPost: Partial<ContentPost> | null;
  isDirty: boolean;
  isGenerating: boolean;
  setCurrentPost: (post: Partial<ContentPost> | null) => void;
  updateCurrentPost: (data: Partial<ContentPost>) => void;
  setDirty: (dirty: boolean) => void;
  setGenerating: (generating: boolean) => void;
  resetEditor: () => void;
}

const defaultPost: Partial<ContentPost> = {
  postType: 'text',
  postCategory: 'thought_leadership',
  content: '',
  tone: 'professional',
  language: 'fr',
  publishToProfile: true,
};

export const useContentEditorStore = create<ContentEditorState>()((set) => ({
  currentPost: defaultPost,
  isDirty: false,
  isGenerating: false,
  setCurrentPost: (post) =>
    set({
      currentPost: post,
      isDirty: false,
    }),
  updateCurrentPost: (data) =>
    set((state) => ({
      currentPost: state.currentPost
        ? { ...state.currentPost, ...data }
        : data,
      isDirty: true,
    })),
  setDirty: (isDirty) => set({ isDirty }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  resetEditor: () =>
    set({
      currentPost: defaultPost,
      isDirty: false,
      isGenerating: false,
    }),
}));

// ============================================
// PROFILE EDITOR STORE
// ============================================

import { LinkedInProfileDraft, ExperienceEntry, ProfileSkill } from '@/types';

interface ProfileEditorState {
  currentProfile: Partial<LinkedInProfileDraft> | null;
  isDirty: boolean;
  isGenerating: boolean;
  setCurrentProfile: (profile: Partial<LinkedInProfileDraft> | null) => void;
  updateCurrentProfile: (data: Partial<LinkedInProfileDraft>) => void;
  setDirty: (dirty: boolean) => void;
  setGenerating: (generating: boolean) => void;
  addExperience: (experience: ExperienceEntry) => void;
  updateExperience: (id: string, data: Partial<ExperienceEntry>) => void;
  removeExperience: (id: string) => void;
  addSkill: (skill: ProfileSkill) => void;
  removeSkill: (id: string) => void;
  resetEditor: () => void;
}

export const useProfileEditorStore = create<ProfileEditorState>()((set) => ({
  currentProfile: null,
  isDirty: false,
  isGenerating: false,
  setCurrentProfile: (profile) =>
    set({
      currentProfile: profile,
      isDirty: false,
    }),
  updateCurrentProfile: (data) =>
    set((state) => ({
      currentProfile: state.currentProfile
        ? { ...state.currentProfile, ...data }
        : data,
      isDirty: true,
    })),
  setDirty: (isDirty) => set({ isDirty }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  addExperience: (experience) =>
    set((state) => ({
      currentProfile: state.currentProfile
        ? {
            ...state.currentProfile,
            experiences: [
              ...(state.currentProfile.experiences || []),
              experience,
            ],
          }
        : null,
      isDirty: true,
    })),
  updateExperience: (id, data) =>
    set((state) => ({
      currentProfile: state.currentProfile
        ? {
            ...state.currentProfile,
            experiences: state.currentProfile.experiences?.map((e) =>
              e.id === id ? { ...e, ...data } : e
            ),
          }
        : null,
      isDirty: true,
    })),
  removeExperience: (id) =>
    set((state) => ({
      currentProfile: state.currentProfile
        ? {
            ...state.currentProfile,
            experiences: state.currentProfile.experiences?.filter(
              (e) => e.id !== id
            ),
          }
        : null,
      isDirty: true,
    })),
  addSkill: (skill) =>
    set((state) => ({
      currentProfile: state.currentProfile
        ? {
            ...state.currentProfile,
            skills: [...(state.currentProfile.skills || []), skill],
          }
        : null,
      isDirty: true,
    })),
  removeSkill: (id) =>
    set((state) => ({
      currentProfile: state.currentProfile
        ? {
            ...state.currentProfile,
            skills: state.currentProfile.skills?.filter((s) => s.id !== id),
          }
        : null,
      isDirty: true,
    })),
  resetEditor: () =>
    set({
      currentProfile: null,
      isDirty: false,
      isGenerating: false,
    }),
}));
