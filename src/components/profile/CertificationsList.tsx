'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
  Award, 
  Plus, 
  MoreVertical, 
  Pencil, 
  Trash2,
  Calendar,
  Building2,
  ExternalLink,
  Loader2
} from 'lucide-react';
import type { Certification } from '@/types';

interface CertificationsListProps {
  certifications: Certification[];
  onAdd: (data: Partial<Certification>) => Promise<void>;
  onUpdate: (id: string, data: Partial<Certification>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function formatDate(date: Date | string | null): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

function CertificationForm({
  open,
  onOpenChange,
  certification,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certification?: Certification | null;
  onSubmit: (data: Partial<Certification>) => Promise<void>;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Certification>>({
    name: certification?.name || '',
    authority: certification?.authority || '',
    licenseNumber: certification?.licenseNumber || '',
    credentialUrl: certification?.credentialUrl || '',
    issueDate: certification?.issueDate || null,
    expirationDate: certification?.expirationDate || null,
    doesNotExpire: certification?.doesNotExpire || false,
    displayOnProfile: certification?.displayOnProfile ?? true,
  });

  const handleDateChange = (field: 'issueDate' | 'expirationDate', value: string) => {
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
      console.error('Error saving certification:', error);
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
            <Award className="h-5 w-5" />
            {certification ? 'Modifier la certification' : 'Ajouter une certification'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Nom de la certification */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la certification *</Label>
            <Input
              id="name"
              placeholder="Ex: AWS Solutions Architect, PMP..."
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {/* Organisme certificateur */}
          <div className="space-y-2">
            <Label htmlFor="authority">Organisme certificateur</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="authority"
                placeholder="Ex: Amazon Web Services, PMI..."
                value={formData.authority || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, authority: e.target.value }))}
                className="pl-9"
              />
            </div>
          </div>

          {/* Numéro de licence */}
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">Numéro de licence</Label>
            <Input
              id="licenseNumber"
              placeholder="Ex: AWS-123456"
              value={formData.licenseNumber || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
            />
          </div>

          {/* URL de la certification */}
          <div className="space-y-2">
            <Label htmlFor="credentialUrl">URL de la certification</Label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="credentialUrl"
                type="url"
                placeholder="https://..."
                value={formData.credentialUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, credentialUrl: e.target.value }))}
                className="pl-9"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Dates
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="issueDate" className="text-xs text-muted-foreground">
                  Date d&apos;obtention
                </Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formatDateForInput(formData.issueDate)}
                  onChange={(e) => handleDateChange('issueDate', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="expirationDate" className="text-xs text-muted-foreground">
                  Date d&apos;expiration
                </Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={formatDateForInput(formData.expirationDate)}
                  onChange={(e) => handleDateChange('expirationDate', e.target.value)}
                  disabled={formData.doesNotExpire}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Switch
                id="doesNotExpire"
                checked={formData.doesNotExpire}
                onCheckedChange={(checked) => setFormData(prev => ({ 
                  ...prev, 
                  doesNotExpire: checked,
                  expirationDate: checked ? null : prev.expirationDate,
                }))}
              />
              <Label htmlFor="doesNotExpire" className="text-sm">
                Cette certification n&apos;expire pas
              </Label>
            </div>
          </div>

          {/* Afficher sur le profil */}
          <div className="flex items-center gap-2">
            <Switch
              id="displayOnProfile"
              checked={formData.displayOnProfile}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, displayOnProfile: checked }))}
            />
            <Label htmlFor="displayOnProfile" className="text-sm">
              Afficher sur le profil
            </Label>
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
            disabled={isSaving || !formData.name}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : null}
            {certification ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CertificationsList({
  certifications,
  onAdd,
  onUpdate,
  onDelete,
}: CertificationsListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingCertification(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: Partial<Certification>) => {
    if (editingCertification) {
      await onUpdate(editingCertification.id, data);
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
      console.error('Error deleting certification:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const sortedCertifications = [...certifications].sort((a, b) => a.order - b.order);

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
              {certifications.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {certifications.length}
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
          {sortedCertifications.length === 0 ? (
            <div className="py-8 text-center">
              <Award className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                Aucune certification ajoutée pour le moment.
              </p>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une certification
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCertifications.map((cert) => (
                <div
                  key={cert.id}
                  className="group relative p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex gap-3">
                    {/* Logo organisme */}
                    <div className="flex-shrink-0">
                      {cert.authorityLogoUrl ? (
                        <img 
                          src={cert.authorityLogoUrl}
                          alt={cert.authority || ''}
                          className="w-12 h-12 rounded-lg object-contain bg-muted"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Award className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{cert.name}</h3>
                          {cert.authority && (
                            <p className="text-muted-foreground text-sm">{cert.authority}</p>
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
                            <DropdownMenuItem onClick={() => handleEdit(cert)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeleteId(cert.id)}
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
                        {cert.issueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(cert.issueDate)}
                            {!cert.doesNotExpire && cert.expirationDate && (
                              <> - {formatDate(cert.expirationDate)}</>
                            )}
                            {cert.doesNotExpire && (
                              <Badge variant="outline" className="text-xs ml-1">
                                Sans expiration
                              </Badge>
                            )}
                          </span>
                        )}
                        {cert.credentialUrl && (
                          <a 
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Voir
                          </a>
                        )}
                      </div>

                      {/* Numéro de licence */}
                      {cert.licenseNumber && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Licence: {cert.licenseNumber}
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
      <CertificationForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        certification={editingCertification}
        onSubmit={handleSubmit}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette certification ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La certification sera définitivement supprimée de votre profil.
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

export default CertificationsList;
