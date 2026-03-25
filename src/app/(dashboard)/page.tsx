'use client';

import { useAuthStore } from '@/lib/store';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ScheduledPosts } from '@/components/dashboard/ScheduledPosts';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  FileText,
  Users,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const firstName = user?.firstName || 'Utilisateur';

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Bonjour, {firstName} ! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Voici un aperçu de votre présence LinkedIn
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Sparkles className="h-3 w-3 mr-1" />
            Plan Pro
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Score du profil"
          value="78/100"
          description="Profil bien optimisé"
          icon={Trophy}
          trend={{
            value: 5,
            label: 'vs semaine dernière',
            direction: 'up',
          }}
        />
        <StatCard
          title="Posts créés"
          value="24"
          description="Ce mois"
          icon={FileText}
          trend={{
            value: 12,
            label: 'vs mois dernier',
            direction: 'up',
          }}
        />
        <StatCard
          title="Abonnés"
          value="2,847"
          description="Total LinkedIn"
          icon={Users}
          trend={{
            value: 8,
            label: 'vs mois dernier',
            direction: 'up',
          }}
        />
        <StatCard
          title="Engagement"
          value="4.2%"
          description="Taux moyen"
          icon={TrendingUp}
          trend={{
            value: 0.5,
            label: 'vs semaine dernière',
            direction: 'up',
          }}
        />
      </div>

      {/* Profile Completion Banner */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 sm:p-6 border border-primary/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">Profil complété à 78%</h3>
              <Badge variant="secondary" className="text-xs">
                +5% cette semaine
              </Badge>
            </div>
            <Progress value={78} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground">
              Ajoutez des compétences et une photo de bannière pour améliorer votre score.
            </p>
          </div>
          <Button variant="default" className="shrink-0">
            Optimiser le profil
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Activity Feed & Scheduled Posts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed />
        <ScheduledPosts />
      </div>

      {/* Tips Section */}
      <div className="bg-muted/50 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Conseils pour améliorer votre présence
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="bg-background rounded-lg p-4 border">
            <h4 className="font-medium text-sm mb-1">Publiez régulièrement</h4>
            <p className="text-xs text-muted-foreground">
              2-3 publications par semaine optimisent votre visibilité.
            </p>
          </div>
          <div className="bg-background rounded-lg p-4 border">
            <h4 className="font-medium text-sm mb-1">Engagez avec votre réseau</h4>
            <p className="text-xs text-muted-foreground">
              Commentez et partagez du contenu pertinent.
            </p>
          </div>
          <div className="bg-background rounded-lg p-4 border">
            <h4 className="font-medium text-sm mb-1">Optimisez votre profil</h4>
            <p className="text-xs text-muted-foreground">
              Un profil complet attire 40% plus de vues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
