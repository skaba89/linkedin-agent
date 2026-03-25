'use client';

import { useWorkspaceStore } from '@/lib/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Check, ChevronsUpDown, Plus } from 'lucide-react';

export function WorkspaceSelector() {
  const { currentWorkspace, workspaces, setCurrentWorkspace } = useWorkspaceStore();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 hover:bg-accent"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={currentWorkspace?.iconUrl || ''}
              alt={currentWorkspace?.name || ''}
            />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {currentWorkspace ? getInitials(currentWorkspace.name) : 'WS'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium leading-none">
              {currentWorkspace?.name || 'Sélectionner un espace'}
            </span>
            <span className="text-xs text-muted-foreground">
              {currentWorkspace?.workspaceType === 'personal'
                ? 'Personnel'
                : currentWorkspace?.workspaceType === 'company'
                ? 'Entreprise'
                : 'Client'}
            </span>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Espaces de travail</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.length === 0 ? (
          <div className="px-2 py-4 text-center">
            <Building2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Aucun espace de travail
            </p>
          </div>
        ) : (
          workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => setCurrentWorkspace(workspace)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage
                    src={workspace.iconUrl || ''}
                    alt={workspace.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(workspace.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{workspace.name}</span>
              </div>
              {currentWorkspace?.id === workspace.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-primary">
          <Plus className="h-4 w-4 mr-2" />
          <span>Créer un espace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
