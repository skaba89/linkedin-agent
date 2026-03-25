'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles,
  Send,
  Clock,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  Video,
  RefreshCw,
  Copy,
  Calendar,
  Eye,
  Trash2,
  MoreHorizontal,
  Wand2,
  Loader2,
  CheckCircle,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

type PostType = 'text' | 'image' | 'carousel' | 'video' | 'article';
type ContentTone = 'professional' | 'casual' | 'inspirational' | 'educational' | 'promotional';
type PostStatus = 'draft' | 'scheduled' | 'published';

interface Post {
  id: string;
  title: string;
  content: string;
  postType: PostType;
  status: PostStatus;
  scheduledFor?: Date;
  createdAt: Date;
}

const postTypeIcons = {
  text: FileText,
  image: ImageIcon,
  carousel: LayoutGrid,
  video: Video,
  article: FileText,
};

const toneOptions = [
  { value: 'professional', label: 'Professionnel' },
  { value: 'casual', label: 'Décontracté' },
  { value: 'inspirational', label: 'Inspirant' },
  { value: 'educational', label: 'Éducatif' },
  { value: 'promotional', label: 'Promotionnel' },
];

const languageOptions = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
];

// Mock data
const mockDrafts: Post[] = [
  {
    id: '1',
    title: 'L\'importance du personal branding',
    content: 'Votre personal branding est votre meilleur atout...',
    postType: 'text',
    status: 'draft',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Carousel - 5 conseils LinkedIn',
    content: 'Découvrez mes 5 conseils pour réussir sur LinkedIn...',
    postType: 'carousel',
    status: 'draft',
    createdAt: new Date(),
  },
];

const mockScheduled: Post[] = [
  {
    id: '3',
    title: 'Nouveau post programmé',
    content: 'Contenu programmé pour demain...',
    postType: 'text',
    status: 'scheduled',
    scheduledFor: new Date(Date.now() + 86400000),
    createdAt: new Date(),
  },
];

