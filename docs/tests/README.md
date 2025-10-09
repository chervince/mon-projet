# 🧪 Stratégie de Tests

**Guide complet pour tester un projet Next.js**

---

## 🎯 Philosophie des tests

### Pyramide de tests

```
        /\
       /E2E\        ← Peu de tests, haute valeur
      /------\
     /Intégra.\     ← Tests de flows complets
    /----------\
   /  Unitaires \   ← Nombreux tests, rapides
  /--------------\
```

**Répartition recommandée** :
- **70%** Tests unitaires (fonctions, hooks, utils)
- **20%** Tests d'intégration (API, composants + data)
- **10%** Tests E2E (parcours utilisateur critiques)

---

## 🛠️ Stack de tests

### Outils recommandés

| Type | Outil | Description |
|------|-------|-------------|
| **Test Runner** | Vitest | Rapide, compatible ESM |
| **Testing Library** | React Testing Library | Tests orientés utilisateur |
| **E2E** | Playwright | Tests end-to-end multi-navigateurs |
| **Mocking** | MSW | Mock API REST/GraphQL |
| **Coverage** | Vitest Coverage | Rapport de couverture |

### Installation

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
pnpm add -D @playwright/test @vitejs/plugin-react
pnpm add -D msw
```

---

## 📝 Configuration

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '.next/',
        '**/*.config.*',
        '**/types/**'
      ],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### vitest.setup.ts

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup après chaque test
afterEach(() => {
  cleanup()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn()
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}))
```

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## 🔬 Tests Unitaires

### Tester une fonction utilitaire

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { cn, formatDate, slugify } from './utils'

describe('cn (classnames utility)', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })
})

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15')
    expect(formatDate(date)).toBe('15 janvier 2024')
  })
})

describe('slugify', () => {
  it('should convert string to slug', () => {
    expect(slugify('Hello World!')).toBe('hello-world')
  })

  it('should handle accents', () => {
    expect(slugify('Café Français')).toBe('cafe-francais')
  })
})
```

### Tester un hook custom

```typescript
// src/hooks/use-debounce.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useDebounce } from './use-debounce'

describe('useDebounce', () => {
  it('should debounce value', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 500 })

    // Valeur pas encore mise à jour
    expect(result.current).toBe('initial')

    // Après le délai
    await waitFor(() => {
      expect(result.current).toBe('updated')
    }, { timeout: 600 })
  })
})
```

### Tester un composant

```typescript
// src/components/ui/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('should render button text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when loading', () => {
    render(<Button loading>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should render different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('button-primary')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('button-secondary')
  })
})
```

---

## 🔗 Tests d'Intégration

### Tester un Server Action

```typescript
// src/actions/events.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createEvent } from './events'
import { prisma } from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    event: {
      create: vi.fn()
    }
  }
}))

describe('createEvent server action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create event with valid data', async () => {
    const mockEvent = {
      id: '1',
      title: 'Test Event',
      date: new Date(),
      description: 'Test description'
    }

    vi.mocked(prisma.event.create).mockResolvedValue(mockEvent)

    const formData = new FormData()
    formData.append('title', 'Test Event')
    formData.append('date', new Date().toISOString())

    const result = await createEvent(formData)

    expect(result.success).toBe(true)
    expect(result.event).toEqual(mockEvent)
    expect(prisma.event.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: 'Test Event'
      })
    })
  })

  it('should return error with invalid data', async () => {
    const formData = new FormData()
    formData.append('title', 'ab') // Trop court

    const result = await createEvent(formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid input')
  })
})
```

### Tester une API Route

```typescript
// src/app/api/events/route.test.ts
import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from './route'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma')

describe('/api/events', () => {
  describe('GET', () => {
    it('should return events list', async () => {
      const mockEvents = [
        { id: '1', title: 'Event 1' },
        { id: '2', title: 'Event 2' }
      ]

      vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockEvents)
    })
  })

  describe('POST', () => {
    it('should create new event', async () => {
      const mockEvent = { id: '1', title: 'New Event' }
      vi.mocked(prisma.event.create).mockResolvedValue(mockEvent)

      const request = new Request('http://localhost:3000/api/events', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Event' })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockEvent)
    })
  })
})
```

---

## 🌐 Tests E2E (Playwright)

### Tester un flow utilisateur

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Bienvenue')).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpass')
    await page.click('button[type="submit"]')

    await expect(page.getByText('Identifiants invalides')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })
})
```

### Tester un formulaire CRUD

```typescript
// e2e/events.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Events Management', () => {
  test('should create new event', async ({ page }) => {
    await page.goto('/admin/events')
    await page.click('button:has-text("Nouvel événement")')

    await page.fill('input[name="title"]', 'Test Event')
    await page.fill('textarea[name="description"]', 'Test description')
    await page.fill('input[type="date"]', '2024-12-31')
    await page.click('button:has-text("Créer")')

    await expect(page.getByText('Événement créé')).toBeVisible()
    await expect(page.getByText('Test Event')).toBeVisible()
  })

  test('should edit existing event', async ({ page }) => {
    await page.goto('/admin/events')
    await page.click('tr:has-text("Test Event") button:has-text("Modifier")')

    await page.fill('input[name="title"]', 'Updated Event')
    await page.click('button:has-text("Enregistrer")')

    await expect(page.getByText('Événement mis à jour')).toBeVisible()
    await expect(page.getByText('Updated Event')).toBeVisible()
  })

  test('should delete event', async ({ page }) => {
    await page.goto('/admin/events')

    page.on('dialog', dialog => dialog.accept())
    await page.click('tr:has-text("Updated Event") button:has-text("Supprimer")')

    await expect(page.getByText('Événement supprimé')).toBeVisible()
    await expect(page.getByText('Updated Event')).not.toBeVisible()
  })
})
```

---

## 🎯 Couverture de code

### Seuils recommandés

```json
{
  "coverage": {
    "lines": 80,
    "functions": 80,
    "branches": 75,
    "statements": 80
  }
}
```

### Exclure certains fichiers

```typescript
// vitest.config.ts
coverage: {
  exclude: [
    'node_modules/',
    '*.config.*',
    'src/types/**',
    'src/app/layout.tsx', // Layout simple
    '**/*.d.ts'
  ]
}
```

---

## 📊 Scripts NPM

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

---

## ✅ Checklist Tests

### Avant de merger une PR

- [ ] Tests unitaires pour nouvelle logique
- [ ] Tests d'intégration pour API/actions
- [ ] Tests E2E pour flows critiques
- [ ] Couverture > 80% (fichiers critiques)
- [ ] Tous les tests passent
- [ ] Pas de tests skip/only

---

**Des tests solides = confiance dans le code**
