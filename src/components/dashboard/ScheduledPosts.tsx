'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  scheduledFor: Date;
  type: 'text' | 'image' | 'carousel' | 'video';
  status: 'scheduled' | 'draft';
}

const mockScheduledPosts: ScheduledPost[] = [
  {
    id: '1',
    title: 'Les tendances tech en 2024',
    content:
      'Découvrez les principales tendances technologiques qui façonneront notre année...',
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24),
    type: 'text',
    status: 'scheduled',
  },
  {
    id: '2',
    title: 'Stratégies marketing B2B',
    content:
      'Comment développer une stratégie marketing B2B efficace en 5 étapes...',
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 48),
    type: 'carousel',
    status: 'scheduled',
  },
  {
    id: '3',
    title: 'Leadership et management',
    content:
      'Les clés d\'un leadership efficace dans un environnement hybride...',
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 72),
    type: 'text',
    status: 'draft',
  },
  {
    id: '4',
    title: 'Innovation dans l\'industrie',
    content:
      'Retour sur les innovations majeures de ces derniers mois...',
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 96),
    type: 'image',
    status: 'scheduled',
  },
];

const getPostTypeLabel = (type: ScheduledPost['type']) => {
  switch (type) {
    case 'text':
      return 'Texte';
    case 'image':
      return 'Image';
    case 'carousel':
      return 'Carrousel';
    case 'video':
      return 'Vidéo';
    default:
      return type;
  }
};

const getPostTypeColor = (type: ScheduledPost['type']) => {
  switch (type) {
    case 'text':
      return 'bg-blue-500/10 text-blue-600 border-blue-200';
    case 'image':
      return 'bg-green-500/10 text-green-600 border-green-200';
    case 'carousel':
      return 'bg-purple-500/10 text-purple-600 border-purple-200';
    case 'video':
      return 'bg-red-500/10 text-red-600 border-red-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export function ScheduledPosts() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Publications programmées
        </CardTitle>
        <Button variant="ghost" size="sm">
          Voir tout
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-6">
          <div className="space-y-4 pb-6">
            {mockScheduledPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Aucune publication programmée
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Programmer un post
                </Button>
              </div>
            ) : (
              mockScheduledPosts.map((post, index) => (
                <div
                  key={post.id}
                  className={cn(
                    'flex items-start gap-3',
                    index !== mockScheduledPosts.length - 1 && 'pb-4 border-b'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {post.title}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs shrink-0',
                          getPostTypeColor(post.type)
                        )}
                      >
                        {getPostTypeLabel(post.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {format(post.scheduledFor, 'd MMMM', { locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{format(post.scheduledFor, 'HH:mm')}</span>
                      </div>
                      {post.status === 'draft' && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-200"
                        >
                          Brouillon
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Aperçu
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
