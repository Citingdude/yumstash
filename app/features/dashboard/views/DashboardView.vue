<script setup lang="ts">
import type { RecipeCategoryFilterItem } from '~~/shared/types/recipe-category/recipeCategoryFilterItem.type'
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import type { RecipeUuid } from '~~/shared/types/recipe/recipeUuid.type'
import type { StatCardProps } from '~/components/stats/StatsCard.vue'

import type { RecipeCardProps } from '~/features/recipe/components/card/RecipeCard.vue'
import { refDebounced } from '@vueuse/core'
import { DEFAULT_RECIPE_PAGE_SIZE } from '~~/shared/constants/recipePagination.constant'
import AppFadeSlideTransition from '~/components/app/transition/AppFadeSlideTransition.vue'
import ConfirmDialog from '~/components/dialog/ConfirmDialog.vue'
import { useAppToast } from '~/composables/toast/useAppToast.composable'
import { QUERY_KEYS } from '~/constants/queryKey.constant'
import DashboardSearch from '~/features/dashboard/components/DashboardSearch.vue'
import DashboardStats from '~/features/dashboard/components/DashboardStats.vue'
import RecipeCard from '~/features/recipe/components/card/RecipeCard.vue'
import RecipeFormModal from '~/features/recipe/components/modal/RecipeFormModal.vue'
import { useRecipeCategoryCountQuery } from '~/features/recipe/queries/recipeCategoryCount.query'
import { useRecipeCategoryIndexQuery } from '~/features/recipe/queries/recipeCategoryIndex.query'
import { useRecipeCookedCountQuery } from '~/features/recipe/queries/recipeCookedCount.query'
import { useRecipeCountQuery } from '~/features/recipe/queries/recipeCount.query'
import { useRecipeDifficultyQuery } from '~/features/recipe/queries/recipeDifficulty.query'
import { useRecipeIndexQuery } from '~/features/recipe/queries/recipeIndex.query'
import { useRecipeService } from '~/features/recipe/services/recipe.service'
import { invalidateQuery } from '~/utils/query/query.util'

const toast = useAppToast()
const overlay = useOverlay()
const confirmDialog = overlay.create(ConfirmDialog)

const recipeService = useRecipeService()

const selectedCategory = ref<RecipeCategoryFilterItem | undefined>(undefined)
const searchQuery = ref<string | undefined>()
const debouncedSearchQuery = refDebounced(searchQuery, 300)
const page = ref<number>(1)
const favoritesOnly = shallowRef(false)

const categoryId = computed(() => selectedCategory.value?.value)

const recipeIndexQuery = useRecipeIndexQuery(debouncedSearchQuery, categoryId, page, favoritesOnly)
const recipeCountQuery = useRecipeCountQuery()
const recipeCategoryIndexQuery = useRecipeCategoryIndexQuery()
const recipeCategoryCountQuery = useRecipeCategoryCountQuery()
const recipeCookedCountQuery = useRecipeCookedCountQuery()

watch([debouncedSearchQuery, categoryId, favoritesOnly], () => {
  page.value = 1
})

const recipeCategoryItems = computed<RecipeCategoryFilterItem[]>(() => {
  return recipeCategoryIndexQuery.filterItems.value
})

const paginatedMeta = computed(() => recipeIndexQuery.data.value?.meta)

const recipes = computed<RecipeWithRelations[]>(() => {
  return recipeIndexQuery.data.value?.items ?? []
})

const isRefreshing = computed(() => recipeIndexQuery.status.value === 'pending')
const isInitialLoading = computed(() => isRefreshing.value && !recipeIndexQuery.data.value)

// Keep the current results mounted during a refresh. Animate only when the
// displayed recipes change, so updating a cooked status does not flash the grid.
const resultsKey = computed(() => {
  if (isInitialLoading.value)
    return 'loading'
  if (recipeIndexQuery.error.value && !isRefreshing.value)
    return 'error'
  return recipes.value.length
    ? `recipes-${recipes.value.map(recipe => recipe.id).join('-')}`
    : 'empty'
})

const totalPages = computed(() => paginatedMeta.value?.totalPages ?? 1)

watch(totalPages, (newTotalPages) => {
  if (page.value > newTotalPages) {
    page.value = newTotalPages
  }
})

const totalRecipes = computed(() => recipeCountQuery.data.value ?? 0)
const totalFilteredRecipes = computed<number>(() => recipeIndexQuery.data.value?.meta?.total ?? 0)
const totalCategories = computed(() => recipeCategoryCountQuery.data.value ?? 0)
const totalCooked = computed(() => recipeCookedCountQuery.data.value ?? 0)

