# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Neith Consulting** - Application PWA de fidélisation pour les entreprises de Nouvelle-Calédonie.

Cette application permet aux commerçants partenaires (gérés par Neith via abonnement) d'offrir un programme de fidélité à leurs clients. Les utilisateurs scannent leurs tickets de caisse, l'OCR reconnaît le marchand et le montant, puis des **crédits en XPF** sont alloués (pourcentage paramétrable). Ces crédits sont accumulés par marchand jusqu'à un **seuil déclencheur** qui génère automatiquement un **bon d'achat** (valeur = seuil), validable en caisse via QR code ou code marchand.

### Stack Technique

- **Next.js 15** (App Router with Turbopack)
- **NextAuth.js 5 (beta)** pour l'authentification
- **Prisma ORM** avec PostgreSQL (Supabase)
- **Google Cloud Vision API** pour l'OCR des tickets
- **PWA** avec support offline

### Contexte Nouvelle-Calédonie

- Connexions variables → support offline essentiel
- Petits commerces → UX simple et inclusive
- Monnaie locale: **XPF** (Franc Pacifique)
- Tickets variés (froissés, manuels) → OCR robuste nécessaire

## Architecture

### Authentication & Authorization

- **NextAuth.js 5 (beta)** with JWT sessions and credentials provider
- Auth configuration in [src/lib/auth.ts](src/lib/auth.ts)
- Custom type extensions in [src/types/next-auth.d.ts](src/types/next-auth.d.ts)
- Protected routes use `auth()` function from auth.ts
- User sessions include custom `id` and `role` fields in JWT token
- **Admin-only access**: Neith paramètre tout, pas d'accès marchand distinct
- Logout buttons available in Dashboard and Admin pages

### Database Layer

- **Prisma ORM** with PostgreSQL (Supabase)
- Schema: [prisma/schema.prisma](prisma/schema.prisma)
- Models: User, Account, Session, Merchant (Establishment), Transaction, Voucher
- Connection uses environment variables:
  - `POSTGRES_PRISMA_URL` (pooling connection)
  - `POSTGRES_URL_NON_POOLING` (direct connection)
- **IMPORTANT**: Run `prisma generate` before building to generate Prisma Client
- **Vercel deployment**: Binary targets include `rhel-openssl-3.0.x` for serverless compatibility

### Business Logic

#### Système de Crédits (XPF)

- **Crédits en XPF concrets**: Pas de points abstraits
  - Exemple: Ticket 10 000 XPF avec 10% → 1 000 XPF de crédits
- **Crédits par marchand**: Chaque utilisateur a un solde distinct par marchand
- **Accumulation**: Les crédits s'accumulent jusqu'au seuil configuré
- **Validité**: Expiration paramétrable (défaut: 6 mois)
- **Alertes**: Push notifications J-20 et J-1 avant expiration

#### Génération de Bons d'Achat

- **Trigger automatique**: Quand crédits ≥ seuil
- **Valeur du bon**: Égale au seuil (ex: seuil 2000 XPF → bon 2000 XPF)
- **Reset**: Solde remis à 0 après génération du bon
- **Format**: QR code + code marchand (4 caractères alphanumériques)
- **Usage unique**: Validation serveur avec hash
- **Expiration visible**: Date d'expiration affichée

#### Validation des Bons

Deux méthodes:

1. **Scan QR**: Par téléphone utilisateur ou douchette commerçant
2. **Saisie manuelle**: Code marchand (4 caractères) + bouton "Valider"

Après validation:

