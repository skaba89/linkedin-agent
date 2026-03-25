'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

type PostType = 'text' | 'image' | 'carousel' | 'video';

interface ScheduledPost {
  id: string;
  title: string;
  type: PostType;
  date: Date;
  time: string;
  status: 'scheduled' | 'draft';
}

const mockPosts: ScheduledPost[] = [
  { id: '1', title: 'L\'importance du personal branding', type: 'text', date: new Date(2026, 2, 25), time: '09:00', status: 'scheduled' },
  { id: '2', title: 'Carousel - 5 conseils LinkedIn', type: 'carousel', date: new Date(2026, 2, 25), time: '14:00', status: 'scheduled' },
  { id: '3', title: 'Annonce nouveau service', type: 'image', date: new Date(2026, 2, 26), time: '10:00', status: 'scheduled' },
  { id: '4', title: 'Témoignage client', type: 'video', date: new Date(2026, 2, 27), time: '11:00', status: 'scheduled' },
  { id: '5', title: 'Article de fond', type: 'text', date: new Date(2026, 2, 28), time: '09:00', status: 'draft' },
];

const typeIcons = {
  text: FileText,
  image: ImageIcon,
  carousel: LayoutGrid,
  video: ImageIcon,
};

const typeColors = {
  text: 'bg-blue-100 text-blue-700 border-blue-200',
  image: 'bg-green-100 text-green-700 border-green-200',
  carousel: 'bg-purple-100 text-purple-700 border-purple-200',
  video: 'bg-orange-100 text-orange-700 border-orange-200',
};

const typeLabels = {
  text: 'Texte',
  image: 'Image',
  carousel: 'Carrousel',
  video: 'Vidéo',
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  const getPostsForDate = (date: Date) => {
    return mockPosts.filter(post => 
      post.date.toDateString() === date.toDateString()
    );
  };

  const selectedPosts = selectedDate ? getPostsForDate(selectedDate) : [];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendrier éditorial</h1>
          <p className="text-muted-foreground">
            Planifiez et organisez vos publications LinkedIn
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={(v) => setView(v as 'month' | 'week')}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="week">Semaine</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="font-semibold min-w-[150px] text-center">
                    {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
                Aujourd&apos;hui
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              locale={fr}
              className="rounded-md border"
              classNames={{
                day_content: 'relative',
              }}
              components={{
                DayContent: ({ date }) => {
                  const dayPosts = getPostsForDate(date);
                  const hasPosts = dayPosts.length > 0;
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  const isToday = new Date().toDateString() === date.toDateString();
                  
                  return (
                    <div className="relative">
                      <span>{date.getDate()}</span>
                      {hasPosts && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {dayPosts.slice(0, 3).map((post, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                post.status === 'scheduled' 
                                  ? 'bg-primary' 
                                  : 'bg-yellow-500'
                              }`}
                            />
                          ))}
                          {dayPosts.length > 3 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                },
              }}
            />
            
            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Programmé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Brouillon</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Posts */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate?.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </CardTitle>
            <CardDescription>
              {selectedPosts.length} publication{selectedPosts.length !== 1 ? 's' : ''} prévue{selectedPosts.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune publication ce jour</p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Programmer un post
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedPosts.map((post) => {
                  const Icon = typeIcons[post.type];
                  return (
                    <div
                      key={post.id}
                      className="p-3 border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${typeColors[post.type]}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1">{post.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{post.time}</span>
                              <Badge 
                                variant="secondary" 
                                className={post.status === 'scheduled' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                                }
                              >
                                {post.status === 'scheduled' ? 'Programmé' : 'Brouillon'}
                              </Badge>
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
                            <DropdownMenuItem onClick={() => toast.success('Édition...')}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success('Copié !')}>
                              <Copy className="h-4 w-4 mr-2" />
                              Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => toast.success('Supprimé !')}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Posts Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Publications à venir</CardTitle>
          <CardDescription>
            Vos publications programmées pour les 7 prochains jours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const dayPosts = getPostsForDate(date);
              
              return (
                <div
                  key={i}
                  className={`p-4 border rounded-lg ${
                    i === 0 ? 'bg-primary/5 border-primary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </span>
                    <span className="text-muted-foreground">
                      {date.getDate()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayPosts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucun post</p>
                    ) : (
                      dayPosts.map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            post.status === 'scheduled' ? 'bg-primary' : 'bg-yellow-500'
                          }`} />
                          <span className="truncate">{post.title}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
