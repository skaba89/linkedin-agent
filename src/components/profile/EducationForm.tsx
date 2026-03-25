'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Loader2, 
  Calendar,
  GraduationCap,
  School,
  BookOpen
} from 'lucide-react';
import type { EducationEntry } from '@/types';

interface EducationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  education?: EducationEntry | null;
  onSubmit: (data: Partial<EducationEntry>) => Promise<void>;
}

export function EducationForm({
  open,
  onOpenChange,
  education,
  onSubmit,
}: EducationFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<EducationEntry>>({
    school: education?.school || '',
    degree: education?.degree || '',
    fieldOfStudy: education?.fieldOfStudy || '',
    startDate: education?.startDate || null,
    endDate: education?.endDate || null,
    description: education?.description || '',
  });

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value ? new Date(value) : null,
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving education:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateForInput = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {education ? 'Modifier la formation' : 'Ajouter une formation'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* École */}
          <div className="space-y-2">
            <Label htmlFor="school">École / Université *</Label>
            <div className="relative">
              <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="school"
                placeholder="Ex: Université Paris-Saclay, HEC Paris..."
                value={formData.school || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                className="pl-9"
              />
            </div>
          </div>

          {/* Diplôme */}
          <div className="space-y-2">
            <Label htmlFor="degree">Diplôme</Label>
            <Input
              id="degree"
              placeholder="Ex: Master, Licence, MBA..."
              value={formData.degree || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
            />
          </div>

          {/* Domaine d'études */}
          <div className="space-y-2">
            <Label htmlFor="fieldOfStudy">Domaine d&apos;études</Label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fieldOfStudy"
                placeholder="Ex: Informatique, Marketing, Finance..."
                value={formData.fieldOfStudy || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
                className="pl-9"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Période
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="startDate" className="text-xs text-muted-foreground">
                  Date de début
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formatDateForInput(formData.startDate)}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="endDate" className="text-xs text-muted-foreground">
                  Date de fin
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formatDateForInput(formData.endDate)}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Activités, associations, projets notables..."
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSaving || !formData.school}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : null}
            {education ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EducationForm;
