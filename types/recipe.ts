import { z } from 'zod'

export const recipeSchema = z.object({
  id: z.uuid(),
  authorId: z.uuid(),
  createdAt: z.iso.datetime().nullable(),
  updatedAt: z.iso.datetime().nullable(),
  name: z.string().min(3, 'Name must be at least 3 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  time: z.string().min(1).max(50),
  servings: z.string().min(1).max(50),
  emoji: z.emoji().nullable(),
  difficultyId: z.uuid(),
  categoryId: z.uuid(),
})

export const recipeWithRelationsSchema = recipeSchema.extend({
  difficulty: z.object({
    id: z.uuid(),
    name: z.enum(['easy', 'medium', 'hard']),
  }),
  category: z.object({
    id: z.uuid(),
    name: z.string(),
    slug: z.string(),
  }),
  author: z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.email(),
  }),
})

export type Recipe = z.infer<typeof recipeSchema>
export type RecipeWithRelations = z.infer<typeof recipeWithRelationsSchema>