- Bon marqué comme consommé (grisé dans l'interface)
- Message: "Remise [montant] XPF à appliquer"
- Application manuelle de la remise par le commerçant

### App Structure

- Next.js 15 App Router with Turbopack
- Pages in [src/app/](src/app/):
  - `/` - Landing page (onboarding PWA, connexion/inscription)
  - `/auth/signin` & `/auth/signup` - Authentication pages
  - `/dashboard` - User dashboard (protected) avec bouton logout
    - Palmarès top 3 soldes (logos/noms/montants XPF)
    - Bouton central "Scanner un ticket"
    - Statistiques: nombre de partenaires, total crédits
  - `/admin` - Admin panel (protected, role-based) avec bouton logout
    - Création et paramétrage des marchands
    - Monitoring global (users, merchants, bons, scans)
    - Statistiques détaillées
  - `/admin/login` - Admin-specific login page
  - `/scan` - Receipt scanning (OCR Google Cloud Vision)
  - Bottom navigation: Accueil, Partenaires, Mes Bons
- API routes in [src/app/api/](src/app/api/):
  - `/api/auth/[...nextauth]` - NextAuth handlers
  - `/api/auth/signup` - User registration
  - `/api/admin/establishments` - CRUD for merchants (admin only)
  - `/api/admin/check-role` - Verify admin role
  - `/api/admin/stats` - Global statistics
  - `/api/user/credits` - User credits by merchant

### Path Aliases

- `@/*` maps to `src/*` (configured in tsconfig.json)

## Development Commands

### Essential Commands

```bash
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production (runs prisma generate first)
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript type checking without emit
```

### Testing

```bash
pnpm test                 # Run Vitest tests in watch mode
pnpm test:ui              # Run tests with Vitest UI
pnpm test:coverage        # Generate coverage report (thresholds: 80% lines/functions/statements, 75% branches)
vitest run <file>         # Run specific test file
```

### Database

```bash
npx prisma generate      # Generate Prisma Client (required after schema changes)
npx prisma migrate dev   # Create and apply migrations
npx prisma studio        # Open Prisma Studio GUI
npx prisma db push       # Push schema to database without migrations
```

### Admin Scripts

```bash
pnpm admin:create-supabase      # Create admin user via Supabase Auth
pnpm admin:reset-password       # Reset admin password (local)
pnpm admin:reset-password-prod  # Reset admin password (production)
pnpm admin:list-users           # List all users in database
pnpm admin:debug-login          # Debug login credentials
pnpm admin:check-config         # Check NextAuth environment variables
```

## Code Quality

### Configuration

- **TypeScript**: Strict mode enabled with noImplicitAny, noUnusedLocals, noUnusedParameters
- **ESLint**: Next.js config with Prettier integration
- **Prettier**: Auto-formatting via lint-staged
- **Husky**: Git hooks configured for pre-commit linting

### Coverage Thresholds

- Lines: 80%
- Functions: 80%
- Branches: 75%
- Statements: 80%

Excluded from coverage: node_modules, .next, config files, type definitions, [src/app/layout.tsx](src/app/layout.tsx)

## Key Implementation Details

### NextAuth Configuration

- Uses JWT strategy (not database sessions)
- Credentials provider with bcrypt password hashing
- Custom callbacks extend JWT and session with user.id and role
- PrismaAdapter configured but JWT strategy takes precedence
- Admin authentication uses dedicated `/admin/login` page
- User authentication uses `/auth/signin` page

### Prisma Client Usage

- **Vercel compatibility**: Uses `postinstall` script to generate Prisma Client
- Webpack externals configured for `@prisma/client`
- Binary targets include `native` and `rhel-openssl-3.0.x`
- Always run `prisma generate` after schema changes or in CI/CD
- Schema uses custom field mapping (e.g., `@map("created_at")`)

### Supabase Integration

- Supabase Auth for user management (auth.users table)
- Public schema for business data (users, merchants, transactions, vouchers)
- Password hashing with bcrypt stored in public.users.password
- Environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `POSTGRES_PRISMA_URL`

### Testing Setup

- Vitest with jsdom environment for React component testing
- Testing Library (@testing-library/react, @testing-library/user-event)
- Setup file: [vitest.setup.ts](vitest.setup.ts)
- Path alias `@/*` configured in vitest.config.ts

### OCR & Ticket Scanning

- **Google Cloud Vision API** pour l'OCR initial
- **Possibilité d'API plus avancée** (payante) si besoin
- Extraction: montant du ticket et identification du marchand
- Mots-clés configurables par marchand pour reconnaissance
- Anti-fraude: limite de scans par jour
- Support offline: stockage local des images, synchronisation différée

### Merchant Configuration (Admin Only)

Chaque marchand est paramétré avec:

- **Nom** et **logo** (branding)
- **Adresse** (géolocalisation future)
- **% de crédits**: 1-20% du montant du ticket
- **Seuil trigger**: Minimum 500 XPF, déclenche la génération du bon
- **Validité crédits**: En mois, minimum 3 mois (défaut: 6 mois)
- **Code marchand**: 4 caractères alphanumériques uniques (validation manuelle)
- **Mots-clés OCR**: Pour reconnaissance automatique du marchand sur les tickets

### Credits & Vouchers System

**Transaction Flow:**

1. User scans ticket → OCR extracts merchant + amount
2. Credits calculated: `amount × (merchant.creditPercentage / 100)`
3. Credits added to user's balance for that merchant
4. If `balance >= merchant.threshold`:
   - Generate voucher (value = threshold)
   - Send push notification
   - Reset balance to 0

**Voucher Validation:**

- QR code contains encrypted hash + voucher ID
- Manual code = merchant.merchantCode (4 chars)
- Server-side validation prevents double usage
- Logs: timestamp, IP, user, merchant for fraud detection

## Common Patterns

### Protecting Routes

```typescript
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const session = await auth();
if (!session) {
  redirect("/auth/signin");
}

// For admin-only routes
if (session.user.role !== "admin") {
  redirect("/dashboard");
}
```

### API Route Structure

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... route logic
}
```

### Logout Implementation

```typescript
import { signOut } from "next-auth/react";

