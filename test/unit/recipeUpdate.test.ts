import { beforeEach, describe, expect, it, vi } from 'vitest'

const { db, select, update, set, returning, auth } = vi.hoisted(() => {
  const select = vi.fn()
  const returning = vi.fn()
  const set = vi.fn(() => ({ where: vi.fn(() => ({ returning })) }))
  const update = vi.fn(() => ({ set }))
  return {
    select,
    returning,
    set,
    update,
    auth: vi.fn(),
    db: {
      select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => ({ limit: select })) })) })),
      update,
    },
  }
})

vi.mock('../../server/db', () => ({ useDB: () => db }))

const recipeId = '11111111-1111-4111-8111-111111111111'
const userId = '22222222-2222-4222-8222-222222222222'
const body = {
  name: 'Updated pancakes',
  description: 'Mix and cook.',
  time: 20,
  servings: '4',
  emoji: '🥞',
  categoryId: '33333333-3333-4333-8333-333333333333',
  difficultyId: '44444444-4444-4444-8444-444444444444',
}

vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
vi.stubGlobal('requireAuth', auth)
vi.stubGlobal('createError', (error: object) => Object.assign(new Error('Request failed'), error))
vi.stubGlobal('getValidatedRouterParams', (_event: unknown, parse: (value: unknown) => unknown) => parse({ recipeId }))
vi.stubGlobal('readValidatedBody', (_event: unknown, parse: (value: unknown) => unknown) => parse(body))

const { default: handler } = await import('../../server/api/recipes/[recipeId]/index.put')
const invoke = () => handler({} as Parameters<typeof handler>[0])

describe('recipe updates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    auth.mockResolvedValue(userId)
    select.mockResolvedValue([{ id: recipeId, authorId: userId }])
    returning.mockResolvedValue([{ id: recipeId }])
    vi.stubGlobal('readValidatedBody', (_event: unknown, parse: (value: unknown) => unknown) => parse(body))
  })

  it('updates editable fields and the timestamp without changing ownership or status', async () => {
    vi.stubGlobal('readValidatedBody', (_event: unknown, parse: (value: unknown) => unknown) => parse({
      ...body,
      authorId: 'another-user',
      isFavorite: false,
      createdAt: 'yesterday',
    }))
    await expect(invoke()).resolves.toEqual({ success: true, id: recipeId })
    expect(set).toHaveBeenCalledWith({ ...body, updatedAt: expect.any(Date) })
  })

  it('rejects another user’s recipe', async () => {
    select.mockResolvedValue([{ id: recipeId, authorId: 'another-user' }])
    await expect(invoke()).rejects.toMatchObject({ statusCode: 403 })
    expect(update).not.toHaveBeenCalled()
  })

  it('returns 404 for a missing recipe', async () => {
    select.mockResolvedValue([])
    await expect(invoke()).rejects.toMatchObject({ statusCode: 404 })
    expect(update).not.toHaveBeenCalled()
  })

  it('rejects invalid form data before updating', async () => {
    vi.stubGlobal('readValidatedBody', (_event: unknown, parse: (value: unknown) => unknown) => parse({ ...body, name: '', time: -1 }))
    await expect(invoke()).rejects.toThrow()
    expect(update).not.toHaveBeenCalled()
  })

  it('requires authentication', async () => {
    auth.mockRejectedValue(Object.assign(new Error('Request failed'), { statusCode: 401 }))
    await expect(invoke()).rejects.toMatchObject({ statusCode: 401 })
    expect(update).not.toHaveBeenCalled()
  })
})