const dashboardStats = computed<StatCardProps[]>(() => {
  return [
    {
      icon: 'i-heroicons-document-text',
      number: totalRecipes.value.toString(),
      title: 'Total Recipes',
    },
    {
      icon: 'i-mdi-pot-steam',
      number: totalCooked.value.toString(),
      title: 'Cooked',
    },
    {
      icon: 'i-heroicons-tag',
      number: totalCategories.value.toString(),
      title: 'Categories',
    },
  ]
})

const togglingFavoriteIds = ref(new Set<RecipeUuid>())

const recipeCards = computed<RecipeCardProps[]>(() => {
  return recipes.value.map((recipe) => {
    return {
      id: recipe.id,
      emoji: recipe.emoji ?? '',
      difficulty: recipe.difficulty?.name ?? null,
      name: recipe.name,
      description: recipe.description,
      time: recipe.time,
      servings: recipe.servings,
      category: recipe.category?.name ?? null,
      isFavorite: recipe.isFavorite,
      isTogglingFavorite: togglingFavoriteIds.value.has(recipe.id),
      isCooked: recipe.isCooked,
    }
  })
})

async function onFavorite(recipeId: RecipeUuid, isFavorite: boolean): Promise<void> {
  if (togglingFavoriteIds.value.has(recipeId))
    return

  togglingFavoriteIds.value.add(recipeId)
  try {
    await recipeService.toggleFavorite(recipeId, isFavorite)
    await Promise.all([
      refreshNuxtData(QUERY_KEYS.RECIPE_INDEX),
      refreshNuxtData(`${QUERY_KEYS.RECIPE_INDEX}-${recipeId}`),
    ])
  }
  catch {
    toast.error({
      title: 'Failed to update favorite status',
      errorMessage: 'Please try again.',
    })
  }
  finally {
    togglingFavoriteIds.value.delete(recipeId)
  }
}

async function onCooked(recipeId: RecipeUuid, isCooked: boolean): Promise<void> {
  try {
    await $fetch(`/api/recipes/${recipeId}/cooked`, {
      method: 'POST',
      body: {
        isCooked,
      },
    })

    await Promise.all([
      refreshNuxtData('recipe-index'),
      refreshNuxtData('recipe-cooked-count'),
    ])

    toast.success({
      title: isCooked ? 'Cooked status removed' : 'Recipe marked cooked',
      description: isCooked
        ? 'Recipe removed from your cooked list.'
        : 'Recipe added to your cooked list.',
    })
  }
  catch (error) {
    console.error('Failed to update cooked state', error)
    toast.error({
      title: 'Error',
      errorMessage: 'Could not update cooked status. Try again later.',
    })
  }
}

async function onDelete(recipeId: RecipeUuid): Promise<void> {
  const instance = confirmDialog.open({
    title: 'Delete Recipe',
    description: 'Are you sure you want to delete this recipe? This action cannot be undone.',
    icon: 'i-heroicons-exclamation-triangle',
    confirmColor: 'error',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
  })

  const confirmed = await instance.result

  if (!confirmed) {
    return
  }

  try {
    await recipeService.deleteRecipe(recipeId)

    await Promise.all([
      invalidateQuery(QUERY_KEYS.RECIPE_INDEX),
      invalidateQuery(QUERY_KEYS.RECIPE_COUNT),
      invalidateQuery(QUERY_KEYS.RECIPE_FAVORITE_COUNT),
      invalidateQuery(QUERY_KEYS.RECIPE_COOKED_COUNT),
    ])

    toast.success({
      title: 'Recipe deleted',
      description: 'Recipe has been successfully deleted.',
    })
  }
  catch (error) {
    console.error('Failed to delete recipe', error)
    toast.error({
      title: 'Error',
      errorMessage: 'Could not delete recipe. Try again later.',
    })
  }
}
const recipeDifficultyQuery = useRecipeDifficultyQuery()
const createRecipeModal = overlay.create(RecipeFormModal)
const hasFilters = computed(() => Boolean(searchQuery.value || categoryId.value || favoritesOnly.value))

function clearFilters() {
  favoritesOnly.value = false
  searchQuery.value = ''
  selectedCategory.value = undefined
  page.value = 1
}

function onAddRecipe() {
  createRecipeModal.open({
    categoryOptions: recipeCategoryIndexQuery.selectItems.value,
    difficultyOptions: recipeDifficultyQuery.selectItems.value,
  })
}
</script>

