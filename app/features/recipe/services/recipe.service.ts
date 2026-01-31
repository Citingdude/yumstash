import type { CreateRecipeForm } from '~~/shared/types/recipe/createRecipeForm.type'
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import type { RecipeIndexResult } from '~~/shared/types/recipe/recipeIndexResult.type'
import type { RecipeUuid } from '~~/shared/types/recipe/recipeUuid.type'
import { DEFAULT_RECIPE_PAGE_SIZE } from '~~/shared/constants/recipePagination.constant'

interface GetRecipesParams {
  search?: string
  categoryId?: string
  page: number
  pageSize?: number
}

export function useRecipeService() {
  const requestFetch = useRequestFetch()

  async function getRecipes(params: GetRecipesParams): Promise<RecipeIndexResult> {
    return requestFetch('/api/recipes', {
      query: {
        search: params.search,
        categoryId: params.categoryId,
        page: params.page,
        pageSize: params.pageSize ?? DEFAULT_RECIPE_PAGE_SIZE,
      },
    })
  }

  async function getRecipe(recipeId: RecipeUuid): Promise<RecipeWithRelations> {
    return requestFetch(`/api/recipes/${recipeId}`)
  }

  async function createRecipe(body: CreateRecipeForm) {
    await requestFetch('/api/recipes', {
      method: 'POST',
      body,
    })
  }

  async function deleteRecipe(recipeId: RecipeUuid) {
    await requestFetch(`/api/recipes/${recipeId}`, {
      method: 'DELETE',
    })
  }

  async function toggleFavorite(recipeId: RecipeUuid, isFavorite: boolean) {
    return requestFetch(`/api/recipes/${recipeId}/favorite`, {
      method: 'POST',
      body: { isFavorite },
    })
  }

  async function toggleCooked(recipeId: RecipeUuid, isCooked: boolean) {
    return requestFetch(`/api/recipes/${recipeId}/cooked`, {
      method: 'POST',
      body: { isCooked },
    })
  }

  return {
    getRecipes,
    getRecipe,
    createRecipe,
    deleteRecipe,
    toggleFavorite,
    toggleCooked,
  }
}