const mockPublished: Post[] = [
  {
    id: '4',
    title: 'Post publié hier',
    content: 'Ce post a été publié avec succès...',
    postType: 'image',
    status: 'published',
    createdAt: new Date(Date.now() - 86400000),
  },
];

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState('create');
  const [postType, setPostType] = useState<PostType>('text');
  const [tone, setTone] = useState<ContentTone>('professional');
  const [language, setLanguage] = useState('fr');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [hooks, setHooks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleGenerateContent = async () => {
    if (!topic.trim()) {
      toast.error('Veuillez entrer un sujet');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          category: 'thought_leadership',
          tone,
          language,
          length: 'medium',
        }),
      });

      if (!response.ok) throw new Error('Erreur de génération');

      const data = await response.json();
      setContent(data.data?.content || '');
      setHooks(data.data?.hooks || []);
      toast.success('Contenu généré avec succès !');
    } catch {
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateHooks = async () => {
    if (!topic.trim()) {
      toast.error('Veuillez entrer un sujet');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, count: 5 }),
      });

      if (!response.ok) throw new Error('Erreur de génération');

      const data = await response.json();
      setHooks(data.data?.hooks || []);
      toast.success('Hooks générés !');
    } catch {
      toast.error('Erreur lors de la génération des hooks');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const response = await fetch('/api/content/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postType,
          content,
          tone,
          language,
          status: 'draft',
          hooks,
        }),
      });

      if (!response.ok) throw new Error('Erreur');

      toast.success('Brouillon sauvegardé');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    toast.success('Contenu copié !');
  };

  const PostCard = ({ post }: { post: Post }) => {
    const Icon = postTypeIcons[post.postType];
    const statusColors = {
      draft: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800',
      published: 'bg-green-100 text-green-800',
    };
    const statusLabels = {
      draft: 'Brouillon',
      scheduled: 'Programmé',
      published: 'Publié',
    };

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium line-clamp-1">{post.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {post.content}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={statusColors[post.status]} variant="secondary">
                    {statusLabels[post.status]}
                  </Badge>
                  {post.scheduledFor && (
                    <span className="text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {new Date(post.scheduledFor).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" /> Aperçu
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" /> Dupliquer
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Studio de Contenu</h1>
        <p className="text-muted-foreground">
          Créez et gérez votre contenu LinkedIn avec l&apos;aide de l&apos;IA
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="create">
            <Wand2 className="h-4 w-4 mr-2" />
            Créer
          </TabsTrigger>
          <TabsTrigger value="drafts">
            <FileText className="h-4 w-4 mr-2" />
            Brouillons ({mockDrafts.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <Clock className="h-4 w-4 mr-2" />
            Programmés ({mockScheduled.length})
          </TabsTrigger>
          <TabsTrigger value="published">
            <CheckCircle className="h-4 w-4 mr-2" />
            Publiés ({mockPublished.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Éditeur de contenu</CardTitle>
                <CardDescription>
                  Créez du contenu engageant pour LinkedIn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Post Type Selection */}
                <div className="space-y-2">
                  <Label>Type de post</Label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(postTypeIcons) as PostType[]).map((type) => {
                      const Icon = postTypeIcons[type];
                      const labels = {
                        text: 'Texte',
                        image: 'Image',
                        carousel: 'Carrousel',
                        video: 'Vidéo',
                        article: 'Article',
                      };
                      return (
                        <Button
                          key={type}
                          variant={postType === type ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPostType(type)}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {labels[type]}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Topic Input */}
                <div className="space-y-2">
                  <Label htmlFor="topic">Sujet ou thématique</Label>
                  <div className="flex gap-2">
                    <Input
                      id="topic"
                      placeholder="Ex: L'importance du personal branding sur LinkedIn"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>
                </div>

                {/* Settings Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ton</Label>
                    <Select value={tone} onValueChange={(v) => setTone(v as ContentTone)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Langue</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Generate Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerateContent}
                    disabled={isGenerating || !topic.trim()}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Générer avec l&apos;IA
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGenerateHooks}
                    disabled={isGenerating || !topic.trim()}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Hooks
                  </Button>
                </div>

                <Separator />

                {/* Content Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Contenu</Label>
                    <Button variant="ghost" size="sm" onClick={handleCopyContent}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copier
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Votre contenu LinkedIn ici..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {content.length} / 3000 caractères
                  </p>
                </div>

                {/* Hooks */}
                {hooks.length > 0 && (
                  <div className="space-y-2">
                    <Label>Hooks suggérés</Label>
                    <div className="space-y-2">
                      {hooks.map((hook, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <span className="text-sm flex-1">{hook}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(hook);
                                toast.success('Hook copié !');
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setContent(hook + '\n\n' + content)}
                            >
                              Utiliser
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Scheduling */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Programmer la publication</Label>
                      <p className="text-sm text-muted-foreground">
                        Publiez automatiquement à une date ultérieure
                      </p>
                    </div>
                    <Switch
                      checked={scheduleEnabled}
                      onCheckedChange={setScheduleEnabled}
                    />
                  </div>
                  {scheduleEnabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Heure</Label>
                        <Input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSaveDraft} className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                  {scheduleEnabled ? (
                    <Button className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Programmer
                    </Button>
                  ) : (
                    <Button className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Publier
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Aperçu LinkedIn</CardTitle>
                <CardDescription>
                  Aperçu du rendu sur LinkedIn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  {/* LinkedIn Preview Header */}
                  <div className="bg-white p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                        JD
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Jean Dupont</p>
                        <p className="text-xs text-gray-500">Expert LinkedIn • Personal Branding</p>
                        <p className="text-xs text-gray-400">1h • 🌍</p>
                      </div>
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                      {content || (
                        <span className="text-gray-400 italic">
                          Votre contenu apparaîtra ici...
                        </span>
                      )}
                    </div>
                    {postType !== 'text' && (
                      <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-gray-500 text-sm pt-2 border-t">
                      <span>👍 0 J&apos;aime</span>
                      <span>0 commentaire</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="mt-6">
          <div className="grid gap-4">
            {mockDrafts.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun brouillon</p>
                  <p className="text-sm">Commencez à créer du contenu pour le voir ici</p>
                </CardContent>
              </Card>
            ) : (
              mockDrafts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <div className="grid gap-4">
            {mockScheduled.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune publication programmée</p>
                  <p className="text-sm">Programmez du contenu pour le publier automatiquement</p>
                </CardContent>
              </Card>
            ) : (
              mockScheduled.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </TabsContent>

        <TabsContent value="published" className="mt-6">
          <div className="grid gap-4">
            {mockPublished.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune publication</p>
                  <p className="text-sm">Vos publications publiées apparaîtront ici</p>
                </CardContent>
              </Card>
            ) : (
              mockPublished.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
