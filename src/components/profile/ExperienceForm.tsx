'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Sparkles, 
  Calendar,
  Building2,
  MapPin,
  Briefcase
} from 'lucide-react';
import type { ExperienceEntry, EmploymentType, LocationType } from '@/types';

interface ExperienceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: ExperienceEntry | null;
  onSubmit: (data: Partial<ExperienceEntry>) => Promise<void>;
  onImproveDescription?: (title: string, company: string, description: string) => Promise<string>;
}

const employmentTypes: { value: EmploymentType; label: string }[] = [
  { value: 'full-time', label: 'Temps plein' },
  { value: 'part-time', label: 'Temps partiel' },
  { value: 'contract', label: 'Contrat' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Stage' },
  { value: 'other', label: 'Autre' },
];

const locationTypes: { value: LocationType; label: string }[] = [
  { value: 'on-site', label: 'Sur site' },
  { value: 'hybrid', label: 'Hybride' },
  { value: 'remote', label: 'À distance' },
];

export function ExperienceForm({
  open,
  onOpenChange,
  experience,
  onSubmit,
  onImproveDescription,
}: ExperienceFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<ExperienceEntry>>({
    title: experience?.title || '',
    company: experience?.company || '',
    employmentType: experience?.employmentType || 'full-time',
    location: experience?.location || '',
    locationType: experience?.locationType || 'on-site',
    startDate: experience?.startDate || null,
    endDate: experience?.endDate || null,
    current: experience?.current || false,
    description: experience?.description || '',
  });

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value ? new Date(value) : null,
    }));
  };

  const handleCurrentChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      current: checked,
      endDate: checked ? null : prev.endDate,
    }));
  };

  const handleImproveDescription = async () => {
    if (!onImproveDescription || !formData.description) return;
    setIsImproving(true);
    try {
      const improved = await onImproveDescription(
        formData.title || '',
        formData.company || '',
        formData.description
      );
      setFormData(prev => ({ ...prev, description: improved }));
    } catch (error) {
      console.error('Error improving description:', error);
    } finally {
      setIsImproving(false);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving experience:', error);
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
            <Briefcase className="h-5 w-5" />
            {experience ? 'Modifier l\'expérience' : 'Ajouter une expérience'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Titre du poste */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre du poste *</Label>
            <Input
              id="title"
              placeholder="Ex: Développeur Full Stack"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Entreprise */}
          <div className="space-y-2">
            <Label htmlFor="company">Entreprise *</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="company"
                placeholder="Ex: Google, Microsoft..."
                value={formData.company || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="pl-9"
              />
            </div>
          </div>

          {/* Type d'emploi */}
          <div className="space-y-2">
            <Label>Type d&apos;emploi</Label>
            <Select
              value={formData.employmentType || 'full-time'}
              onValueChange={(value: EmploymentType) => 
                setFormData(prev => ({ ...prev, employmentType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {employmentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Localisation */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Paris, France"
                  value={formData.location || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mode de travail</Label>
              <Select
                value={formData.locationType || 'on-site'}
                onValueChange={(value: LocationType) => 
                  setFormData(prev => ({ ...prev, locationType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {locationTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  Date de début *
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
                  disabled={formData.current}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Switch
                id="current"
                checked={formData.current}
                onCheckedChange={handleCurrentChange}
              />
              <Label htmlFor="current" className="text-sm">
                J&apos;occupe actuellement ce poste
              </Label>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              {onImproveDescription && formData.description && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleImproveDescription}
                  disabled={isImproving}
                >
                  {isImproving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-1" />
                  )}
                  Améliorer avec l&apos;IA
                </Button>
              )}
            </div>
            <Textarea
              id="description"
              placeholder="Décrivez vos responsabilités et réalisations..."
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[150px]"
            />
            <p className="text-xs text-muted-foreground">
              {formData.description?.length || 0} / 2000 caractères
            </p>
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
            disabled={isSaving || !formData.title || !formData.company}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : null}
            {experience ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExperienceForm;
