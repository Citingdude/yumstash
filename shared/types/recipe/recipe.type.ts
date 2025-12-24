import { z } from 'zod'
import { recipeUuidSchema } from '~~/shared/types/recipe/recipeUuid.type'

export const recipeSchema = z.object({
  id: recipeUuidSchema,
  authorId: z.uuid(),
  createdAt: z.iso.datetime().nullable(),
  updatedAt: z.iso.datetime().nullable(),
  name: z.string(),
  description: z.string(),
  time: z.string(),
  servings: z.string(),
  emoji: z.emoji().nullable(),
  isFavorite: z.boolean().default(false),
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
