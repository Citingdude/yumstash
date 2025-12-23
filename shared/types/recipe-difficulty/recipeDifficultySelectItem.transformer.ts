import type { RecipeDifficulty } from '~~/shared/types/recipe-difficulty/recipeDifficulty.type'
import type { RecipeDifficultySelectItem } from '~~/shared/types/recipe-difficulty/recipeDifficultySelectItem.type'

export class RecipeDifficultySelectItemTransformer {
  public static fromRecipeDifficulty(
    recipeDifficulty: RecipeDifficulty,
  ): RecipeDifficultySelectItem {
    return {
      label: recipeDifficulty.name,
      value: recipeDifficulty.id,
    }
  }
}
