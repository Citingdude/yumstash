import z from 'zod'

export const recipeUuidSchema = z.uuid().brand<'RecipeUuid'>()

export type RecipeUuid = z.infer<typeof recipeUuidSchema>
