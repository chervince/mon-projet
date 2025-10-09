# 💡 Recommandations et Bonnes Pratiques

**Best practices pour optimiser votre projet Next.js**

---

## 🎯 Vue d'ensemble

Ces recommandations sont **fortement conseillées** mais pas strictement obligatoires. Elles améliorent :

- ⚡ **Performance** : Vitesse de chargement et réactivité
- 🔍 **SEO** : Référencement naturel
- ♿ **Accessibilité** : Expérience pour tous les utilisateurs
- 🎨 **UX** : Expérience utilisateur
- 📈 **Scalabilité** : Capacité à grandir

---

## ⚡ Performance

### 1. Images optimisées

**Toujours utiliser `next/image`** :

```tsx
import Image from 'next/image'

// ✅ BON
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority // Pour images above the fold
  placeholder="blur"
  blurDataURL="data:image/..."
/>

// ❌ ÉVITER
<img src="/hero.jpg" alt="Hero" />
```

**Formats modernes** :
- WebP pour compatibilité large
- AVIF pour meilleure compression
- Configuration automatique dans `next.config.ts`

### 2. Code Splitting

```tsx
import dynamic from 'next/dynamic'

// Charger composant lourd uniquement quand nécessaire
const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  ssr: false,
  loading: () => <Skeleton />
})

// Utiliser seulement si besoin
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart />
    </div>
  )
}
```

### 3. Fonts optimisées

```tsx
// app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### 4. Lazy Loading

```tsx
'use client'
import { Suspense } from 'react'

function GalleryPage() {
  return (
    <Suspense fallback={<GallerySkeleton />}>
      <HeavyGallery />
    </Suspense>
  )
}
```

### 5. Bundle Analysis

```bash
# Installer
pnpm add -D @next/bundle-analyzer

# Analyser
ANALYZE=true pnpm build
```

---

## 🔍 SEO

### 1. Metadata

```tsx
// app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accueil - Mon Projet',
  description: 'Description SEO-friendly de 150-160 caractères',
  keywords: ['next.js', 'react', 'typescript'],
  authors: [{ name: 'Votre Nom' }],
  openGraph: {
    title: 'Accueil - Mon Projet',
    description: 'Description pour réseaux sociaux',
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accueil - Mon Projet',
    description: 'Description pour Twitter',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

### 2. Sitemap

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await prisma.event.findMany()

  const eventUrls = events.map(event => ({
    url: `https://monsite.com/events/${event.id}`,
    lastModified: event.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://monsite.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://monsite.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...eventUrls,
  ]
}
```

### 3. Structured Data

```tsx
// components/event-schema.tsx
export function EventSchema({ event }: { event: Event }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.date.toISOString(),
    location: {
      '@type': 'Place',
      name: event.location,
    },
    image: event.image,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

---

## ♿ Accessibilité

### 1. Sémantique HTML

```tsx
// ✅ BON
<nav>
  <ul>
    <li><a href="/about">À propos</a></li>
  </ul>
</nav>

<main>
  <h1>Titre principal</h1>
  <article>
    <h2>Sous-titre</h2>
    <p>Contenu...</p>
  </article>
</main>

// ❌ ÉVITER
<div>
  <div><a href="/about">À propos</a></div>
</div>
```

### 2. ARIA Labels

```tsx
<button aria-label="Fermer le modal">
  <X />
</button>

<nav aria-label="Navigation principale">
  {/* ... */}
</nav>

<img src="/logo.png" alt="Logo de l'entreprise" />
```

### 3. Navigation clavier

```tsx
function Modal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
      tabIndex={-1}
    >
      {/* Contenu */}
    </div>
  )
}
```

### 4. Contraste

```css
/* Ratio minimum 4.5:1 pour texte normal */
/* Ratio minimum 3:1 pour texte large (>18px) */

:root {
  --color-text: #1a1a1a; /* Sur fond blanc : ratio 12.6:1 ✅ */
  --color-text-light: #666; /* Sur fond blanc : ratio 5.7:1 ✅ */
}
```

---

## 🎨 UX / UI

### 1. Loading States

```tsx
'use client'
import { useState } from 'react'

function Form() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      await submitForm()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={isLoading}>
        {isLoading ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  )
}
```

### 2. Error States

```tsx
'use client'
import { useState } from 'react'

function DataFetcher() {
  const [error, setError] = useState<string | null>(null)

  if (error) {
    return (
      <div className="error">
        <p>Une erreur est survenue : {error}</p>
        <button onClick={() => setError(null)}>Réessayer</button>
      </div>
    )
  }

  return <div>Contenu...</div>
}
```

### 3. Feedback utilisateur

```tsx
'use client'
import { toast } from 'sonner' // ou react-hot-toast

async function handleAction() {
  try {
    await doSomething()
    toast.success('Action réussie !')
  } catch (error) {
    toast.error('Échec de l\'action')
  }
}
```

### 4. Optimistic Updates

```tsx
'use client'
import { useOptimistic } from 'react'

function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  )

  async function addTodo(formData: FormData) {
    const newTodo = { id: crypto.randomUUID(), title: formData.get('title') }

    // Mise à jour optimiste immédiate
    addOptimisticTodo(newTodo)

    // Puis appel serveur
    await createTodo(formData)
  }

  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

---

## 📈 Scalabilité

### 1. Pagination

```tsx
// app/events/page.tsx
export default async function EventsPage({
  searchParams
}: {
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page ?? '1')
  const perPage = 20

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { date: 'desc' }
    }),
    prisma.event.count()
  ])

  return (
    <div>
      <EventList events={events} />
      <Pagination page={page} total={total} perPage={perPage} />
    </div>
  )
}
```

### 2. Caching stratégique

```tsx
// Revalidate toutes les heures
export const revalidate = 3600

