# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a loyalty points management system for small businesses built with Next.js 15, NextAuth.js 5 (beta), Prisma, and PostgreSQL. Users scan QR codes at establishments, upload receipt photos, and earn loyalty points based on purchase amounts.

## Architecture

### Authentication & Authorization

- **NextAuth.js 5 (beta)** with JWT sessions and credentials provider
- Auth configuration in [src/lib/auth.ts](src/lib/auth.ts)
- Custom type extensions in [src/types/next-auth.d.ts](src/types/next-auth.d.ts)
- Protected routes use `auth()` function from auth.ts
- User sessions include custom `id` field in JWT token

### Database Layer

- **Prisma ORM** with PostgreSQL
- Schema: [prisma/schema.prisma](prisma/schema.prisma)
- Models: User, Account, Session, Establishment, Transaction
- Connection uses environment variables: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_DATABASE`
- **IMPORTANT**: Run `prisma generate` before building to generate Prisma Client

### App Structure

- Next.js 15 App Router with Turbopack
- Pages in [src/app/](src/app/):
  - `/` - Landing page with QR scan or auth options
  - `/auth/signin` & `/auth/signup` - Authentication pages
  - `/dashboard` - User dashboard (protected)
  - `/admin` - Admin panel (protected)
  - `/scan-qr` - QR code scanner for establishments
  - `/scan` - Receipt scanning for points
- API routes in [src/app/api/](src/app/api/):
  - `/api/auth/[...nextauth]` - NextAuth handlers
  - `/api/auth/signup` - User registration
  - `/api/admin/establishments` - CRUD for establishments

### Path Aliases

- `@/*` maps to `src/*` (configured in tsconfig.json)

## Development Commands

### Essential Commands

```bash
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production (runs prisma generate first)
npm start                # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking without emit
```

### Testing

```bash
npm test                 # Run Vitest tests in watch mode
npm run test:ui          # Run tests with Vitest UI
npm run test:coverage    # Generate coverage report (thresholds: 80% lines/functions/statements, 75% branches)
vitest run <file>        # Run specific test file
```

### Database

```bash
npx prisma generate      # Generate Prisma Client (required after schema changes)
npx prisma migrate dev   # Create and apply migrations
npx prisma studio        # Open Prisma Studio GUI
npx prisma db push       # Push schema to database without migrations
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
- Custom callbacks extend JWT and session with user.id
- PrismaAdapter configured but JWT strategy takes precedence

### Prisma Client Usage

- Each API route instantiates PrismaClient (consider singleton pattern for production)
- Always run `prisma generate` after schema changes or in CI/CD
- Schema uses custom field mapping (e.g., `@map("created_at")`)

### Testing Setup

- Vitest with jsdom environment for React component testing
- Testing Library (@testing-library/react, @testing-library/user-event)
- Setup file: [vitest.setup.ts](vitest.setup.ts)
- Path alias `@/*` configured in vitest.config.ts

### Points System

- Establishments have configurable `pointsPerEuro` rate (default: 1.0)
- Transactions track amount, pointsEarned, and optional ticketImage
- User.pointsTotal aggregates all earned points

## Common Patterns

### Protecting Routes

```typescript
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const session = await auth();
if (!session) {
  redirect("/auth/signin");
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

### Prisma Queries

```typescript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const user = await prisma.user.findUnique({
  where: { email: "user@example.com" },
  include: { transactions: true },
});
```
