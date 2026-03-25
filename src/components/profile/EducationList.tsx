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
  GraduationCap, 
  Plus, 
  MoreVertical, 
  Pencil, 
  Trash2,
  School,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { EducationForm } from './EducationForm';
import type { EducationEntry } from '@/types';

interface EducationListProps {
  educations: EducationEntry[];
  onAdd: (data: Partial<EducationEntry>) => Promise<void>;
  onUpdate: (id: string, data: Partial<EducationEntry>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function formatDate(date: Date | string | null): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

export function EducationList({
  educations,
  onAdd,
  onUpdate,
  onDelete,
}: EducationListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducationEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (education: EducationEntry) => {
    setEditingEducation(education);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingEducation(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: Partial<EducationEntry>) => {
    if (editingEducation) {
      await onUpdate(editingEducation.id, data);
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
      console.error('Error deleting education:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const sortedEducations = [...educations].sort((a, b) => a.order - b.order);

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Formation
              {educations.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {educations.length}
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
          {sortedEducations.length === 0 ? (
            <div className="py-8 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                Aucune formation ajoutée pour le moment.
              </p>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une formation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEducations.map((edu) => (
                <div
                  key={edu.id}
                  className="group relative p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex gap-3">
                    {/* Logo école */}
                    <div className="flex-shrink-0">
                      {edu.schoolLogoUrl ? (
                        <img 
                          src={edu.schoolLogoUrl}
                          alt={edu.school}
                          className="w-12 h-12 rounded-lg object-cover bg-muted"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <School className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{edu.school}</h3>
                          {edu.degree && (
                            <p className="text-muted-foreground">{edu.degree}</p>
                          )}
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
                            <DropdownMenuItem onClick={() => handleEdit(edu)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeleteId(edu.id)}
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
                        {(edu.startDate || edu.endDate) && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(edu.startDate)} - {formatDate(edu.endDate) || 'Présent'}
                          </span>
                        )}
                        {edu.fieldOfStudy && (
                          <Badge variant="outline" className="text-xs">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {edu.fieldOfStudy}
                          </Badge>
                        )}
                      </div>

                      {/* Description */}
                      {edu.description && (
                        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                          {edu.description}
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
      <EducationForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        education={editingEducation}
        onSubmit={handleSubmit}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette formation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La formation sera définitivement supprimée de votre profil.
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

export default EducationList;
