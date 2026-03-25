'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award,
  Target,
  FileText
} from 'lucide-react';

interface ScoreBreakdown {
  photo: number;
  headline: number;
  summary: number;
  experience: number;
  education: number;
  skills: number;
  certifications: number;
  recommendations: number;
}

interface ProfileScoreProps {
  score: number;
  completionRate: number;
  breakdown?: ScoreBreakdown;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
}

const scoreCategories = [
  { key: 'photo', label: 'Photo', icon: User },
  { key: 'headline', label: 'Titre', icon: Target },
  { key: 'summary', label: 'Résumé', icon: FileText },
  { key: 'experience', label: 'Expériences', icon: Briefcase },
  { key: 'education', label: 'Formation', icon: GraduationCap },
  { key: 'skills', label: 'Compétences', icon: Award },
  { key: 'certifications', label: 'Certifications', icon: Award },
  { key: 'recommendations', label: 'Recommandations', icon: Trophy },
] as const;

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

function getScoreBadge(score: number): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  if (score >= 80) return { label: 'Excellent', variant: 'default' };
  if (score >= 60) return { label: 'Bon', variant: 'secondary' };
  if (score >= 40) return { label: 'À améliorer', variant: 'outline' };
  return { label: 'Insuffisant', variant: 'destructive' };
}

function getProgressColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export function ProfileScore({ 
  score, 
  completionRate, 
  breakdown,
  onAnalyze,
  isAnalyzing = false
}: ProfileScoreProps) {
  const scoreColor = getScoreColor(score);
  const badge = getScoreBadge(score);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Score du profil
          </CardTitle>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score circulaire */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                className="stroke-muted fill-none"
                strokeWidth="8"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                className={`fill-none ${getProgressColor(score)}`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 352} 352`}
                style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>
        </div>

        {/* Taux de complétion */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taux de complétion</span>
            <span className="font-medium">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Détail par catégorie */}
        {breakdown && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Détail par section</h4>
            <div className="grid grid-cols-2 gap-3">
              {scoreCategories.map(({ key, label, icon: Icon }) => {
                const value = breakdown[key] || 0;
                const isComplete = value >= 70;
                return (
                  <div 
                    key={key}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs truncate">{label}</span>
                        {isComplete ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-orange-500" />
                        )}
                      </div>
                      <Progress value={value} className="h-1 mt-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bouton d'analyse */}
        {onAnalyze && (
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyse en cours...
              </span>
            ) : (
              'Analyser mon profil'
            )}
          </button>
        )}
      </CardContent>
    </Card>
  );
}

export default ProfileScore;
