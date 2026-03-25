'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award,
  Save,
  Loader2,
  RefreshCw,
  FileText
} from 'lucide-react';

// Components
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSummary } from '@/components/profile/ProfileSummary';
import { ProfileScore } from '@/components/profile/ProfileScore';
import { ExperienceList } from '@/components/profile/ExperienceList';
import { EducationList } from '@/components/profile/EducationList';
import { SkillsManager } from '@/components/profile/SkillsManager';
import { CertificationsList } from '@/components/profile/CertificationsList';
import { SuggestionPanel } from '@/components/profile/SuggestionPanel';

// Types
import type { 
  LinkedInProfileDraft, 
  ExperienceEntry, 
  EducationEntry, 
  ProfileSkill,
  Certification,
  ProfileSuggestion
} from '@/types';

// Mock data for demo
const mockProfile: LinkedInProfileDraft = {
  id: 'profile-1',
  workspaceId: 'workspace-1',
  firstName: 'Jean',
  lastName: 'Dupont',
  headline: 'Développeur Full Stack | React & Node.js | Passionné par l\'innovation tech',
  photoUrl: null,
  bannerUrl: null,
  location: 'Paris, Île-de-France, France',
  countryCode: 'FR',
  postalCode: '75001',
  industryId: '4',
  industryName: 'Technologies de l\'information',
  summary: `Passionné par le développement web depuis plus de 8 ans, j'ai eu l'opportunité d'accompagner des entreprises variées dans leur transformation digitale.

Expert en React, Node.js et TypeScript, je conçois des applications web performantes et évolutives. Mon approche combine excellence technique et vision produit pour créer des solutions qui répondent véritablement aux besoins utilisateurs.

🚀 Mes expertises :
• Architecture front-end moderne (React, Next.js, Vue.js)
• Développement back-end robuste (Node.js, Express, NestJS)
• Bases de données SQL et NoSQL (PostgreSQL, MongoDB, Redis)
• DevOps et CI/CD (Docker, Kubernetes, GitHub Actions)

J'aime particulièrement relever des défis techniques complexes et travailler dans des environnements innovants. Toujours en quête d'apprentissage, je me tiens à jour des dernières tendances du développement web.

N'hésitez pas à me contacter pour échanger sur vos projets ou opportunités !`,
  websiteUrl: 'https://jeandupont.dev',
  linkedinUrl: 'https://linkedin.com/in/jeandupont',
  twitterHandle: '@jeandupont_dev',
  profileScore: 78,
  completionRate: 85,
  status: 'draft',
  publishedAt: null,
  generatedFields: null,
  suggestions: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  experiences: [
    {
      id: 'exp-1',
      profileDraftId: 'profile-1',
      title: 'Senior Full Stack Developer',
      company: 'TechCorp',
      companyId: null,
      companyLogoUrl: null,
      employmentType: 'full-time',
      location: 'Paris, France',
      locationType: 'hybrid',
      startDate: new Date('2021-03-01'),
      endDate: null,
      current: true,
      description: `• Architecture et développement de l'application web principale utilisant React et Node.js
• Mise en place d'une architecture microservices avec Docker et Kubernetes
• Amélioration des performances de 40% grâce à l'optimisation du code et à la mise en cache
• Mentorat de 3 développeurs juniors et participation aux revues de code
• Intégration de CI/CD avec GitHub Actions pour automatiser les déploiements`,
      isAIGenerated: false,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'exp-2',
      profileDraftId: 'profile-1',
      title: 'Développeur Front-End',
      company: 'StartupInnovate',
      companyId: null,
      companyLogoUrl: null,
      employmentType: 'full-time',
      location: 'Lyon, France',
      locationType: 'remote',
      startDate: new Date('2018-09-01'),
      endDate: new Date('2021-02-28'),
      current: false,
      description: 'Développement d\'interfaces utilisateur modernes avec React et TypeScript. Participation à la refonte complète du site e-commerce.',
      isAIGenerated: false,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  educations: [
    {
      id: 'edu-1',
      profileDraftId: 'profile-1',
      school: 'École Polytechnique',
      schoolId: null,
      schoolLogoUrl: null,
      degree: 'Master',
      fieldOfStudy: 'Informatique',
      startDate: new Date('2014-09-01'),
      endDate: new Date('2018-06-30'),
      description: 'Spécialisation en génie logiciel et systèmes distribués',
      isAIGenerated: false,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  skills: [
    { id: 'skill-1', profileDraftId: 'profile-1', name: 'React', skillId: null, endorsements: 45, isAISuggested: false, order: 0, createdAt: new Date(), updatedAt: new Date() },
    { id: 'skill-2', profileDraftId: 'profile-1', name: 'TypeScript', skillId: null, endorsements: 38, isAISuggested: false, order: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 'skill-3', profileDraftId: 'profile-1', name: 'Node.js', skillId: null, endorsements: 32, isAISuggested: false, order: 2, createdAt: new Date(), updatedAt: new Date() },
    { id: 'skill-4', profileDraftId: 'profile-1', name: 'Next.js', skillId: null, endorsements: 25, isAISuggested: false, order: 3, createdAt: new Date(), updatedAt: new Date() },
    { id: 'skill-5', profileDraftId: 'profile-1', name: 'PostgreSQL', skillId: null, endorsements: 20, isAISuggested: false, order: 4, createdAt: new Date(), updatedAt: new Date() },
    { id: 'skill-6', profileDraftId: 'profile-1', name: 'Docker', skillId: null, endorsements: 18, isAISuggested: false, order: 5, createdAt: new Date(), updatedAt: new Date() },
  ],
  certifications: [
    {
      id: 'cert-1',
      profileDraftId: 'profile-1',
      name: 'AWS Certified Solutions Architect',
      authority: 'Amazon Web Services',
      authorityId: null,
      authorityLogoUrl: null,
      licenseNumber: 'AWS-123456',
      displayOnProfile: true,
      issueDate: new Date('2023-01-15'),
      expirationDate: new Date('2026-01-15'),
      doesNotExpire: false,
      credentialUrl: 'https://aws.amazon.com/verification',
      isAIGenerated: false,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  projects: [],
  services: [],
  languages: [],
};

const mockSuggestions: ProfileSuggestion[] = [
  {
    field: 'photo',
    priority: 'high',
    message: 'Ajoutez une photo professionnelle',
    action: 'Une photo de profil augmente la visibilité de votre profil de 14x. Téléchargez une photo professionnelle avec un fond neutre.',
  },
  {
    field: 'banner',
    priority: 'medium',
    message: 'Personnalisez votre bannière',
    action: 'Une bannière personnalisée rend votre profil plus mémorable. Utilisez une image liée à votre domaine d\'expertise.',
  },
  {
    field: 'skills',
    priority: 'medium',
    message: 'Ajoutez plus de compétences',
    action: 'LinkedIn recommande au moins 5 compétences. Ajoutez des compétences pertinentes pour améliorer votre référencement.',
  },
  {
    field: 'certifications',
    priority: 'low',
    message: 'Ajoutez vos certifications',
    action: 'Les certifications renforcent votre crédibilité et démontrent votre expertise continue.',
  },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<LinkedInProfileDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [suggestions, setSuggestions] = useState<ProfileSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load profile data
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setProfile(mockProfile);
      setSuggestions(mockSuggestions);
      setIsLoading(false);
    }, 500);
  }, []);

  // Handlers
  const handleUpdateProfile = async (data: Partial<LinkedInProfileDraft>) => {
    setIsSaving(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setProfile(prev => prev ? { ...prev, ...data } : null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSummary = async (summary: string) => {
    await handleUpdateProfile({ summary });
  };

  const handleGenerateSummary = async (): Promise<string> => {
    // Simulating AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `En tant que développeur Full Stack passionné avec plus de 8 ans d'expérience, je combine expertise technique et vision stratégique pour créer des solutions web innovantes.

Mon parcours m'a permis de maîtriser un large éventail de technologies, de React à Node.js en passant par les architectures cloud. Cette polyvalence me permet d'intervenir efficacement à chaque étape d'un projet, de la conception au déploiement.

Au-delà du code, je m'intéresse particulièrement aux bonnes pratiques de développement, à l'architecture logicielle et à l'expérience utilisateur. Je crois fermement que la technologie doit servir des objectifs métiers concrets.

Je suis toujours à la recherche de nouveaux défis et d'opportunités de collaborer sur des projets ambitieux. N'hésitez pas à me contacter !`;
  };

  const handleGenerateHeadlines = async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
      'Développeur Full Stack | React & Node.js | Architecte Solutions Cloud',
      'Senior Developer | TypeScript Enthusiast | Building Scalable Web Apps',
      'Développeur Passionné | 8+ ans d\'expérience | Expert React & Node.js',
      'Full Stack Engineer | Cloud Architecture | Tech Lead',
      'Développeur React/Node.js | AWS Certified | Passionné d\'innovation',
    ];
  };

  const handleAddExperience = async (data: Partial<ExperienceEntry>) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newExp: ExperienceEntry = {
        id: `exp-${Date.now()}`,
        profileDraftId: profile?.id || '',
        title: data.title || '',
        company: data.company || '',
        companyId: null,
        companyLogoUrl: null,
        employmentType: data.employmentType || 'full-time',
        location: data.location || null,
        locationType: data.locationType || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        current: data.current || false,
        description: data.description || null,
        isAIGenerated: false,
        order: profile?.experiences?.length || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProfile(prev => prev ? {
        ...prev,
        experiences: [...(prev.experiences || []), newExp],
      } : null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateExperience = async (id: string, data: Partial<ExperienceEntry>) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProfile(prev => prev ? {
        ...prev,
        experiences: prev.experiences?.map(exp => 
          exp.id === id ? { ...exp, ...data } : exp
        ),
      } : null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProfile(prev => prev ? {
        ...prev,
        experiences: prev.experiences?.filter(exp => exp.id !== id),
      } : null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImproveDescription = async (title: string, company: string, description: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `• Pilotage et développement de ${title} chez ${company} avec impact significatif sur les performances
• Implémentation de solutions innovantes ayant permis d'améliorer l'efficacité opérationnelle de 35%
• Collaboration étroite avec les équipes produit et design pour livrer des fonctionnalités de qualité
• Mentorat technique et partage des bonnes pratiques avec l'équipe de développement
• ${description}`;
  };

  const handleAddEducation = async (data: Partial<EducationEntry>) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newEdu: EducationEntry = {
        id: `edu-${Date.now()}`,
        profileDraftId: profile?.id || '',
        school: data.school || '',
        schoolId: null,
        schoolLogoUrl: null,
        degree: data.degree || null,
        fieldOfStudy: data.fieldOfStudy || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        description: data.description || null,
        isAIGenerated: false,
        order: profile?.educations?.length || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProfile(prev => prev ? {
        ...prev,
        educations: [...(prev.educations || []), newEdu],
      } : null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateEducation = async (id: string, data: Partial<EducationEntry>) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProfile(prev => prev ? {
        ...prev,
        educations: prev.educations?.map(edu => 
          edu.id === id ? { ...edu, ...data } : edu
        ),
      } : null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProfile(prev => prev ? {
        ...prev,
        educations: prev.educations?.filter(edu => edu.id !== id),
      } : null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = async (name: string) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newSkill: ProfileSkill = {
        id: `skill-${Date.now()}`,
        profileDraftId: profile?.id || '',
        name,
        skillId: null,
        endorsements: 0,
        isAISuggested: false,
        order: profile?.skills?.length || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProfile(prev => prev ? {
        ...prev,
        skills: [...(prev.skills || []), newSkill],
      } : null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSkill = async (id: string) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProfile(prev => prev ? {
        ...prev,
        skills: prev.skills?.filter(skill => skill.id !== id),
      } : null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuggestSkills = async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
      'GraphQL',
      'MongoDB',
      'Redis',
      'Kubernetes',
      'CI/CD',
      'Git',
      'REST APIs',
      'Microservices',
      'Testing (Jest)',
      'Tailwind CSS',
    ];
  };

  const handleAddCertification = async (data: Partial<Certification>) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newCert: Certification = {
        id: `cert-${Date.now()}`,
        profileDraftId: profile?.id || '',
        name: data.name || '',
        authority: data.authority || null,
        authorityId: null,
        authorityLogoUrl: null,
        licenseNumber: data.licenseNumber || null,
        displayOnProfile: data.displayOnProfile ?? true,
        issueDate: data.issueDate || null,
        expirationDate: data.expirationDate || null,
        doesNotExpire: data.doesNotExpire || false,
        credentialUrl: data.credentialUrl || null,
        isAIGenerated: false,
        order: profile?.certifications?.length || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProfile(prev => prev ? {
        ...prev,
        certifications: [...(prev.certifications || []), newCert],
      } : null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCertification = async (id: string, data: Partial<Certification>) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProfile(prev => prev ? {
        ...prev,
        certifications: prev.certifications?.map(cert => 
          cert.id === id ? { ...cert, ...data } : cert
        ),
      } : null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProfile(prev => prev ? {
        ...prev,
        certifications: prev.certifications?.filter(cert => cert.id !== id),
      } : null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyzeProfile = async () => {
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Update suggestions based on profile
      const newSuggestions: ProfileSuggestion[] = [
        {
          field: 'photo',
          priority: 'high',
          message: 'Ajoutez une photo professionnelle',
          action: 'Une photo de profil augmente la visibilité de votre profil de 14x.',
        },
        {
          field: 'skills',
          priority: 'medium',
          message: 'Ajoutez des compétences supplémentaires',
          action: 'LinkedIn recommande au moins 5 compétences.',
        },
      ];
      setSuggestions(newSuggestions);
      setProfile(prev => prev ? { ...prev, profileScore: 82, completionRate: 90 } : null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefreshSuggestions = async () => {
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In real app, this would call the AI API
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun profil trouvé.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mon Profil LinkedIn</h1>
          <p className="text-muted-foreground">
            Optimisez votre profil pour maximiser votre visibilité
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={profile.status === 'published' ? 'default' : 'secondary'}>
            {profile.status === 'published' ? 'Publié' : 'Brouillon'}
          </Badge>
        </div>
      </div>

      {/* Profile Header */}
      <ProfileHeader
        firstName={profile.firstName}
        lastName={profile.lastName}
        headline={profile.headline}
        photoUrl={profile.photoUrl}
        bannerUrl={profile.bannerUrl}
        location={profile.location}
        industryName={profile.industryName}
        onUpdate={handleUpdateProfile}
        onGenerateHeadline={handleGenerateHeadlines}
      />

      {/* Main content with tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Score and Suggestions */}
        <div className="space-y-6">
          <ProfileScore
            score={profile.profileScore}
            completionRate={profile.completionRate}
            onAnalyze={handleAnalyzeProfile}
            isAnalyzing={isAnalyzing}
          />
          <SuggestionPanel
            suggestions={suggestions}
            onRefresh={handleRefreshSuggestions}
            isLoading={isAnalyzing}
          />
        </div>

        {/* Right column - Tabs content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview" className="gap-2">
                <User className="h-4 w-4" />
                Vue d&apos;ensemble
              </TabsTrigger>
              <TabsTrigger value="experiences" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Expériences
              </TabsTrigger>
              <TabsTrigger value="education" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                Formation
              </TabsTrigger>
              <TabsTrigger value="skills" className="gap-2">
                <Award className="h-4 w-4" />
                Compétences
              </TabsTrigger>
              <TabsTrigger value="certifications" className="gap-2">
                <Award className="h-4 w-4" />
                Certifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <ProfileSummary
                  summary={profile.summary}
                  onUpdate={handleUpdateSummary}
                  onGenerateSummary={handleGenerateSummary}
                />
                <ExperienceList
                  experiences={profile.experiences || []}
                  onAdd={handleAddExperience}
                  onUpdate={handleUpdateExperience}
                  onDelete={handleDeleteExperience}
                  onImproveDescription={handleImproveDescription}
                />
                <SkillsManager
                  skills={profile.skills || []}
                  onAdd={handleAddSkill}
                  onRemove={handleRemoveSkill}
                  onSuggestSkills={handleSuggestSkills}
                />
              </div>
            </TabsContent>

            <TabsContent value="experiences">
              <ExperienceList
                experiences={profile.experiences || []}
                onAdd={handleAddExperience}
                onUpdate={handleUpdateExperience}
                onDelete={handleDeleteExperience}
                onImproveDescription={handleImproveDescription}
              />
            </TabsContent>

            <TabsContent value="education">
              <EducationList
                educations={profile.educations || []}
                onAdd={handleAddEducation}
                onUpdate={handleUpdateEducation}
                onDelete={handleDeleteEducation}
              />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsManager
                skills={profile.skills || []}
                onAdd={handleAddSkill}
                onRemove={handleRemoveSkill}
                onSuggestSkills={handleSuggestSkills}
              />
            </TabsContent>

            <TabsContent value="certifications">
              <CertificationsList
                certifications={profile.certifications || []}
                onAdd={handleAddCertification}
                onUpdate={handleUpdateCertification}
                onDelete={handleDeleteCertification}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
