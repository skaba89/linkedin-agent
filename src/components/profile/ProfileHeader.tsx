'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Pencil, 
  Save, 
  X, 
  Sparkles, 
  MapPin,
  Briefcase,
  Loader2
} from 'lucide-react';

interface ProfileHeaderProps {
  firstName: string | null;
  lastName: string | null;
  headline: string | null;
  photoUrl: string | null;
  bannerUrl: string | null;
  location: string | null;
  industryName: string | null;
  onUpdate: (data: {
    firstName?: string;
    lastName?: string;
    headline?: string;
    photoUrl?: string;
    bannerUrl?: string;
    location?: string;
    industryName?: string;
  }) => Promise<void>;
  onGenerateHeadline?: () => Promise<string[]>;
}

export function ProfileHeader({
  firstName,
  lastName,
  headline,
  photoUrl,
  bannerUrl,
  location,
  industryName,
  onUpdate,
  onGenerateHeadline,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingHeadline, setIsGeneratingHeadline] = useState(false);
  const [suggestedHeadlines, setSuggestedHeadlines] = useState<string[]>([]);
  const [editData, setEditData] = useState({
    firstName: firstName || '',
    lastName: lastName || '',
    headline: headline || '',
    location: location || '',
    industryName: industryName || '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(editData);
      setIsEditing(false);
      setSuggestedHeadlines([]);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      firstName: firstName || '',
      lastName: lastName || '',
      headline: headline || '',
      location: location || '',
      industryName: industryName || '',
    });
    setIsEditing(false);
    setSuggestedHeadlines([]);
  };

  const handleGenerateHeadline = async () => {
    if (!onGenerateHeadline) return;
    setIsGeneratingHeadline(true);
    try {
      const headlines = await onGenerateHeadline();
      setSuggestedHeadlines(headlines);
    } catch (error) {
      console.error('Error generating headline:', error);
    } finally {
      setIsGeneratingHeadline(false);
    }
  };

  const selectHeadline = (h: string) => {
    setEditData(prev => ({ ...prev, headline: h }));
    setSuggestedHeadlines([]);
  };

  const displayName = `${firstName || ''} ${lastName || ''}`.trim() || 'Profil LinkedIn';
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  return (
    <Card className="w-full overflow-hidden">
      {/* Bannière */}
      <div className="relative h-40 bg-gradient-to-r from-blue-600 to-blue-800">
        {bannerUrl && (
          <img 
            src={bannerUrl} 
            alt="Bannière"
            className="w-full h-full object-cover"
          />
        )}
        {isEditing && (
          <button className="absolute bottom-2 right-2 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        )}
      </div>

      <CardContent className="relative pt-0">
        {/* Photo de profil */}
        <div className="absolute -top-16 left-6">
          <div className="relative">
            {photoUrl ? (
              <img 
                src={photoUrl}
                alt={displayName}
                className="w-32 h-32 rounded-full border-4 border-background object-cover bg-muted"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-background bg-muted flex items-center justify-center">
                <span className="text-3xl font-semibold text-muted-foreground">
                  {initials || '?'}
                </span>
              </div>
            )}
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Contenu */}
        <div className="pt-20 pl-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Prénom"
                      value={editData.firstName}
                      onChange={(e) => setEditData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="max-w-[150px]"
                    />
                    <Input
                      placeholder="Nom"
                      value={editData.lastName}
                      onChange={(e) => setEditData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="max-w-[150px]"
                    />
                  </div>
                  
                  {/* Titre avec génération IA */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Votre titre LinkedIn..."
                        value={editData.headline}
                        onChange={(e) => setEditData(prev => ({ ...prev, headline: e.target.value }))}
                        className="min-h-[60px] flex-1"
                        maxLength={220}
                      />
                    </div>
                    {onGenerateHeadline && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateHeadline}
                        disabled={isGeneratingHeadline}
                        className="w-full"
                      >
                        {isGeneratingHeadline ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        Générer des titres avec l&apos;IA
                      </Button>
                    )}
                    
                    {/* Suggestions de titres */}
                    {suggestedHeadlines.length > 0 && (
                      <div className="space-y-2 mt-3">
                        <p className="text-sm text-muted-foreground">Suggestions :</p>
                        {suggestedHeadlines.map((h, i) => (
                          <button
                            key={i}
                            onClick={() => selectHeadline(h)}
                            className="w-full text-left p-2 text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Localisation"
                          value={editData.location}
                          onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Industrie"
                          value={editData.industryName}
                          onChange={(e) => setEditData(prev => ({ ...prev, industryName: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{displayName}</h1>
                  {headline && (
                    <p className="text-muted-foreground mt-1">{headline}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                    {location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {location}
                      </span>
                    )}
                    {industryName && (
                      <Badge variant="secondary">{industryName}</Badge>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <Save className="h-4 w-4 mr-1" />
                    )}
                    Enregistrer
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileHeader;
