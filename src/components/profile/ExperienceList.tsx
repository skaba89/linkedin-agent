'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Briefcase, 
  Plus, 
  MoreVertical, 
  Pencil, 
  Trash2,
  Building2,
  Calendar,
  MapPin,
  GripVertical,
} from 'lucide-react';
import { ExperienceForm } from './ExperienceForm';
import type { ExperienceEntry, EmploymentType, LocationType } from '@/types';

interface ExperienceListProps {
  experiences: ExperienceEntry[];
  onAdd: (data: Partial<ExperienceEntry>) => Promise<void>;
  onUpdate: (id: string, data: Partial<ExperienceEntry>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onImproveDescription?: (title: string, company: string, description: string) => Promise<string>;
  onReorder?: (experiences: ExperienceEntry[]) => Promise<void>;
}

const employmentTypeLabels: Record<EmploymentType, string> = {
  'full-time': 'Temps plein',
  'part-time': 'Temps partiel',
  'contract': 'Contrat',
  'freelance': 'Freelance',
  'internship': 'Stage',
  'other': 'Autre',
};

const locationTypeLabels: Record<LocationType, string> = {
  'on-site': 'Sur site',
  'hybrid': 'Hybride',
  'remote': 'À distance',
};

function formatDate(date: Date | string | null): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

export function ExperienceList({
  experiences,
  onAdd,
  onUpdate,
  onDelete,
  onImproveDescription,
}: ExperienceListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (experience: ExperienceEntry) => {
    setEditingExperience(experience);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingExperience(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: Partial<ExperienceEntry>) => {
    if (editingExperience) {
      await onUpdate(editingExperience.id, data);
    } else {
      await onAdd(data);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting experience:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const sortedExperiences = [...experiences].sort((a, b) => a.order - b.order);

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Expériences
              {experiences.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {experiences.length}
                </Badge>
              )}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sortedExperiences.length === 0 ? (
            <div className="py-8 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                Aucune expérience ajoutée pour le moment.
              </p>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une expérience
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedExperiences.map((exp, index) => (
                <div
                  key={exp.id}
                  className="group relative p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex gap-3">
                    {/* Poignée de glisser-déposer */}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* Logo entreprise */}
                    <div className="flex-shrink-0">
                      {exp.companyLogoUrl ? (
                        <img 
                          src={exp.companyLogoUrl}
                          alt={exp.company}
                          className="w-12 h-12 rounded-lg object-cover bg-muted"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{exp.title}</h3>
                          <p className="text-muted-foreground">{exp.company}</p>
                        </div>
                        
                        {/* Menu d'actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(exp)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeleteId(exp.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Métadonnées */}
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate)}
                        </span>
                        {exp.employmentType && (
                          <Badge variant="outline" className="text-xs">
                            {employmentTypeLabels[exp.employmentType]}
                          </Badge>
                        )}
                        {exp.locationType && (
                          <Badge variant="outline" className="text-xs">
                            {locationTypeLabels[exp.locationType]}
                          </Badge>
                        )}
                      </div>

                      {exp.location && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {exp.location}
                        </div>
                      )}

                      {/* Description */}
                      {exp.description && (
                        <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulaire */}
      <ExperienceForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        experience={editingExperience}
        onSubmit={handleSubmit}
        onImproveDescription={onImproveDescription}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette expérience ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;expérience sera définitivement supprimée de votre profil.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ExperienceList;
