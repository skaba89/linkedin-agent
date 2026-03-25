'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Award, 
  Plus, 
  X, 
  Sparkles, 
  Loader2,
  Search,
  Lightbulb
} from 'lucide-react';
import type { ProfileSkill } from '@/types';

interface SkillsManagerProps {
  skills: ProfileSkill[];
  onAdd: (name: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onSuggestSkills?: () => Promise<string[]>;
  maxSkills?: number;
}

export function SkillsManager({
  skills,
  onAdd,
  onRemove,
  onSuggestSkills,
  maxSkills = 50,
}: SkillsManagerProps) {
  const [newSkill, setNewSkill] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = async (skillName?: string) => {
    const name = skillName || newSkill.trim();
    if (!name) return;
    
    setIsAdding(true);
    try {
      await onAdd(name);
      setNewSkill('');
      if (skillName) {
        setSuggestedSkills(prev => prev.filter(s => s !== skillName));
      }
    } catch (error) {
      console.error('Error adding skill:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    setIsRemoving(id);
    try {
      await onRemove(id);
      setDeleteId(null);
    } catch (error) {
      console.error('Error removing skill:', error);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleSuggestSkills = async () => {
    if (!onSuggestSkills) return;
    setIsSuggesting(true);
    try {
      const suggestions = await onSuggestSkills();
      // Filter out skills that already exist
      const existingNames = skills.map(s => s.name.toLowerCase());
      const filtered = suggestions.filter(s => !existingNames.includes(s.toLowerCase()));
      setSuggestedSkills(filtered);
    } catch (error) {
      console.error('Error suggesting skills:', error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      handleAdd();
    }
  };

  const canAddMore = skills.length < maxSkills;
  const sortedSkills = [...skills].sort((a, b) => a.order - b.order);

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5" />
              Compétences
              <Badge variant="secondary" className="ml-2">
                {skills.length}/{maxSkills}
              </Badge>
            </CardTitle>
            {onSuggestSkills && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSuggestSkills}
                disabled={isSuggesting}
              >
                {isSuggesting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-1" />
                )}
                Suggestions IA
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input pour ajouter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ajouter une compétence..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9"
                disabled={!canAddMore}
              />
            </div>
            <Button
              onClick={() => handleAdd()}
              disabled={!newSkill.trim() || !canAddMore || isAdding}
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Suggestions de compétences */}
          {suggestedSkills.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Compétences suggérées</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleAdd(skill)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Liste des compétences */}
          {sortedSkills.length === 0 ? (
            <div className="py-8 text-center">
              <Award className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                Aucune compétence ajoutée pour le moment.
              </p>
              <p className="text-sm text-muted-foreground">
                LinkedIn recommande d&apos;avoir au moins 5 compétences pour optimiser votre profil.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sortedSkills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant={skill.isAISuggested ? 'secondary' : 'default'}
                  className="py-1.5 px-3 group relative pr-8"
                >
                  <span>{skill.name}</span>
                  {skill.endorsements > 0 && (
                    <span className="ml-2 text-xs opacity-70">
                      {skill.endorsements}
                    </span>
                  )}
                  <button
                    onClick={() => setDeleteId(skill.id)}
                    className="absolute -right-1 top-1/2 -translate-y-1/2 ml-1 p-0.5 rounded-full hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all"
                    disabled={isRemoving === skill.id}
                  >
                    {isRemoving === skill.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Message si limite atteinte */}
          {!canAddMore && (
            <p className="text-sm text-muted-foreground text-center">
              Vous avez atteint la limite de {maxSkills} compétences.
            </p>
          )}

          {/* Indicateur de qualité */}
          {sortedSkills.length > 0 && sortedSkills.length < 5 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
              <Lightbulb className="h-4 w-4" />
              <span>
                Ajoutez {5 - sortedSkills.length} compétence(s) pour optimiser votre profil.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette compétence ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La compétence sera définitivement supprimée de votre profil.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleRemove(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default SkillsManager;
