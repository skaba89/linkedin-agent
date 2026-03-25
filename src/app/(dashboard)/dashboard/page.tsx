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
import Link from 'next/link';

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
            Plan Free
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Score du profil"
          value="--"
          description="Analysez votre profil"
          icon={Trophy}
        />
        <StatCard
          title="Posts créés"
          value="0"
          description="Ce mois"
          icon={FileText}
        />
        <StatCard
          title="Abonnés"
          value="--"
          description="Connectez LinkedIn"
          icon={Users}
        />
        <StatCard
          title="Engagement"
          value="--"
          description="Taux moyen"
          icon={TrendingUp}
        />
      </div>

      {/* Getting Started Banner */}
      <div className="bg-gradient-to-r from-[#0077B5]/10 to-[#00A0DC]/10 rounded-xl p-4 sm:p-6 border border-[#0077B5]/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">🚀 Commencez à optimiser votre présence LinkedIn</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Analysez votre profil LinkedIn pour découvrir vos points d&apos;amélioration et obtenez un score personnalisé.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/analyser">
                <Button className="bg-gradient-to-r from-[#0077B5] to-[#00A0DC] hover:from-[#005885] hover:to-[#0077B5]">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyser mon profil
                </Button>
              </Link>
              <Link href="/profil">
                <Button variant="outline">
                  Optimiser mon profil
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Features Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/analyser" className="group">
          <div className="bg-card border rounded-xl p-5 hover:shadow-lg transition-all hover:border-[#0077B5]/30">
            <div className="w-12 h-12 rounded-xl bg-[#0077B5]/10 flex items-center justify-center mb-4 group-hover:bg-[#0077B5]/20 transition-colors">
              <Trophy className="h-6 w-6 text-[#0077B5]" />
            </div>
            <h3 className="font-semibold mb-2">Analyse de profil</h3>
            <p className="text-sm text-muted-foreground">
              Entrez une URL LinkedIn et obtenez une analyse complète avec score et suggestions.
            </p>
          </div>
        </Link>

        <Link href="/contenu" className="group">
          <div className="bg-card border rounded-xl p-5 hover:shadow-lg transition-all hover:border-[#0077B5]/30">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Génération de contenu</h3>
            <p className="text-sm text-muted-foreground">
              Créez des posts LinkedIn engageants en quelques secondes grâce à l&apos;IA.
            </p>
          </div>
        </Link>

        <Link href="/pages" className="group">
          <div className="bg-card border rounded-xl p-5 hover:shadow-lg transition-all hover:border-[#0077B5]/30">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Pages entreprise</h3>
            <p className="text-sm text-muted-foreground">
              Gérez et optimisez vos pages LinkedIn entreprise pour votre marque employeur.
            </p>
          </div>
        </Link>
      </div>

      {/* Tips Section */}
      <div className="bg-muted/50 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Conseils pour améliorer votre présence LinkedIn
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
