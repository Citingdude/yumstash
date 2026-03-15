import type { CreateRecipeForm } from '~~/shared/types/recipe/createRecipeForm.type'
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import type { RecipeIndexResult } from '~~/shared/types/recipe/recipeIndexResult.type'
import type { RecipeUuid } from '~~/shared/types/recipe/recipeUuid.type'
import type { RecipeError } from '~/features/recipe/models/error/RecipeError.model'
import { ResultAsync } from 'neverthrow'
import { DEFAULT_RECIPE_PAGE_SIZE } from '~~/shared/constants/recipePagination.constant'

interface GetRecipesParams {
  search?: string
  categoryId?: string
  page: number
  pageSize?: number
}

export function useRecipeService() {
  const requestFetch = useRequestFetch()

  function getRecipes(params: GetRecipesParams): ResultAsync<RecipeIndexResult, RecipeError> {
    const req = requestFetch('/api/recipes', {
      query: {
        search: params.search,
        categoryId: params.categoryId,
        page: params.page,
        pageSize: params.pageSize ?? DEFAULT_RECIPE_PAGE_SIZE,
      },
    })

    return ResultAsync.fromPromise(
      req,
      (error) => {
        return {
          message: 'Failed to get recipes',
          error,
        }
      },
    )
  }

  function getRecipe(recipeId: RecipeUuid): ResultAsync<RecipeWithRelations, RecipeError> {
    const req = requestFetch(`/api/recipes/${recipeId}`)

    return ResultAsync.fromPromise(
      req,
      (error) => {
        return {
          message: `Failed to fetch recipe with id: ${recipeId}`,
          error,
        }
      },
    )
  }

  function createRecipe(
    body: CreateRecipeForm,
  ): ResultAsync<RecipeWithRelations, RecipeError> {
    const req = requestFetch('/api/recipes', {
      method: 'POST',
      body,
    })

    return ResultAsync.fromPromise(
      req,
      () => {
        return {
          message: 'Failed to create recipe',
        }
      },
    )
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
