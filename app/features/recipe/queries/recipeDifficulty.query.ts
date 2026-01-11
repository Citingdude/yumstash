import type { RecipeDifficultySelectItem } from '~~/shared/types/recipe-difficulty/recipeDifficultySelectItem.type'
import { RecipeDifficultySelectItemTransformer } from '~~/shared/types/recipe-difficulty/recipeDifficultySelectItem.transformer'

export function useRecipeDifficultyQuery() {
  const query = useAsyncData(
    'recipe-difficulties',
    () => $fetch('/api/recipe-difficulty'),
    {
      lazy: true,
    },
  )

  const selectItems = computed<RecipeDifficultySelectItem[]>(() => {
    if (!query.data.value) {
      return []
    }

    return query.data.value.map(RecipeDifficultySelectItemTransformer.fromRecipeDifficulty)
  })

  return {
    ...query,
    selectItems,
  }
}
