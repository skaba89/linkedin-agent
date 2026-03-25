'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  Share2,
  MessageSquare,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Line,
  LineChart as RechartsLineChart,
} from 'recharts';

// Mock data
const profileViewsData = [
  { date: 'Lun', views: 120, visitors: 45 },
  { date: 'Mar', views: 180, visitors: 67 },
  { date: 'Mer', views: 150, visitors: 52 },
  { date: 'Jeu', views: 220, visitors: 89 },
  { date: 'Ven', views: 280, visitors: 102 },
  { date: 'Sam', views: 190, visitors: 71 },
  { date: 'Dim', views: 160, visitors: 58 },
];

const engagementData = [
  { name: 'Sem 1', likes: 450, comments: 89, shares: 34 },
  { name: 'Sem 2', likes: 520, comments: 102, shares: 45 },
  { name: 'Sem 3', likes: 480, comments: 95, shares: 38 },
  { name: 'Sem 4', likes: 610, comments: 128, shares: 52 },
];

const contentPerformance = [
  { type: 'Texte', count: 24, engagement: 4.2 },
  { type: 'Image', count: 12, engagement: 6.8 },
  { type: 'Carrousel', count: 8, engagement: 8.5 },
  { type: 'Vidéo', count: 5, engagement: 7.2 },
  { type: 'Article', count: 3, engagement: 5.4 },
];

const chartConfig = {
  views: {
    label: 'Vues',
    color: 'hsl(var(--chart-1))',
  },
  visitors: {
    label: 'Visiteurs',
    color: 'hsl(var(--chart-2))',
  },
  likes: {
    label: 'J\'aime',
    color: 'hsl(var(--chart-1))',
  },
  comments: {
    label: 'Commentaires',
    color: 'hsl(var(--chart-2))',
  },
  shares: {
    label: 'Partages',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  description?: string;
}

function StatCard({ title, value, change, icon: Icon, description }: StatCardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {isNeutral ? (
            <Minus className="h-3 w-3 mr-1" />
          ) : isPositive ? (
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
          )}
          <span className={isNeutral ? '' : isPositive ? 'text-green-500' : 'text-red-500'}>
            {isNeutral ? 'Stable' : `${Math.abs(change)}%`}
          </span>
          {description && (
            <>
              <span className="mx-1">•</span>
              <span>{description}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Analysez vos performances LinkedIn
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="7d">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
              <SelectItem value="12m">12 derniers mois</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Personnaliser
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Vues du profil"
              value="1,284"
              change={12.5}
              icon={Eye}
              description="vs semaine dernière"
            />
            <StatCard
              title="Apparitions recherche"
              value="456"
              change={8.2}
              icon={Users}
              description="vs semaine dernière"
            />
            <StatCard
              title="Engagement"
              value="4.8%"
              change={-2.1}
              icon={Heart}
              description="vs semaine dernière"
            />
            <StatCard
              title="Nouveaux abonnés"
              value="89"
              change={15.3}
              icon={TrendingUp}
              description="vs semaine dernière"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vues du profil</CardTitle>
                <CardDescription>
                  Vues et visiteurs uniques sur les 7 derniers jours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsAreaChart data={profileViewsData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stackId="1"
                        stroke="var(--color-views)"
                        fill="var(--color-views)"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="visitors"
                        stackId="2"
                        stroke="var(--color-visitors)"
                        fill="var(--color-visitors)"
                        fillOpacity={0.6}
                      />
                    </RechartsAreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement</CardTitle>
                <CardDescription>
                  Likes, commentaires et partages par semaine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="likes" fill="var(--color-likes)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="comments" fill="var(--color-comments)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="shares" fill="var(--color-shares)" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Content Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance par type de contenu</CardTitle>
              <CardDescription>
                Comparez l&apos;engagement moyen selon le type de post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentPerformance.map((item) => (
                  <div key={item.type} className="flex items-center">
                    <div className="w-24 text-sm font-medium">{item.type}</div>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(item.engagement / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-16 text-sm text-muted-foreground text-right">
                      {item.count} posts
                    </div>
                    <div className="w-16 text-sm font-medium text-right">
                      {item.engagement}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Score du profil"
              value="78/100"
              change={5}
              icon={TrendingUp}
            />
            <StatCard
              title="Complétion"
              value="85%"
              change={0}
              icon={PieChart}
            />
            <StatCard
              title="Compétences"
              value="32"
              change={10}
              icon={BarChart3}
            />
            <StatCard
              title="Recommandations"
              value="12"
              change={2}
              icon={MessageSquare}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Évolution du score profil</CardTitle>
              <CardDescription>
                Votre score d&apos;optimisation LinkedIn au fil du temps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={[
                    { month: 'Jan', score: 45 },
                    { month: 'Fév', score: 52 },
                    { month: 'Mar', score: 58 },
                    { month: 'Avr', score: 62 },
                    { month: 'Mai', score: 70 },
                    { month: 'Juin', score: 78 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Posts créés"
              value="52"
              change={8}
              icon={BarChart3}
            />
            <StatCard
              title="Impressions totales"
              value="24.5K"
              change={15}
              icon={Eye}
            />
            <StatCard
              title="Taux d'engagement"
              value="5.2%"
              change={-1}
              icon={Heart}
            />
            <StatCard
              title="Meilleur post"
              value="2.4K"
              change={0}
              icon={TrendingUp}
              description="impressions"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top publications</CardTitle>
              <CardDescription>
                Vos publications les plus performantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                      {i}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Publication #{i}</p>
                      <p className="text-sm text-muted-foreground">
                        Il y a {i * 2} jours
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {(3000 - i * 200).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {250 - i * 30}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {45 - i * 5}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Abonnés totaux"
              value="2,847"
              change={8.5}
              icon={Users}
            />
            <StatCard
              title="Croissance mensuelle"
              value="127"
              change={12}
              icon={TrendingUp}
            />
            <StatCard
              title="Connexions"
              value="500+"
              change={0}
              icon={Users}
            />
            <StatCard
              title="Portée moyenne"
              value="1.2K"
              change={5}
              icon={Eye}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par secteur</CardTitle>
                <CardDescription>
                  Secteurs d&apos;activité de votre audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { sector: 'Technologie', percent: 35 },
                    { sector: 'Marketing', percent: 25 },
                    { sector: 'Finance', percent: 18 },
                    { sector: 'Consulting', percent: 12 },
                    { sector: 'Autres', percent: 10 },
                  ].map((item) => (
                    <div key={item.sector} className="flex items-center">
                      <div className="w-28 text-sm">{item.sector}</div>
                      <div className="flex-1 mx-3">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-12 text-sm text-muted-foreground text-right">
                        {item.percent}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par rôle</CardTitle>
                <CardDescription>
                  Fonctions de votre audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { role: 'CEO / Fondateur', percent: 22 },
                    { role: 'Manager', percent: 28 },
                    { role: 'Consultant', percent: 20 },
                    { role: 'Freelance', percent: 18 },
                    { role: 'Employé', percent: 12 },
                  ].map((item) => (
                    <div key={item.role} className="flex items-center">
                      <div className="w-28 text-sm">{item.role}</div>
                      <div className="flex-1 mx-3">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-12 text-sm text-muted-foreground text-right">
                        {item.percent}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
