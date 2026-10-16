<script lang="ts" setup>
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import type { RecipeUuid } from '~~/shared/types/recipe/recipeUuid.type'
import AppButton from '~/components/app/AppButton.vue'
import ConfirmDialog from '~/components/dialog/ConfirmDialog.vue'
import { useAppToast } from '~/composables/toast/useAppToast.composable'
import RecipeDetailContent from '~/features/recipe/components/detail/RecipeDetailContent.vue'
import RecipeDetailHeader from '~/features/recipe/components/detail/RecipeDetailHeader.vue'
import RecipeDetailInfo from '~/features/recipe/components/detail/RecipeDetailInfo.vue'
import RecipeDetailMeta from '~/features/recipe/components/detail/RecipeDetailMeta.vue'
import { useRecipeDetailQuery } from '~/features/recipe/queries/recipeDetail.query'
import { useRecipeService } from '~/features/recipe/services/recipe.service'

const route = useRoute('recipes-id')
const router = useRouter()
const overlay = useOverlay()
const appToast = useAppToast()
const recipeService = useRecipeService()

const recipeId = computed(() => route.params.id as RecipeUuid)
const recipeDetailQuery = useRecipeDetailQuery(recipeId)

const confirmDialog = overlay.create(ConfirmDialog)

const isTogglingFavorite = ref<boolean>(false)
const isTogglingCooked = ref<boolean>(false)
const isDeleting = ref<boolean>(false)

const recipe = computed<RecipeWithRelations | null>(() => {
  return recipeDetailQuery.data.value ?? null
})

async function toggleFavorite() {
  if (!recipe.value || isTogglingFavorite.value)
    return

  isTogglingFavorite.value = true
  try {
    const result = await recipeService.toggleFavorite(recipe.value.id, recipe.value.isFavorite)
    await recipeDetailQuery.refresh()
    await refreshNuxtData('recipe-index')
    appToast.success({
      title: result.isFavorite ? 'Added to favorites' : 'Removed from favorites',
    })
  }
  catch {
    appToast.error({
      title: 'Failed to update favorite status',
    })
  }
  finally {
    isTogglingFavorite.value = false
  }
}

async function toggleCooked() {
  if (!recipe.value || isTogglingCooked.value)
    return

  isTogglingCooked.value = true
  try {
    const result = await recipeService.toggleCooked(recipe.value.id, recipe.value.isCooked)
    await recipeDetailQuery.refresh()
    await Promise.all([refreshNuxtData('recipe-index'), refreshNuxtData('recipe-cooked-count')])
    appToast.success({
      title: result.isCooked ? 'Marked as cooked' : 'Marked as not cooked',
    })
  }
  catch {
    appToast.error({
      title: 'Failed to update cooked status',
    })
  }
  finally {
    isTogglingCooked.value = false
  }
}

async function deleteRecipe() {
  if (!recipe.value || isDeleting.value)
    return

  const instance = confirmDialog.open({
    title: 'Delete Recipe',
    description: `Are you sure you want to delete "${recipe.value!.name}"? This action cannot be undone.`,
    confirmLabel: 'Delete',
    confirmColor: 'error',
    cancelLabel: 'Cancel',
  })

  const confirmed = await instance.result

  if (!confirmed) {
    return
  }

  isDeleting.value = true
  try {
    await recipeService.deleteRecipe(recipe.value.id)
    appToast.success({
      title: 'Recipe deleted successfully',
    })
    router.push('/')
  }
  catch {
    appToast.error({
      title: 'Failed to delete recipe',
    })
    isDeleting.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-muted/40">
    <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      <AppButton to="/" variant="ghost" color="neutral" icon="i-heroicons-arrow-left" class="mb-6 -ml-2">
        All recipes
      </AppButton>

      <article v-if="recipe" class="space-y-6">
        <RecipeDetailHeader
          :recipe="recipe"
          :is-deleting="isDeleting"
          :is-toggling-cooked="isTogglingCooked"
          :is-toggling-favorite="isTogglingFavorite"
          @delete-recipe="deleteRecipe"
          @toggle-cooked="toggleCooked"
          @toggle-favorite="toggleFavorite"
        />
        <RecipeDetailMeta :recipe="recipe" />
        <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <RecipeDetailContent :recipe="recipe" />
          <RecipeDetailInfo :recipe="recipe" />
        </div>
      </article>
      <div v-else-if="recipeDetailQuery.status.value === 'pending'" role="status" aria-label="Loading recipe" class="space-y-6">
        <USkeleton class="h-72 rounded-3xl" />
        <USkeleton class="h-24 rounded-2xl" />
        <USkeleton class="h-64 rounded-3xl" />
        <span class="sr-only">Loading recipe…</span>
      </div>
      <div v-else role="alert" class="rounded-3xl border border-default bg-default px-6 py-16 text-center">
        <UIcon name="i-heroicons-exclamation-circle" class="size-10 text-muted" />
        <h1 class="mt-4 text-xl font-semibold text-highlighted">
          Couldn’t load this recipe
        </h1>
        <p class="mt-2 text-sm text-muted">
          It may no longer be available. Try again or head back to your collection.
        </p>
        <AppButton class="mt-6" @click="recipeDetailQuery.refresh()">
          Try again
        </AppButton>
      </div>
    </div>
  </main>
</template>