const handleLogout = async () => {
  await signOut({ callbackUrl: "/" }); // or "/admin/login" for admins
};
```

### Prisma Queries

```typescript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get user with their credits per merchant
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" },
  include: {
    transactions: {
      include: { merchant: true },
    },
    vouchers: {
      where: { consumed: false },
    },
  },
});
```

## Features Roadmap

### Implemented

- ✅ Admin authentication with role-based access
- ✅ Merchant creation and configuration
- ✅ Basic dashboard structure
- ✅ Logout functionality
- ✅ Vercel deployment with Prisma support

### To Implement (Priority Order)

1. **OCR Ticket Scanning** (Feature 2)
   - Camera integration PWA
   - Google Cloud Vision API integration
   - Merchant recognition via keywords
   - Amount extraction
   - Credits allocation

2. **Credits Display** (Feature 6)
   - User dashboard: Top 3 balances
   - Partners tab: List with logos/balances
   - Real-time updates after scan

3. **Automatic Voucher Generation** (Feature 3)
   - Trigger logic when threshold reached
   - QR code generation
   - Push notifications
   - Balance reset

4. **Voucher Validation** (Feature 4)
   - QR scan validation
   - Manual code input validation
   - Server-side consumption marking
   - Offline checksum for QR

5. **Credits Expiration** (Feature 5)
   - Date tracking per credit batch
   - Push notifications J-20 and J-1
   - Automatic expiration handling

6. **PWA Features**
   - Install prompt on first visit
   - Offline support for scans/vouchers
   - Service worker for background sync

7. **Monitoring & Stats**
   - Admin dashboard: global stats
   - Fraud detection logs
   - User/merchant detail views

## Environment Variables

### Required for Production (Vercel)

```bash
# NextAuth
AUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.vercel.app

# Supabase/PostgreSQL
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...

# Google Cloud Vision (when implemented)
GOOGLE_CLOUD_VISION_API_KEY=xxx
```

### Local Development (.env.local)

See [.env.local.example](.env.local.example) for complete list with descriptions.

## Deployment Notes

### Vercel Configuration

- Build command: `pnpm build` (includes `prisma generate`)
- Install command: `pnpm install` (runs `postinstall` script)
- Framework: Next.js
- Node version: 18.x or higher

### Prisma on Vercel

- Binary target `rhel-openssl-3.0.x` configured for AWS Lambda runtime
- `postinstall` script ensures Prisma Client generation
- Webpack externals prevent bundling issues
- `serverComponentsExternalPackages` includes `@prisma/client` and `@prisma/engines`

### Common Issues

**Prisma Engine Not Found:**

- Ensure `prisma generate` runs in `postinstall` script
- Check binary targets in schema.prisma
- Verify webpack config externalizes `@prisma/client`

**Authentication Failures:**

- Verify `AUTH_SECRET` is set in Vercel environment variables
- Check `NEXTAUTH_URL` matches production domain
- Ensure password hashes are bcrypt compatible

**Supabase Connection:**

- Use pooled URL (`POSTGRES_PRISMA_URL`) for API routes
- Use direct URL (`POSTGRES_URL_NON_POOLING`) for migrations
- Check IP allowlist in Supabase settings for Vercel IPs
