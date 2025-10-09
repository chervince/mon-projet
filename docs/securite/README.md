# 🔐 Sécurité

**Best practices de sécurité pour Next.js**

---

## 🎯 Principes fondamentaux

1. **Defense in Depth** : Multiples couches de sécurité
2. **Least Privilege** : Accès minimum nécessaire
3. **Fail Secure** : En cas d'erreur, rester sécurisé
4. **Never Trust User Input** : Toujours valider

---

## 🛡️ Headers de sécurité

### Configuration Next.js

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // XSS Protection
          {
            key: 'X-Frame-Options',
            value: 'DENY' // Empêche le clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff' // Empêche MIME sniffing
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },

          // HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },

          // CSP (Content Security Policy)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://res.cloudinary.com",
              "font-src 'self'",
              "connect-src 'self' https://*.supabase.co",
              "frame-ancestors 'none'",
            ].join('; ')
          },

          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },

          // Referrer
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

### Vérification

Tester sur : https://securityheaders.com

---

## 🔒 Authentification

### NextAuth.js Configuration

```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { compare } from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Validation
        const validated = loginSchema.safeParse(credentials)
        if (!validated.success) return null

        const { email, password } = validated.data

        // Récupérer user
        const user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user || !user.password) return null

        // Vérifier password
        const isValid = await compare(password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
      }
      return session
    }
  }
})
```

### Protection des routes

```typescript
// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Routes publiques
  const publicRoutes = ['/login', '/register', '/']
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Routes admin
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (req.auth?.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // Routes authentifiées
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

---

## ✅ Validation des données

### Zod Schemas

```typescript
// lib/validation.ts
import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Au moins 1 majuscule')
    .regex(/[a-z]/, 'Au moins 1 minuscule')
    .regex(/[0-9]/, 'Au moins 1 chiffre')
    .regex(/[^A-Za-z0-9]/, 'Au moins 1 caractère spécial'),
  name: z.string().min(2).max(100),
})

export const eventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  date: z.date().min(new Date(), 'Date dans le futur'),
  location: z.string().min(3).max(200),
  capacity: z.number().positive().max(10000),
  price: z.number().nonnegative().optional(),
})

// Validation côté serveur OBLIGATOIRE
export function validateEvent(data: unknown) {
  return eventSchema.parse(data)
}
```

### Server Actions

```typescript
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import DOMPurify from 'isomorphic-dompurify'

const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10),
})

export async function createPost(formData: FormData) {
  // 1. Vérifier auth
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    // 2. Valider données
    const data = createPostSchema.parse({
      title: formData.get('title'),
      content: formData.get('content'),
    })

    // 3. Sanitizer le HTML
    const sanitizedContent = DOMPurify.sanitize(data.content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
      ALLOWED_ATTR: ['href']
    })

    // 4. Créer en DB
    const post = await prisma.post.create({
      data: {
        ...data,
        content: sanitizedContent,
        authorId: session.user.id
      }
    })

    return { success: true, post }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Données invalides' }
    }
    console.error('Error creating post:', error)
    return { success: false, error: 'Erreur serveur' }
  }
}
```

---

## 🔐 Secrets Management

### Variables d'environnement

```bash
# .env.local (JAMAIS commit)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..." # openssl rand -base64 32
API_KEY="sk_live_..."

# .env.example (commit)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NEXTAUTH_SECRET="your-secret-here"
API_KEY="your-api-key"
```

### Types pour env vars

```typescript
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    NEXTAUTH_SECRET: string
    NEXTAUTH_URL: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
  }
}

// Validation au startup
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
})

envSchema.parse(process.env)
```

---

## 🛡️ Protection CSRF

NextAuth gère automatiquement CSRF avec :
- Token CSRF dans session
- Validation automatique

Pour API Routes custom :

```typescript
// lib/csrf.ts
import { createHash } from 'crypto'

export function generateCSRFToken(session: Session): string {
  return createHash('sha256')
    .update(`${session.user.id}-${Date.now()}`)
    .digest('hex')
}

export function validateCSRFToken(token: string, session: Session): boolean {
  // Implémenter validation
  return true
}
```

---

## 🚫 Rate Limiting

### Avec Upstash

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
})

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier)

  if (!success) {
    throw new Error('Rate limit exceeded')
  }

  return { limit, reset, remaining }
}
```

### Utilisation dans API Route

```typescript
// app/api/login/route.ts
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'

  try {
    await checkRateLimit(ip)
  } catch (error) {
    return Response.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  // Continuer login...
}
```

---

## 🔒 SQL Injection Prevention

### Prisma (Safe by default)

```typescript
// ✅ SAFE - Prisma parameterized queries
const user = await prisma.user.findUnique({
  where: { email: userInput }
})

// ❌ DANGER - Raw SQL
const user = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userInput}
` // Vulnérable si mal utilisé
```

### Si raw SQL nécessaire

```typescript
import { Prisma } from '@prisma/client'

// ✅ Utiliser parameterized queries
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE role = ${Prisma.sql`${role}`}
`
```

---

## 📝 Audit Log

```typescript
// lib/audit.ts
export async function logAction(
  userId: string,
  action: string,
  resource: string,
  metadata?: Record<string, any>
) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      resource,
      metadata,
      ip: metadata?.ip,
      userAgent: metadata?.userAgent,
      timestamp: new Date()
    }
  })
}

// Utilisation
await logAction(user.id, 'DELETE', 'Event', {
  eventId: event.id,
  ip: req.ip
})
```

---

## ✅ Checklist Sécurité

### Configuration

- [ ] Headers de sécurité configurés
- [ ] HTTPS forcé (HSTS)
- [ ] CSP restrictif
- [ ] Secrets jamais en dur
- [ ] Variables env validées

### Authentification

- [ ] Passwords hashés (bcrypt/argon2)
- [ ] Session sécurisée (httpOnly cookies)
- [ ] Protection CSRF
- [ ] Rate limiting login

### Validation

- [ ] Validation Zod côté serveur
- [ ] Sanitization HTML (DOMPurify)
- [ ] Parameterized queries (Prisma)
- [ ] Validation fichiers upload

### Autorisation

- [ ] Middleware de protection routes
- [ ] Vérification permissions Server Actions
- [ ] Principe du moindre privilège

### Monitoring

- [ ] Audit logs
- [ ] Alertes security events
- [ ] Scan dépendances (pnpm audit)

---

**La sécurité n'est pas optionnelle**
