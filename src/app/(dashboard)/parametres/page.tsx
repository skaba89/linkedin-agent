'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Building2,
  CreditCard,
  Bell,
  Shield,
  Link2,
  Trash2,
  Download,
  ExternalLink,
  Check,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [user] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    avatar: null,
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
    marketing: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="organization">
            <Building2 className="h-4 w-4 mr-2" />
            Organisation
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-4 w-4 mr-2" />
            Facturation
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Link2 className="h-4 w-4 mr-2" />
            Intégrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Mettez à jour vos informations de profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar || ''} />
                  <AvatarFallback className="text-lg">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">Changer la photo</Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF ou PNG. 1MB max.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" defaultValue={user.firstName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" defaultValue={user.lastName} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => toast.success('Profil mis à jour')}>
                  Enregistrer les modifications
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zone de danger</CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Exporter les données</p>
                  <p className="text-sm text-muted-foreground">
                    Téléchargez toutes vos données au format JSON
                  </p>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium text-destructive">Supprimer le compte</p>
                  <p className="text-sm text-muted-foreground">
                    Cette action est irréversible et supprimera toutes vos données
                  </p>
                </div>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organisation actuelle</CardTitle>
              <CardDescription>
                Gérez les informations de votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  JD
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Jean Dupont Consulting</h3>
                  <p className="text-sm text-muted-foreground">
                    Organisation personnelle
                  </p>
                </div>
                <Badge variant="secondary">
                  <Crown className="h-3 w-3 mr-1" />
                  Propriétaire
                </Badge>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom de l&apos;organisation</Label>
                  <Input defaultValue="Jean Dupont Consulting" />
                </div>
                <div className="space-y-2">
                  <Label>Site web</Label>
                  <Input defaultValue="https://jeandupont.com" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => toast.success('Organisation mise à jour')}>
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Membres de l&apos;équipe</CardTitle>
              <CardDescription>
                Gérez les accès à votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Jean Dupont</p>
                      <p className="text-sm text-muted-foreground">jean.dupont@example.com</p>
                    </div>
                  </div>
                  <Badge>Propriétaire</Badge>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Inviter un membre
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Abonnement actuel</CardTitle>
              <CardDescription>
                Gérez votre plan et vos paiements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Crown className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Plan Pro</h3>
                    <p className="text-sm text-muted-foreground">
                      29€/mois • Renouvellement le 15 avril 2026
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Actif</Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { name: 'Free', price: '0€', features: ['1 workspace', '5 posts/mois', 'Analytics basiques'] },
                  { name: 'Pro', price: '29€', features: ['3 workspaces', '50 posts/mois', 'IA illimitée'], current: true },
                  { name: 'Business', price: '79€', features: ['10 workspaces', 'Posts illimités', 'Équipe 5 membres'] },
                ].map((plan) => (
                  <Card key={plan.name} className={plan.current ? 'border-primary' : ''}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{plan.name}</CardTitle>
                        {plan.current && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <CardDescription>
                        {plan.price}/mois
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {!plan.current && (
                        <Button
                          variant={plan.name === 'Business' ? 'default' : 'outline'}
                          className="w-full mt-4"
                        >
                          {plan.name === 'Business' ? 'Mettre à niveau' : 'Choisir'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique des factures</CardTitle>
              <CardDescription>
                Téléchargez vos factures précédentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { date: '15 Mars 2026', amount: '29€', status: 'paid' },
                  { date: '15 Février 2026', amount: '29€', status: 'paid' },
                  { date: '15 Janvier 2026', amount: '29€', status: 'paid' },
                ].map((invoice, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{invoice.date}</p>
                      <p className="text-sm text-muted-foreground">{invoice.amount}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Payé
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Notifications email</p>
                    <p className="text-sm text-muted-foreground">
                      Recevez des emails pour les activités importantes
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Notifications push</p>
                    <p className="text-sm text-muted-foreground">
                      Notifications dans le navigateur
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, push: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Rapport hebdomadaire</p>
                    <p className="text-sm text-muted-foreground">
                      Recevez un résumé de vos performances chaque semaine
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weekly}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, weekly: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Emails marketing</p>
                    <p className="text-sm text-muted-foreground">
                      Conseils et actualités LinkedInBoost
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, marketing: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mot de passe</CardTitle>
              <CardDescription>
                Changez votre mot de passe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mot de passe actuel</Label>
                <Input type="password" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nouveau mot de passe</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirmer le mot de passe</Label>
                  <Input type="password" />
                </div>
              </div>
              <Button>Mettre à jour le mot de passe</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentification à deux facteurs</CardTitle>
              <CardDescription>
                Ajoutez une couche de sécurité supplémentaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">2FA non activée</p>
                  <p className="text-sm text-muted-foreground">
                    Protégez votre compte avec l&apos;authentification à deux facteurs
                  </p>
                </div>
                <Button variant="outline">Activer 2FA</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions actives</CardTitle>
              <CardDescription>
                Gérez vos appareils connectés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Chrome sur MacOS</p>
                      <p className="text-sm text-muted-foreground">
                        Paris, France • Actif maintenant
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Actuelle</Badge>
                </div>
              </div>
              <Button variant="destructive" className="mt-4">
                Déconnecter tous les autres appareils
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>LinkedIn</CardTitle>
              <CardDescription>
                Connectez votre compte LinkedIn pour plus de fonctionnalités
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-[#0077B5]">
                    <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Non connecté</p>
                    <p className="text-sm text-muted-foreground">
                      Connectez LinkedIn pour publier et analyser
                    </p>
                  </div>
                </div>
                <Button>
                  <Link2 className="h-4 w-4 mr-2" />
                  Connecter
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intégrations disponibles</CardTitle>
              <CardDescription>
                Connectez d&apos;autres services pour enrichir votre expérience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { name: 'Zapier', description: 'Automatisez vos workflows', connected: false },
                  { name: 'Buffer', description: 'Planification sociale', connected: false },
                  { name: 'Canva', description: 'Création visuelle', connected: false },
                  { name: 'Notion', description: 'Notes et documentation', connected: false },
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Connecter
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
