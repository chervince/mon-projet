# 🔧 Maintenance et Monitoring

**Guide pour maintenir un projet Next.js en production**

---

## 🎯 Objectifs

Maintenir un projet en production nécessite :

- 📊 **Monitoring** : Surveillance des performances et erreurs
- 🐛 **Debugging** : Outils pour identifier les problèmes
- 🔄 **Updates** : Mise à jour des dépendances
- 📈 **Analytics** : Comprendre l'usage
- 🚨 **Alerting** : Notifications des problèmes critiques

---

## 📊 Monitoring

### Vercel Analytics

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

**Métriques trackées** :
- Page views
- Core Web Vitals (LCP, FID, CLS)
- Routes les plus visitées
- Devices et navigateurs

### Error Tracking avec Sentry

```bash
pnpm add @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  environment: process.env.NODE_ENV,
  beforeSend(event, hint) {
    // Filtrer les erreurs non pertinentes
    if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
      return null
    }
    return event
  }
})
```

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
})
```

**Capture d'erreurs** :

```typescript
'use server'

import * as Sentry from '@sentry/nextjs'

export async function createEvent(data: EventInput) {
  try {
    return await prisma.event.create({ data })
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: 'createEvent' },
      extra: { data }
    })
    throw error
  }
}
```

### Logging structuré

```typescript
// lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'production'
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true }
        }
      })
})

// Utilisation
logger.info({ userId: '123' }, 'User logged in')
logger.error({ error, eventId: '456' }, 'Failed to create event')
```

---

## 🐛 Debugging

### React DevTools

- Installer extension Chrome/Firefox
- Inspecter composants et props
- Profiler performance

### Next.js DevTools

```bash
# Dev mode avec turbopack
pnpm dev --turbopack

# Debug mode
NODE_OPTIONS='--inspect' pnpm dev
```

### Prisma Studio

```bash
# Interface graphique pour DB
pnpm prisma studio

# Ouvre http://localhost:5555
```

### Debugging Server Actions

```typescript
'use server'

export async function debugAction() {
  console.log('Server Action called')

  // Breakpoint possible en dev
  debugger

  const data = await prisma.user.findMany()
  console.log({ userCount: data.length })

  return data
}
```

### Source Maps

```typescript
// next.config.ts
const nextConfig = {
  productionBrowserSourceMaps: true, // Pour debug production
}
```

---

## 🔄 Mise à jour des dépendances

### Check outdated

```bash
# Lister les packages outdated
pnpm outdated

# Mise à jour interactive
pnpm update -i

# Mise à jour d'un package spécifique
pnpm update next@latest
```

### Stratégie de mise à jour

**Patch versions** (1.2.3 → 1.2.4) :
- Bugfixes uniquement
- Update automatique recommandé

**Minor versions** (1.2.0 → 1.3.0) :
- Nouvelles features
- Backward compatible
- Tester avant production

**Major versions** (1.0.0 → 2.0.0) :
- Breaking changes
- Lire CHANGELOG
- Tester extensivement
- Migrer progressivement

### Automated Updates (Dependabot)

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
    open-pull-requests-limit: 10
    groups:
      development:
        patterns:
          - '@types/*'
          - 'eslint*'
          - 'prettier'
        update-types:
          - 'minor'
          - 'patch'
```

### Script de test post-update

```bash
#!/bin/bash
# test-updates.sh

echo "🧪 Testing updates..."

# Install
pnpm install

# Lint
pnpm lint:check || exit 1

# Type check
pnpm type-check || exit 1

# Tests
pnpm test || exit 1

# Build
pnpm build || exit 1

echo "✅ All checks passed!"
```

---

## 📈 Analytics & Metrics

### Custom Events

```typescript
// lib/analytics.ts
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
}

// Utilisation
trackEvent('event_created', {
  eventId: event.id,
  category: event.type
})
```

### Performance Metrics

