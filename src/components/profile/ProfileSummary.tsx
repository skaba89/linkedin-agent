'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Pencil, 
  Save, 
  X, 
  Sparkles, 
  Loader2,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

interface ProfileSummaryProps {
  summary: string | null;
  onUpdate: (summary: string) => Promise<void>;
  onGenerateSummary?: () => Promise<string>;
  charCount?: { min: number; max: number };
}

export function ProfileSummary({
  summary,
  onUpdate,
  onGenerateSummary,
  charCount = { min: 1500, max: 2600 },
}: ProfileSummaryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editValue, setEditValue] = useState(summary || '');
  const [copied, setCopied] = useState(false);

  const charCount_value = editValue.length;
  const isWithinRange = charCount_value >= charCount.min && charCount_value <= charCount.max;
  const charCountColor = isWithinRange 
    ? 'text-green-600' 
    : charCount_value < charCount.min 
      ? 'text-orange-600' 
      : 'text-red-600';

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving summary:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(summary || '');
    setIsEditing(false);
  };

  const handleGenerate = async () => {
    if (!onGenerateSummary) return;
    setIsGenerating(true);
    try {
      const generated = await onGenerateSummary();
      setEditValue(generated);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Afficher le résumé avec mise en forme
  const formattedSummary = summary?.split('\n').map((paragraph, i) => (
    <p key={i} className={paragraph.trim() ? 'mb-3 last:mb-0' : ''}>
      {paragraph}
    </p>
  ));

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            À propos
          </CardTitle>
          <div className="flex gap-2">
            {!isEditing && summary && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
            {!isEditing && (
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
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <div className="relative">
              <Textarea
                placeholder="Rédigez votre résumé professionnel..."
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="min-h-[300px] resize-y"
                maxLength={charCount.max}
              />
            </div>
            
            {/* Compteur de caractères */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${charCountColor}`}>
                  {charCount_value} / {charCount.min}-{charCount.max} caractères
                </span>
                {isWithinRange && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Optimal
                  </Badge>
                )}
              </div>
              {editValue.length > charCount.max && (
                <span className="text-sm text-red-600">
                  Trop long de {editValue.length - charCount.max} caractères
                </span>
              )}
            </div>

            {/* Bouton de génération IA */}
            {onGenerateSummary && (
              <Button
                variant="outline"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Générer avec l&apos;IA
                  </>
                )}
              </Button>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-1" />
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !editValue.trim()}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                Enregistrer
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            {summary ? (
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {formattedSummary}
              </div>
            ) : (
              <div className="py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">
                  Aucun résumé n&apos;a été rédigé pour ce profil.
                </p>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Rédiger
                  </Button>
                  {onGenerateSummary && (
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-1" />
                      )}
                      Générer avec l&apos;IA
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ProfileSummary;
