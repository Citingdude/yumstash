import z from 'zod'

export const recipeDifficultyUuidSchema = z.uuid().brand<'RecipeDifficultyUuid'>()

export type RecipeDifficultyUuid = z.infer<typeof recipeDifficultyUuidSchema>