```typescript
// lib/metrics.ts
export function reportWebVitals(metric: any) {
  switch (metric.name) {
    case 'FCP':
      console.log('First Contentful Paint:', metric.value)
      break
    case 'LCP':
      console.log('Largest Contentful Paint:', metric.value)
      break
    case 'CLS':
      console.log('Cumulative Layout Shift:', metric.value)
      break
    case 'FID':
      console.log('First Input Delay:', metric.value)
      break
    case 'TTFB':
      console.log('Time to First Byte:', metric.value)
      break
  }

  // Envoyer à service analytics
  if (metric.value > THRESHOLD) {
    trackEvent('poor_performance', {
      metric: metric.name,
      value: metric.value
    })
  }
}
```

```tsx
// app/layout.tsx
export { reportWebVitals } from '@/lib/metrics'
```

---

## 🚨 Alerting

### Vercel Notifications

Configurer dans :
1. **Vercel Dashboard** → Project → Settings → Notifications
2. Activer :
   - Deployment Failed
   - Domain Configuration Changed
   - Performance Degradation

### Sentry Alerts

1. **Sentry Dashboard** → Alerts
2. Créer règles :
   - Error rate > 1% → Slack
   - New error type → Email
   - Performance degradation → PagerDuty

### Custom Health Check

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`

    // Check external APIs
    const apiStatus = await fetch('https://api.example.com/health')

    if (!apiStatus.ok) {
      throw new Error('External API down')
    }

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok',
        externalApi: 'ok'
      }
    })
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        error: error.message
      },
      { status: 503 }
    )
  }
}
```

### Uptime Monitoring

Services recommandés :
- **UptimeRobot** : Gratuit, basique
- **Better Uptime** : Payant, avancé
- **Pingdom** : Monitoring global

Configuration :
1. Monitor URL : `https://monsite.com/api/health`
2. Interval : 5 minutes
3. Alert : Email + Slack si down

---

## 🔍 Troubleshooting

### Build Failures

```bash
# Nettoyer cache
rm -rf .next node_modules
pnpm install
pnpm build

# Vérifier Vercel logs
vercel logs
```

### Database Issues

```bash
# Reset DB (DEV ONLY)
pnpm prisma migrate reset

# Regenerate client
pnpm prisma generate

# Check migrations status
pnpm prisma migrate status
```

### Performance Issues

```bash
# Analyser bundle
ANALYZE=true pnpm build

# Lighthouse audit
pnpm dlx lighthouse https://monsite.com --view

# Check database slow queries
# Via Supabase Dashboard → Database → Query Performance
```

---

## 📅 Routine de maintenance

### Hebdomadaire

- [ ] Vérifier Vercel Analytics
- [ ] Review Sentry errors
- [ ] Check uptime status
- [ ] Répondre aux Dependabot PRs

### Mensuel

- [ ] Audit de sécurité (`pnpm audit`)
- [ ] Mise à jour dépendances
- [ ] Review performance metrics
- [ ] Nettoyer logs anciens
- [ ] Backup database

### Trimestriel

- [ ] Major dependencies updates
- [ ] Security scan complet
- [ ] Performance audit Lighthouse
- [ ] Review de l'architecture
- [ ] Documentation update

---

## 📚 Documentation de production

### Runbook

Créer `RUNBOOK.md` :

```markdown
# Production Runbook

## Emergency Contacts

- Tech Lead: @username
- DevOps: @username
- On-call: rotation

## Common Issues

### Site Down

1. Check Vercel status
2. Check database connection
3. Review recent deployments
4. Rollback if necessary

### Slow Performance

1. Check Vercel Analytics
2. Review database slow queries
3. Check external API status
4. Enable caching if needed

### Database Issues

1. Check Supabase dashboard
2. Verify connection string
3. Check migrations status
4. Contact support if needed
```

---

## ✅ Checklist Maintenance

### Setup initial

- [ ] Vercel Analytics activé
- [ ] Sentry configuré
- [ ] Logging structuré en place
- [ ] Health check endpoint créé
- [ ] Uptime monitoring configuré
- [ ] Alertes configurées

### Mensuel

- [ ] Review errors Sentry
- [ ] Check dépendances outdated
- [ ] Performance audit
- [ ] Security audit
- [ ] Backup vérifié

---

**Un monitoring proactif évite les incidents**
