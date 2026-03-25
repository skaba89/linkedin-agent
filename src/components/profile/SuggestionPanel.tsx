'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  RefreshCw,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { ProfileSuggestion } from '@/types';

interface SuggestionPanelProps {
  suggestions: ProfileSuggestion[];
  onRefresh?: () => Promise<void>;
  onApplySuggestion?: (suggestion: ProfileSuggestion) => void;
  isLoading?: boolean;
}

const priorityConfig = {
  high: {
    label: 'Priorité haute',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: AlertTriangle,
  },
  medium: {
    label: 'Priorité moyenne',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: Lightbulb,
  },
  low: {
    label: 'Priorité basse',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle,
  },
};

const fieldLabels: Record<string, string> = {
  photo: 'Photo de profil',
  headline: 'Titre',
  summary: 'Résumé',
  experience: 'Expériences',
  education: 'Formation',
  skills: 'Compétences',
  certifications: 'Certifications',
  recommendations: 'Recommandations',
  banner: 'Bannière',
  location: 'Localisation',
  industry: 'Industrie',
};

export function SuggestionPanel({
  suggestions,
  onRefresh,
  onApplySuggestion,
  isLoading = false,
}: SuggestionPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    const priority = suggestion.priority;
    if (!acc[priority]) acc[priority] = [];
    acc[priority].push(suggestion);
    return acc;
  }, {} as Record<string, ProfileSuggestion[]>);

  const highPriorityCount = groupedSuggestions.high?.length || 0;
  const mediumPriorityCount = groupedSuggestions.medium?.length || 0;
  const lowPriorityCount = groupedSuggestions.low?.length || 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Suggestions IA
          </CardTitle>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        
        {/* Résumé des priorités */}
        {suggestions.length > 0 && (
          <div className="flex gap-2 mt-2">
            {highPriorityCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {highPriorityCount} urgente{highPriorityCount > 1 ? 's' : ''}
              </Badge>
            )}
            {mediumPriorityCount > 0 && (
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                {mediumPriorityCount} à améliorer
              </Badge>
            )}
            {lowPriorityCount > 0 && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                {lowPriorityCount} optionnelle{lowPriorityCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="py-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              Excellent travail !
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Votre profil est bien optimisé.
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="space-y-3 pr-4">
              {['high', 'medium', 'low'].map((priority) => {
                const items = groupedSuggestions[priority];
                if (!items || items.length === 0) return null;
                
                const config = priorityConfig[priority as keyof typeof priorityConfig];
                const IconComponent = config.icon;
                
                return items.map((suggestion) => {
                  const isExpanded = expandedId === `${suggestion.field}-${suggestion.message}`;
                  
                  return (
                    <div
                      key={`${suggestion.field}-${suggestion.message}`}
                      className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}
                    >
                      <div 
                        className="flex items-start gap-3 cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : `${suggestion.field}-${suggestion.message}`)}
                      >
                        <IconComponent className={`h-5 w-5 flex-shrink-0 ${config.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {fieldLabels[suggestion.field] || suggestion.field}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {suggestion.message}
                          </p>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="mt-3 pl-8">
                          <p className="text-sm mb-2">
                            {suggestion.action}
                          </p>
                          {onApplySuggestion && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onApplySuggestion(suggestion);
                              }}
                            >
                              Appliquer
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                });
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export default SuggestionPanel;
