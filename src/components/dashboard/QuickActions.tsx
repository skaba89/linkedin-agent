'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  User,
  BarChart3,
  Calendar,
  Sparkles,
  FileText,
  Zap,
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  variant?: 'default' | 'outline' | 'secondary';
  highlight?: boolean;
}

const quickActions: QuickAction[] = [
  {
    id: 'create_post',
    title: 'Créer un post',
    description: 'Rédiger une nouvelle publication',
    icon: Plus,
    variant: 'default',
    highlight: true,
  },
  {
    id: 'ai_generate',
    title: 'Génération IA',
    description: 'Créer avec l\'assistant IA',
    icon: Sparkles,
    variant: 'outline',
  },
  {
    id: 'optimize_profile',
    title: 'Optimiser le profil',
    description: 'Améliorer votre profil LinkedIn',
    icon: User,
    variant: 'outline',
  },
  {
    id: 'view_analytics',
    title: 'Analytics',
    description: 'Voir les statistiques',
    icon: BarChart3,
    variant: 'outline',
  },
  {
    id: 'schedule_post',
    title: 'Programmer',
    description: 'Planifier une publication',
    icon: Calendar,
    variant: 'outline',
  },
  {
    id: 'templates',
    title: 'Templates',
    description: 'Utiliser un modèle',
    icon: FileText,
    variant: 'outline',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              className={`h-auto flex-col items-start gap-1 p-4 text-left ${
                action.highlight
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <action.icon className="h-4 w-4" />
                <span className="font-medium text-sm">{action.title}</span>
              </div>
              <span
                className={`text-xs ${
                  action.highlight
                    ? 'text-primary-foreground/80'
                    : 'text-muted-foreground'
                }`}
              >
                {action.description}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
