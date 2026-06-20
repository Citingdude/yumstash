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
    await recipeDetailQuery.refresh()
    appToast.success({
      title: recipe.value.isFavorite ? 'Removed from favorites' : 'Added to favorites',
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
    await recipeService.toggleCooked(recipe.value.id, recipe.value.isCooked)
    await recipeDetailQuery.refresh()
    appToast.success({
      title: recipe.value.isCooked ? 'Marked as not cooked' : 'Marked as cooked',
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
  <article
    v-if="recipe"
    class="min-h-screen"
  >
    <div
      class="container mx-auto px-4 py-8 lg:py-12"
    >
      <div class="max-w-5xl mx-auto">
        <AppButton
          to="/"
          variant="ghost"
          color="neutral"
          icon="i-heroicons-arrow-left"
          class="mb-6"
        >
          Back to Recipes
        </AppButton>

        <div
          class="bg-default rounded-2xl shadow-sm border border-default overflow-hidden mb-6"
        >
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
          <RecipeDetailContent :recipe="recipe" />
        </div>

        <RecipeDetailInfo :recipe="recipe" />
      </div>
    </div>
  </article>
</template>