<template>
  <main class="min-h-screen bg-muted/40">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <header class="relative mb-8 overflow-hidden rounded-3xl border border-default bg-default p-6 sm:p-8 lg:p-10">
        <div class="absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-primary/10 to-transparent" aria-hidden="true" />
        <div class="relative flex items-center justify-between gap-6">
          <div class="max-w-xl">
            <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Your personal cookbook
            </p>
            <h1 class="text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
              Good food starts here.
            </h1>
            <p class="mt-4 max-w-md text-sm leading-6 text-muted sm:text-base">
              All your keepers, kitchen experiments, and next-meal inspiration. In one delicious collection.
            </p>
            <AppButton icon="i-heroicons-plus" size="lg" class="mt-6 rounded-xl" @click="onAddRecipe">
              Add a recipe
            </AppButton>
          </div>
          <div aria-hidden="true" class="hidden size-36 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/10 text-7xl md:flex lg:size-44 lg:text-8xl">
            🍳
          </div>
        </div>
      </header>

      <DashboardStats class="mb-10" :stats="dashboardStats" />

      <section aria-labelledby="collection-title">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="collection-title" class="text-2xl font-semibold tracking-tight text-highlighted">
              Your recipes
            </h2>
            <p class="mt-1 text-sm text-muted">
              Find a favorite. Try something new.
            </p>
          </div>
          <span v-if="recipeIndexQuery.data.value" role="status" class="rounded-full border border-default bg-default px-3 py-1 text-xs font-medium text-muted">
            {{ isRefreshing ? 'Updating recipes…' : `${totalFilteredRecipes} ${totalFilteredRecipes === 1 ? 'recipe' : 'recipes'}${hasFilters ? ' found' : ' in your collection'}` }}
          </span>
        </div>

        <DashboardSearch
          v-model:query="searchQuery"
          v-model:category="selectedCategory"
          v-model:favorites-only="favoritesOnly"
          :category-items="recipeCategoryItems"
          class="mb-6"
        />

        <div :aria-busy="isRefreshing">
          <AppFadeSlideTransition :transition-key="resultsKey">
            <div v-if="isInitialLoading" role="status" aria-label="Loading recipes">
              <span class="sr-only">Loading recipes…</span>
              <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <USkeleton v-for="index in 6" :key="index" class="h-96 rounded-3xl" />
              </div>
            </div>
            <div v-else-if="recipeIndexQuery.error.value && !isRefreshing" role="alert" class="rounded-3xl border border-default bg-default px-6 py-16 text-center">
              <UIcon name="i-heroicons-exclamation-circle" class="size-10 text-muted" />
              <h3 class="mt-4 text-lg font-semibold text-highlighted">
                Couldn’t load your recipes
              </h3>
              <p class="mt-2 text-sm text-muted">
                Please try again to get back to your collection.
              </p>
              <AppButton class="mt-6 rounded-xl" @click="recipeIndexQuery.refresh()">
                Try again
              </AppButton>
            </div>
            <div v-else-if="!recipeCards.length" class="rounded-3xl border border-dashed border-default bg-default px-6 py-16 text-center">
              <div aria-hidden="true" class="mb-5 text-5xl">
                {{ hasFilters ? '🔎' : '🥣' }}
              </div>
              <h3 class="text-xl font-semibold text-highlighted">
                {{ hasFilters ? 'No recipes on the menu' : 'Your cookbook starts here' }}
              </h3>
              <p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
                {{ hasFilters ? 'Try a different search or clear your filters to see the whole collection.' : 'Save your first recipe and make it easy to find the next time you’re hungry.' }}
              </p>
              <AppButton v-if="hasFilters" class="mt-6 rounded-xl" color="neutral" variant="outline" @click="clearFilters">
                Clear filters
              </AppButton>
              <AppButton v-else icon="i-heroicons-plus" class="mt-6 rounded-xl" @click="onAddRecipe">
                Add your first recipe
              </AppButton>
            </div>
            <ul v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <li v-for="recipe in recipeCards" :key="recipe.id" class="min-w-0">
                <RecipeCard v-bind="recipe" @favorite="onFavorite" @cooked="onCooked" @delete="onDelete" />
              </li>
            </ul>
          </AppFadeSlideTransition>
        </div>

        <div v-if="totalFilteredRecipes > DEFAULT_RECIPE_PAGE_SIZE && !recipeIndexQuery.error.value" class="mt-8 flex flex-col items-center justify-between gap-4 border-t border-default pt-6 sm:flex-row">
          <p class="text-xs text-muted">
            Page {{ page }} of {{ totalPages }}
          </p>
          <UPagination v-model:page="page" :total="totalFilteredRecipes" :items-per-page="DEFAULT_RECIPE_PAGE_SIZE" :sibling-count="1" :show-edges="false" variant="ghost" />
        </div>
      </section>
    </div>
  </main>
</template>
