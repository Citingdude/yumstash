import type { RecipeCategoryFilterItem } from '~~/shared/types/recipe-category/recipeCategoryFilterItem.type'
import type { RecipeCategorySelectItem } from '~~/shared/types/recipe-category/recipeCategorySelectItem.type'
import { RecipeCategorySelectItemTransformer } from '~~/shared/types/recipe-category/recipeCategorySelectItem.transformer'

export function useRecipeCategoryIndexQuery() {
  const query = useAsyncData(
    'recipe-categories',
    () => $fetch('/api/recipe-categories'),
    {
      lazy: true,
    },
  )

  const selectItems = computed<RecipeCategorySelectItem[]>(() => {
    if (!query.data.value) {
      return []
    }

    return query.data.value.map(RecipeCategorySelectItemTransformer.fromRecipeCategory)
  })

  const filterItems = computed<RecipeCategoryFilterItem[]>(() => {
    if (!query.data.value) {
      return []
    }

    return [
      { value: undefined, label: 'All' },
      ...query.data.value.map(RecipeCategorySelectItemTransformer.fromRecipeCategory),
    ]
  })

  return {
    ...query,
    selectItems,
    filterItems,
  }
}
