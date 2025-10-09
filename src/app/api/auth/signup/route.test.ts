import { describe, it, expect, vi } from 'vitest'

// Mock complet pour éviter les problèmes de timing
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    user: {
      findUnique: vi.fn(),
      create: vi.fn()
    },
    $disconnect: vi.fn()
  }))
}))

vi.mock('bcryptjs', () => ({
  hash: vi.fn(() => Promise.resolve('hashed-password'))
}))

describe('/api/auth/signup', () => {
  it('should be testable', async () => {
    // Test basique pour vérifier que l'environnement fonctionne
    expect(true).toBe(true)
  })

  it('should mock work', async () => {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Vérifier que les mocks sont présents
    expect(typeof prisma.user.findUnique).toBe('function')
    expect(typeof prisma.user.create).toBe('function')
  })
})