// Ou revalidation on-demand
import { revalidatePath, revalidateTag } from 'next/cache'

export async function createEvent(data: EventInput) {
  await prisma.event.create({ data })
  revalidatePath('/events')
  revalidateTag('events')
}
```

### 3. Edge Runtime

```tsx
// app/api/hello/route.ts
export const runtime = 'edge'

export async function GET() {
  return Response.json({ message: 'Hello from Edge!' })
}
```

### 4. Database Indexing

```prisma
model Event {
  id        String   @id @default(cuid())
  title     String
  date      DateTime
  status    String

  @@index([date]) // Index pour tri par date
  @@index([status, date]) // Index composite
}
```

---

## 🛡️ Sécurité supplémentaire

### 1. Rate Limiting

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier)
  return success
}
```

### 2. Input Sanitization

```typescript
import DOMPurify from 'isomorphic-dompurify'

function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href']
  })
}
```

### 3. CSRF Protection

```tsx
// Automatique avec Server Actions
'use server'

export async function sensitiveAction(formData: FormData) {
  // Next.js vérifie automatiquement le CSRF token
  // ...
}
```

---

## 🎯 Core Web Vitals

### Objectifs recommandés

- **LCP** (Largest Contentful Paint) : < 2.5s
- **FID** (First Input Delay) : < 100ms
- **CLS** (Cumulative Layout Shift) : < 0.1
- **INP** (Interaction to Next Paint) : < 200ms

### Monitoring

```tsx
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
```

---

## ✅ Checklist Recommandations

### Performance
- [ ] Images via `next/image`
- [ ] Fonts via `next/font`
- [ ] Code splitting stratégique
- [ ] Bundle < 200KB (initial)
- [ ] Core Web Vitals > seuils

### SEO
- [ ] Metadata sur toutes les pages
- [ ] Sitemap.xml généré
- [ ] Structured data (JSON-LD)
- [ ] robots.txt configuré
- [ ] URLs SEO-friendly

### Accessibilité
- [ ] HTML sémantique
- [ ] ARIA labels appropriés
- [ ] Navigation clavier
- [ ] Contraste suffisant (WCAG AA)
- [ ] Tests avec screen reader

### UX
- [ ] Loading states
- [ ] Error states
- [ ] Feedback utilisateur
- [ ] Optimistic updates
- [ ] Transitions fluides

### Scalabilité
- [ ] Pagination
- [ ] Caching optimisé
- [ ] Database indexing
- [ ] Edge runtime si pertinent

---

**Ces recommandations transforment un projet fonctionnel en projet de qualité production.**
