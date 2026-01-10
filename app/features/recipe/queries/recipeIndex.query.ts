import type { Ref } from 'vue'
import type { RecipeIndexResult } from '~~/shared/types/recipe/recipeIndexResult.type'
import { DEFAULT_RECIPE_PAGE_SIZE } from '~~/shared/constants/recipePagination.constant'
import { RecipeService } from '~/features/recipe/services/recipe.service'

export function useRecipeIndexQuery(
  search: Ref<string | undefined>,
  categoryId: Ref<string | undefined>,
  page: Ref<number>,
  pageSize = DEFAULT_RECIPE_PAGE_SIZE,
) {
  return useAsyncData<RecipeIndexResult>(
    'recipe-index',
    () => {
      const requestFetch = useRequestFetch()
      const recipeService = new RecipeService(requestFetch)

      return recipeService.getRecipes({
        search: search.value,
        categoryId: categoryId.value,
        page: page.value,
        pageSize,
      })
    },
    {
      watch: [
        search,
        categoryId,
        page,
      ],
    },
  )
}
