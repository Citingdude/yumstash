import { z } from 'zod'

export const recipeCategoryUuidSchema = z.uuid().brand<'RecipeCategoryUuid'>()

export type RecipeCategoryUuid = z.infer<typeof recipeCategoryUuidSchema>
