'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Linkedin,
  User,
  Building2,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface AnalysisResult {
  url: string;
  analyzedAt: string;
  analysis: {
    score: number;
    basicInfo: {
      hasPhoto: boolean;
      hasBanner: boolean;
      headlineQuality: string;
      locationComplete: boolean;
    };
    about: {
      present: boolean;
      length: number;
      hasKeywords: boolean;
      hasCTA: boolean;
    };
    experience: {
      count: number;
      withDescriptions: number;
      currentRoles: number;
      averageDuration: string;
    };
    education: {
      count: number;
      withDetails: number;
    };
    skills: {
      count: number;
      topSkills: string[];
      hasEndorsements: boolean;
    };
    recommendations: {
      given: number;
      received: number;
    };
    suggestions: Array<{
      priority: string;
      category: string;
      message: string;
      action: string;
    }>;
  };
}

export default function AnalyserPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error('Veuillez entrer une URL LinkedIn');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/linkedin/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }

      setResult(data.data);
      toast.success('Profil analysé avec succès !');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'analyse');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Priorité haute';
      case 'medium': return 'Priorité moyenne';
      case 'low': return 'Priorité basse';
      default: return priority;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analyse de Profil LinkedIn</h1>
        <p className="text-muted-foreground">
          Analysez n&apos;importe quel profil LinkedIn et obtenez des recommandations personnalisées
        </p>
      </div>

      {/* URL Input Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-[#0077B5]" />
            Entrez l&apos;URL du profil LinkedIn
          </CardTitle>
          <CardDescription>
            Format: https://www.linkedin.com/in/nom-prenom
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="https://www.linkedin.com/in/votre-profil"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12"
              />
            </div>
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading}
              className="h-12 px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyser
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Score Overview */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="md:col-span-1">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={`text-6xl font-bold bg-gradient-to-r ${getScoreGradient(result.analysis.score)} bg-clip-text text-transparent`}>
                    {result.analysis.score}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Score sur 100</p>
                  <Progress 
                    value={result.analysis.score} 
                    className="mt-4 h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Briefcase className="h-6 w-6 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold">{result.analysis.experience.count}</div>
                    <div className="text-xs text-muted-foreground">Expériences</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <GraduationCap className="h-6 w-6 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold">{result.analysis.education.count}</div>
                    <div className="text-xs text-muted-foreground">Formations</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Award className="h-6 w-6 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold">{result.analysis.skills.count}</div>
                    <div className="text-xs text-muted-foreground">Compétences</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <MessageSquare className="h-6 w-6 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold">{result.analysis.recommendations.received}</div>
                    <div className="text-xs text-muted-foreground">Recommandations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informations de base
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Photo de profil</span>
                      {result.analysis.basicInfo.hasPhoto ? (
                        <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Présente</Badge>
                      ) : (
                        <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Absente</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bannière</span>
                      {result.analysis.basicInfo.hasBanner ? (
                        <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Présente</Badge>
                      ) : (
                        <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Absente</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Qualité du titre</span>
                      <Badge className={
                        result.analysis.basicInfo.headlineQuality === 'excellent' ? 'bg-green-100 text-green-700' :
                        result.analysis.basicInfo.headlineQuality === 'good' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {result.analysis.basicInfo.headlineQuality === 'excellent' ? 'Excellent' :
                         result.analysis.basicInfo.headlineQuality === 'good' ? 'Bon' : 'À améliorer'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Localisation</span>
                      {result.analysis.basicInfo.locationComplete ? (
                        <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Complète</Badge>
                      ) : (
                        <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Incomplète</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* About Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Section À propos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Présence</span>
                      {result.analysis.about.present ? (
                        <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Présente</Badge>
                      ) : (
                        <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Absente</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Longueur</span>
                      <Badge variant="secondary">{result.analysis.about.length} caractères</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mots-clés</span>
                      {result.analysis.about.hasKeywords ? (
                        <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Présents</Badge>
                      ) : (
                        <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Absents</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Appel à l&apos;action</span>
                      {result.analysis.about.hasCTA ? (
                        <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Présent</Badge>
                      ) : (
                        <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Absent</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Compétences principales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.skills.topSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Recommandations d&apos;amélioration
                  </CardTitle>
                  <CardDescription>
                    Ces suggestions vous aideront à améliorer votre profil LinkedIn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.analysis.suggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <Badge className={`${getPriorityColor(suggestion.priority)} border`}>
                            {getPriorityLabel(suggestion.priority)}
                          </Badge>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{suggestion.category}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {suggestion.message}
                            </p>
                            <p className="text-sm font-medium text-primary">
                              💡 {suggestion.action}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Experience Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Expérience professionnelle
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold">{result.analysis.experience.count}</div>
                        <div className="text-sm text-muted-foreground">Expériences</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{result.analysis.experience.currentRoles}</div>
                        <div className="text-sm text-muted-foreground">Poste actuel</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Avec descriptions détaillées</span>
                        <span className="font-medium">{result.analysis.experience.withDescriptions}/{result.analysis.experience.count}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span>Durée moyenne</span>
                        <span className="font-medium">{result.analysis.experience.averageDuration}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Education Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Formation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold">{result.analysis.education.count}</div>
                        <div className="text-sm text-muted-foreground">Diplômes</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{result.analysis.education.withDetails}</div>
                        <div className="text-sm text-muted-foreground">Avec détails</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Recommandations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">{result.analysis.recommendations.received}</div>
                        <div className="text-sm text-muted-foreground mt-1">Reçues</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">{result.analysis.recommendations.given}</div>
                        <div className="text-sm text-muted-foreground mt-1">Données</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-[#0077B5] to-[#00A0DC] text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Prêt à optimiser votre profil ?</h3>
                  <p className="text-white/80">
                    Utilisez notre assistant IA pour améliorer votre profil LinkedIn étape par étape.
                  </p>
                </div>
                <Button variant="secondary" size="lg" className="bg-white text-[#0077B5] hover:bg-gray-100">
                  Commencer l&apos;optimisation
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
