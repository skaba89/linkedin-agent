'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  FileText,
  User,
  Share2,
  MessageCircle,
  Heart,
  Eye,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Activity {
  id: string;
  type:
    | 'post_created'
    | 'post_published'
    | 'profile_updated'
    | 'engagement'
    | 'scheduled'
    | 'score_update';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'success' | 'warning' | 'info';
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'post_published',
    title: 'Publication réussie',
    description: 'Votre post "Les tendances tech en 2024" a été publié sur LinkedIn.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: 'success',
  },
  {
    id: '2',
    type: 'engagement',
    title: 'Nouvel engagement',
    description: '15 nouvelles réactions sur votre dernier post.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'info',
  },
  {
    id: '3',
    type: 'profile_updated',
    title: 'Profil mis à jour',
    description: 'Votre section "Expérience" a été optimisée.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: 'success',
  },
  {
    id: '4',
    type: 'scheduled',
    title: 'Publication programmée',
    description: 'Un post est programmé pour demain à 9h00.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: 'warning',
  },
  {
    id: '5',
    type: 'score_update',
    title: 'Score de profil',
    description: 'Votre score a augmenté de 5 points cette semaine.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'success',
  },
  {
    id: '6',
    type: 'post_created',
    title: 'Brouillon sauvegardé',
    description: 'Nouveau brouillon "Stratégies marketing B2B" créé.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
    status: 'info',
  },
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'post_created':
      return FileText;
    case 'post_published':
      return Share2;
    case 'profile_updated':
      return User;
    case 'engagement':
      return Heart;
    case 'scheduled':
      return Calendar;
    case 'score_update':
      return CheckCircle2;
    default:
      return AlertCircle;
  }
};

const getStatusColor = (status?: Activity['status']) => {
  switch (status) {
    case 'success':
      return 'bg-green-500/10 text-green-600 border-green-200';
    case 'warning':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
    case 'info':
      return 'bg-blue-500/10 text-blue-600 border-blue-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export function ActivityFeed() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Activité récente</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-6">
          <div className="space-y-4 pb-6">
            {mockActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div
                  key={activity.id}
                  className={cn(
                    'flex items-start gap-3',
                    index !== mockActivities.length - 1 && 'pb-4 border-b'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      getStatusColor(activity.status)
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(activity.timestamp, {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
