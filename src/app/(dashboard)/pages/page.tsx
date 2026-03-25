'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  Eye,
  ExternalLink,
  Sparkles,
  Upload,
  Globe,
  MapPin,
  Calendar,
  Briefcase
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface CompanyPage {
  id: string;
  name: string;
  tagline: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  industry: string;
  followers: number;
  completionRate: number;
  status: 'draft' | 'published';
  linkedinUrl: string | null;
}

const mockPages: CompanyPage[] = [
  {
    id: '1',
    name: 'Tech Innovate SAS',
    tagline: 'Solutions technologiques innovantes',
    logoUrl: null,
    bannerUrl: null,
    industry: 'Technologie',
    followers: 1250,
    completionRate: 85,
    status: 'published',
    linkedinUrl: 'https://linkedin.com/company/tech-innovate',
  },
  {
    id: '2',
    name: 'Consulting Pro',
    tagline: 'Conseil en transformation digitale',
    logoUrl: null,
    bannerUrl: null,
    industry: 'Consulting',
    followers: 0,
    completionRate: 45,
    status: 'draft',
    linkedinUrl: null,
  },
];

export default function PagesPage() {
  const [pages] = useState<CompanyPage[]>(mockPages);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pages LinkedIn</h1>
          <p className="text-muted-foreground">
            Gérez vos pages d&apos;entreprise LinkedIn
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer une page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une page entreprise</DialogTitle>
              <DialogDescription>
                Remplissez les informations de votre page LinkedIn
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l&apos;entreprise *</Label>
                  <Input id="companyName" placeholder="Mon Entreprise SAS" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Secteur d&apos;activité</Label>
                  <Input id="industry" placeholder="Technologie" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" placeholder="Votre mission en quelques mots" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre entreprise, ses valeurs et ses services..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  0 / 2000 caractères
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Glissez-déposez ou cliquez
                    </p>
                    <p className="text-xs text-muted-foreground">
                      300 x 300 px recommandé
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bannière</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Glissez-déposez ou cliquez
                    </p>
                    <p className="text-xs text-muted-foreground">
                      1128 x 191 px recommandé
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input id="website" type="url" placeholder="https://monentreprise.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Taille de l&apos;entreprise</Label>
                  <Input id="size" placeholder="11-50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Siège social</Label>
                <Input id="location" placeholder="Paris, France" />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => {
                  toast.success('Page créée avec succès !');
                  setIsCreateOpen(false);
                }}>
                  Créer la page
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Toutes les pages</TabsTrigger>
          <TabsTrigger value="published">Publiées</TabsTrigger>
          <TabsTrigger value="drafts">Brouillons</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {pages.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune page</h3>
                <p className="text-muted-foreground mb-4">
                  Créez votre première page LinkedIn pour commencer
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une page
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {pages.map((page) => (
                <Card key={page.id} className="overflow-hidden">
                  {/* Banner */}
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600 relative">
                    {page.bannerUrl && (
                      <img src={page.bannerUrl} alt="" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute -bottom-8 left-4">
                      <div className="w-16 h-16 rounded-lg bg-white shadow-lg flex items-center justify-center text-2xl font-bold text-primary">
                        {page.logoUrl ? (
                          <img src={page.logoUrl} alt="" className="w-full h-full rounded-lg" />
                        ) : (
                          page.name[0]
                        )}
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pt-12">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {page.name}
                          {page.status === 'published' && (
                            <Badge className="bg-green-100 text-green-700">
                              Publiée
                            </Badge>
                          )}
                          {page.status === 'draft' && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                              Brouillon
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{page.tagline}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          {page.linkedinUrl && (
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Voir sur LinkedIn
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Completion Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Complétion du profil</span>
                        <span className="font-medium">{page.completionRate}%</span>
                      </div>
                      <Progress value={page.completionRate} className="h-2" />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 py-4 border-y">
                      <div className="text-center">
                        <Users className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-semibold">{page.followers.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Abonnés</p>
                      </div>
                      <div className="text-center">
                        <Eye className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-semibold">--</p>
                        <p className="text-xs text-muted-foreground">Vues</p>
                      </div>
                      <div className="text-center">
                        <TrendingUp className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-semibold">--</p>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        {page.industry}
                      </div>
                      {page.linkedinUrl && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Globe className="h-4 w-4" />
                          <a href={page.linkedinUrl} className="text-primary hover:underline">
                            Page LinkedIn
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Optimiser
                      </Button>
                      <Button className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="published">
          <div className="grid gap-6 md:grid-cols-2">
            {pages.filter(p => p.status === 'published').map((page) => (
              <Card key={page.id}>
                <CardContent className="pt-6">
                  <p className="font-medium">{page.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drafts">
          <div className="grid gap-6 md:grid-cols-2">
            {pages.filter(p => p.status === 'draft').map((page) => (
              <Card key={page.id}>
                <CardContent className="pt-6">
                  <p className="font-medium">{page.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Conseils pour optimiser votre page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Logo et bannière</p>
                <p className="text-sm text-muted-foreground">
                  Utilisez des visuels professionnels de haute qualité
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Description complète</p>
                <p className="text-sm text-muted-foreground">
                  Décrivez clairement vos services et valeurs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Publications régulières</p>
                <p className="text-sm text-muted-foreground">
                  Publiez au moins 2-3 fois par semaine
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
