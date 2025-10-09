# 🏗️ Architecture du Projet

**Principes d'architecture pour projets Next.js modernes**

---

## 🎯 Vue d'ensemble

L'architecture repose sur les principes suivants :

- **App Router** (Next.js 15+) avec React Server Components
- **Type Safety** totale avec TypeScript strict
- **Separation of Concerns** : logique métier séparée de la présentation
- **Performance-first** : optimisations natives
- **Scalabilité** : structure modulaire extensible

---

## 📊 Architecture en couches

```
┌─────────────────────────────────────┐
│         Client (Browser)            │
│  React Components + Client State    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Next.js App Router (src/app)    │
│   Server Components + Layouts       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Business Logic (src/lib)        │
│   Services + Utils + Helpers        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Data Layer (Prisma + Database)   │
│   ORM + Queries + Migrations        │
└─────────────────────────────────────┘
```

---

## 📂 Structure des fichiers

Voir [structure-projet.md](structure-projet.md) pour la structure détaillée.

---

## 🎨 Patterns d'architecture

### 1. React Server Components (RSC)

**Par défaut, tous les composants sont Server Components**

```tsx
// src/app/page.tsx (Server Component)
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  // Fetch data directement côté serveur
  const events = await prisma.event.findMany()

  return <EventList events={events} />
}
```

**Utiliser "use client" uniquement quand nécessaire** :

```tsx
// src/components/ui/button.tsx (Client Component)
'use client'

import { useState } from 'react'

export function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### 2. Server Actions

```tsx
// src/app/events/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createEvent(formData: FormData) {
  const title = formData.get('title') as string

  await prisma.event.create({
    data: { title, /* ... */ }
  })

  revalidatePath('/events')
}
```

### 3. Layouts et Templates

```tsx
// src/app/layout.tsx (Root Layout)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

### 4. Route Groups

```
src/app/
├── (marketing)/          # Groupe sans segment d'URL
│   ├── layout.tsx       # Layout spécifique marketing
│   ├── page.tsx         # /
│   └── about/page.tsx   # /about
├── (dashboard)/
│   ├── layout.tsx       # Layout dashboard
│   ├── dashboard/page.tsx # /dashboard
│   └── profile/page.tsx   # /profile
└── api/
    └── [...]/route.ts
```

### 5. Parallel Routes & Intercepting Routes

```
src/app/
├── @modal/                # Parallel route
│   └── (.)photo/[id]/
│       └── page.tsx
└── photo/[id]/
    └── page.tsx
```

---

## 🔄 Data Flow

### Fetching de données

```tsx
// 1. Server Component avec fetch natif (avec cache)
async function getEvents() {
  const res = await fetch('https://api.example.com/events', {
    next: { revalidate: 3600 } // Cache 1h
  })
  return res.json()
}

// 2. Prisma direct
async function getEvents() {
  return await prisma.event.findMany()
}

// 3. Client avec TanStack Query
'use client'
import { useQuery } from '@tanstack/react-query'

function Events() {
  const { data } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetch('/api/events').then(r => r.json())
  })
}
```

### Mutations

```tsx
// Server Action (recommandé)
'use server'
export async function createEvent(data: EventInput) {
  return await prisma.event.create({ data })
}

// Ou API Route
// src/app/api/events/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  const event = await prisma.event.create({ data: body })
  return Response.json(event)
}
```

---

## 🎭 State Management

### 1. Server State : TanStack Query

```tsx
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function Events() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents
  })

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}
```

### 2. Client State : Zustand

```tsx
// src/store/ui-store.ts
import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }))
}))
```

### 3. Form State : React Hook Form + Zod

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const eventSchema = z.object({
  title: z.string().min(3).max(100),
  date: z.date()
})

type EventInput = z.infer<typeof eventSchema>

function EventForm() {
  const { register, handleSubmit } = useForm<EventInput>({
    resolver: zodResolver(eventSchema)
  })

  const onSubmit = async (data: EventInput) => {
    await createEvent(data)
  }

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}
```

---

## 🔐 Authentification

### NextAuth.js v5 (Auth.js)

```tsx
// src/lib/auth.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Credentials, Google, GitHub, etc.
  ]
})
```

```tsx
// src/app/api/auth/[...nextauth]/route.ts
export { handlers as GET, handlers as POST }
```

```tsx
// Middleware pour protéger les routes
// src/middleware.ts
export { auth as middleware } from '@/lib/auth'

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}
```

---

## 🎨 Styling

### CSS Modules (Recommandé)

```tsx
// src/components/card.module.css
.card {
  padding: 1rem;
  border-radius: 8px;
  background: white;
}

// src/components/card.tsx
import styles from './card.module.css'

export function Card() {
  return <div className={styles.card}>...</div>
}
```

### Design System global

```css
/* src/app/globals.css */
:root {
  --color-primary: #d4af37;
  --color-secondary: #2c2c2c;
  --spacing-unit: 8px;
}
```

---

## 📦 Code Splitting

### Dynamic Imports

```tsx
import dynamic from 'next/dynamic'

// Charger uniquement côté client
const HeavyComponent = dynamic(() => import('./heavy-component'), {
  ssr: false,
  loading: () => <Spinner />
})
```

### Route-based Splitting

Automatique avec App Router - chaque `page.tsx` est un chunk séparé.

---

## 🚀 Performance

### Images

```tsx
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority // Pour LCP
  placeholder="blur"
/>
```

### Fonts

```tsx
// src/app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return <html className={inter.className}>...</html>
}
```

### Metadata

```tsx
// src/app/page.tsx
export const metadata = {
  title: 'Accueil',
  description: 'Description SEO',
  openGraph: {
    title: 'Accueil',
    description: 'Description OG',
    images: ['/og-image.jpg']
  }
}
```

---

## 📚 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [React Server Components](https://react.dev/reference/react/use-server)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook)

---

**Prochaine étape** : [structure-projet.md](structure-projet.md)
