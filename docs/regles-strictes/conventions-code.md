# 📝 Conventions de Code

**Standards de code obligatoires pour tout le projet**

---

## 🎯 TypeScript Strict Mode

### Configuration obligatoire

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Règles TypeScript

#### ✅ FAIRE

```typescript
// Types explicites pour les exports publics
export function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } })
}

// Interfaces pour les objets
interface UserProfile {
  name: string
  email: string
  role: UserRole
}

// Type guards
function isAdmin(user: User): user is Admin {
  return user.role === 'ADMIN'
}

// Utility types
type PartialUser = Partial<User>
type ReadonlyUser = Readonly<User>
```

#### ❌ ÉVITER

```typescript
// ❌ any sans justification
function getData(): any {
  return fetch('/api/data')
}

// ❌ Types implicites pour exports
export function getUser(id) {
  return prisma.user.findUnique({ where: { id } })
}

// ❌ Ignorer les erreurs TypeScript
// @ts-ignore
const user = getUserById()
```

---

## 📛 Conventions de nommage

### Fichiers

```
kebab-case pour tous les fichiers

✅ user-profile.tsx
✅ create-event-form.tsx
✅ use-auth.ts
✅ auth-service.ts

❌ UserProfile.tsx
❌ createEventForm.tsx
❌ useAuth.ts
```

### Composants React

```typescript
// PascalCase
export function UserProfile() {}
export function CreateEventForm() {}
```

### Fonctions

```typescript
// camelCase
function getUserById() {}
function createEvent() {}
async function fetchUserData() {}
```

### Variables et constantes

```typescript
// camelCase pour variables
const userId = '123'
let isLoading = false

// UPPER_SNAKE_CASE pour constantes globales
const MAX_FILE_SIZE = 5_000_000
const API_BASE_URL = 'https://api.example.com'
```

### Types et Interfaces

```typescript
// PascalCase
interface UserProfile {}
type EventStatus = 'draft' | 'published'
enum UserRole { USER, ADMIN }
```

### Dossiers

```
kebab-case

src/components/user-profile/
src/lib/auth-service/
src/app/admin-dashboard/
```

---

## 🎨 Styling

### CSS Modules (Recommandé)

```tsx
// button.module.css
.button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.buttonPrimary {
  background: var(--color-primary);
  color: white;
}

// button.tsx
import styles from './button.module.css'
import { cn } from '@/lib/utils'

export function Button({ variant = 'primary' }) {
  return (
    <button className={cn(
      styles.button,
      variant === 'primary' && styles.buttonPrimary
    )}>
      Click me
    </button>
  )
}
```

### Variables CSS

```css
/* globals.css */
:root {
  /* Colors */
  --color-primary: #d4af37;
  --color-secondary: #2c2c2c;
  --color-background: #ffffff;
  --color-text: #1a1a1a;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

---

## 📦 Imports

### Ordre des imports

```typescript
// 1. React et Next.js
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// 2. Librairies tierces
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'

// 3. Imports absolus internes (@/)
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils'

// 4. Imports relatifs
import { UserCard } from './user-card'
import styles from './page.module.css'

// 5. Types
import type { User } from '@prisma/client'
import type { PageProps } from '@/types'
```

### Alias TypeScript

```typescript
// ✅ Utiliser les alias
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

// ❌ Éviter les imports relatifs profonds
import { Button } from '../../../components/ui/button'
```

---

## 🔧 Fonctions

### Server Actions

```typescript
// actions/events.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Schema de validation
const createEventSchema = z.object({
  title: z.string().min(3).max(100),
  date: z.date(),
})

export async function createEvent(
  formData: FormData
): Promise<{ success: boolean; error?: string; event?: Event }> {
  try {
    // Validation
    const data = createEventSchema.parse({
      title: formData.get('title'),
      date: new Date(formData.get('date') as string),
    })

    // Logique métier
    const event = await prisma.event.create({ data })

    // Revalidation cache
    revalidatePath('/events')

    return { success: true, event }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input' }
    }
    console.error('Error creating event:', error)
    return { success: false, error: 'Server error' }
  }
}
```

### Composants React

```tsx
// user-card.tsx
import type { User } from '@prisma/client'
import styles from './user-card.module.css'

