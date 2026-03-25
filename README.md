# LinkedInBoost

Plateforme SaaS d'optimisation de présence LinkedIn avec Next.js 16, TypeScript, Prisma et PostgreSQL.

## 🚀 Fonctionnalités

- **Dashboard Analytics** - Visualisation des métriques LinkedIn
- **Gestion de Profil** - Optimisation du profil LinkedIn avec scoring
- **Content Studio** - Création de posts avec génération IA
- **Calendrier de Publication** - Planification des contenus
- **Multi-workspace** - Gestion de plusieurs espaces de travail
- **Authentification JWT** - Système d'authentification sécurisé

## 🛠️ Stack Technique

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL avec Prisma ORM
- **State Management**: Zustand
- **Authentication**: JWT + bcryptjs

## 📋 Prérequis

- Node.js 18+
- PostgreSQL 15+
- npm ou bun

## 🏃 Démarrage Local

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local

# Générer le client Prisma
npx prisma generate

# Lancer les migrations
npx prisma migrate dev

# Démarrer le serveur de développement
npm run dev
```

## 🌐 Déploiement sur Render

Voir le fichier `render.yaml` pour la configuration automatique ou consultez le guide complet dans `/download/Guide_Deploiement_Render_LinkedInBoost.pdf`.

### Variables d'environnement requises

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL PostgreSQL avec pooler |
| `DIRECT_DATABASE_URL` | URL PostgreSQL directe |
| `JWT_SECRET` | Clé secrète JWT |
| `NEXTAUTH_SECRET` | Clé secrète NextAuth |
| `NEXTAUTH_URL` | URL publique de l'application |

## 📁 Structure du Projet

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Pages d'authentification
│   ├── (dashboard)/       # Pages du dashboard
│   └── api/               # API Routes
├── components/            # Composants React
│   ├── ui/               # Composants UI de base
│   ├── dashboard/        # Composants du dashboard
│   ├── profile/          # Composants profil
│   └── layout/           # Composants de layout
├── lib/                   # Utilitaires et services
├── hooks/                 # React hooks personnalisés
└── types/                 # Types TypeScript
```

## 📄 Licence

MIT