interface UserCardProps {
  user: User
  showEmail?: boolean
  onEdit?: (user: User) => void
}

export function UserCard({ user, showEmail = false, onEdit }: UserCardProps) {
  return (
    <div className={styles.card}>
      <h3>{user.name}</h3>
      {showEmail && <p>{user.email}</p>}
      {onEdit && <button onClick={() => onEdit(user)}>Edit</button>}
    </div>
  )
}
```

---

## 🎯 Best Practices

### 1. DRY (Don't Repeat Yourself)

```typescript
// ❌ Répétition
const isAdmin = user.role === 'ADMIN'
const isSuperAdmin = user.role === 'ADMIN' && user.permissions.includes('*')

// ✅ Utiliser des fonctions
function hasRole(user: User, role: UserRole): boolean {
  return user.role === role
}

function hasPermission(user: User, permission: string): boolean {
  return user.permissions.includes(permission)
}
```

### 2. Single Responsibility

```typescript
// ❌ Fonction qui fait trop
async function createUserAndSendEmail(data: UserData) {
  const user = await prisma.user.create({ data })
  await sendEmail(user.email, 'Welcome!')
  await logActivity('user_created', user.id)
  return user
}

// ✅ Séparer les responsabilités
async function createUser(data: UserData): Promise<User> {
  return await prisma.user.create({ data })
}

async function sendWelcomeEmail(user: User): Promise<void> {
  await sendEmail(user.email, 'Welcome!')
}

async function logUserCreation(userId: string): Promise<void> {
  await logActivity('user_created', userId)
}
```

### 3. Early Returns

```typescript
// ❌ Nesting profond
function canEditEvent(user: User, event: Event): boolean {
  if (user) {
    if (user.role === 'ADMIN') {
      return true
    } else {
      if (event.createdBy === user.id) {
        return true
      }
    }
  }
  return false
}

// ✅ Early returns
function canEditEvent(user: User | null, event: Event): boolean {
  if (!user) return false
  if (user.role === 'ADMIN') return true
  if (event.createdBy === user.id) return true
  return false
}
```

### 4. Async/Await plutôt que Promises

```typescript
// ❌ Promise chains
function getUser(id: string) {
  return prisma.user.findUnique({ where: { id } })
    .then(user => {
      return prisma.event.findMany({ where: { createdBy: user.id } })
    })
    .then(events => {
      return { user, events }
    })
}

// ✅ async/await
async function getUserWithEvents(id: string) {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return null

  const events = await prisma.event.findMany({
    where: { createdBy: user.id }
  })

  return { user, events }
}
```

---

## 📊 Documentation du code

### JSDoc pour fonctions publiques

```typescript
/**
 * Récupère un utilisateur par son ID
 *
 * @param id - L'ID de l'utilisateur
 * @returns L'utilisateur ou null si non trouvé
 * @throws {Error} Si l'ID est invalide
 */
export async function getUserById(id: string): Promise<User | null> {
  if (!id) throw new Error('Invalid user ID')
  return await prisma.user.findUnique({ where: { id } })
}
```

### Commentaires explicatifs

```typescript
// ✅ Bon commentaire (explique le "pourquoi")
// On utilise Promise.all pour paralléliser les requêtes
// car elles sont indépendantes
const [users, events] = await Promise.all([
  prisma.user.findMany(),
  prisma.event.findMany()
])

// ❌ Mauvais commentaire (répète le code)
// Récupère les utilisateurs
const users = await prisma.user.findMany()
```

---

## ✅ Checklist

Avant de commit :

- [ ] Code TypeScript strict (0 erreur)
- [ ] Nommage conforme (kebab-case fichiers, PascalCase composants)
- [ ] Imports organisés par catégorie
- [ ] Fonctions documentées (JSDoc si publique)
- [ ] Pas de code dupliqué
- [ ] Early returns utilisés
- [ ] async/await plutôt que promises
- [ ] CSS Modules pour styles
- [ ] `pnpm lint` passe
- [ ] `pnpm format` appliqué

---

**Ces conventions garantissent un code maintenable et cohérent.**
