<script lang="ts" setup>
import type { RecipeUuid } from '~~/shared/types/recipe/recipeUuid.type'
import ConfirmDialog from '~/components/dialog/ConfirmDialog.vue'
import { useAppToast } from '~/composables/toast/useAppToast.composable'
import { useRecipeDetailQuery } from '~/features/recipe/queries/recipeDetail.query'
import { useRecipeService } from '~/features/recipe/services/recipe.service'

const route = useRoute('recipes-id')
const router = useRouter()
const overlay = useOverlay()
const appToast = useAppToast()
const recipeService = useRecipeService()

const recipeId = computed(() => route.params.id as RecipeUuid)
const { data: recipe, status, error, refresh } = useRecipeDetailQuery(recipeId)

const confirmDialog = overlay.create(ConfirmDialog)

const isTogglingFavorite = ref(false)
const isTogglingCooked = ref(false)
const isDeleting = ref(false)

const difficultyConfig = computed(() => {
  if (!recipe.value)
    return null

  const difficultyMap = {
    easy: {
      color: 'success' as const,
      icon: 'i-heroicons-star',
      label: 'Easy',
    },
    medium: {
      color: 'warning' as const,
      icon: 'i-heroicons-fire',
      label: 'Medium',
    },
    hard: {
      color: 'error' as const,
      icon: 'i-heroicons-bolt',
      label: 'Hard',
    },
  }
  return difficultyMap[recipe.value.difficulty.name]
})

const formattedDate = computed(() => {
  if (!recipe.value?.createdAt)
    return ''

  return new Date(recipe.value.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

async function toggleFavorite() {
  if (!recipe.value || isTogglingFavorite.value)
    return

  isTogglingFavorite.value = true
  try {
    await recipeService.toggleFavorite(recipe.value.id, recipe.value.isFavorite)
    await refresh()
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
    await refresh()
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
  <main class="min-h-screen bg-stone-50">
    <!-- Loading State -->
    <div v-if="status === 'pending'" class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto space-y-6">
        <USkeleton class="h-12 w-3/4" />
        <USkeleton class="h-64 w-full" />
        <USkeleton class="h-32 w-full" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-12">
      <UCard class="max-w-2xl mx-auto">
        <div class="text-center py-12">
          <UIcon name="i-heroicons-exclamation-circle" class="w-16 h-16 mx-auto text-red-600 mb-4" />
          <h2 class="text-2xl font-bold text-stone-900 mb-2">
            Recipe Not Found
          </h2>
          <p class="text-stone-600 mb-6">
            The recipe you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <UButton to="/" color="error">
            Back to Recipes
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Recipe Content -->
    <div v-else-if="recipe" class="container mx-auto px-4 py-8 lg:py-12">
      <div class="max-w-5xl mx-auto">
        <!-- Back Button -->
        <UButton
          to="/"
          variant="ghost"
          color="neutral"
          icon="i-heroicons-arrow-left"
          class="mb-6"
        >
          Back to Recipes
        </UButton>

        <!-- Recipe Header -->
        <div class="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden mb-6">
          <!-- Hero Section -->
          <div class="bg-linear-to-br from-red-500 to-red-600 p-8 lg:p-12">
            <div class="flex items-start justify-between gap-4 flex-wrap">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-4">
                  <div class="text-6xl lg:text-7xl">
                    {{ recipe.emoji || '🍽️' }}
                  </div>
                  <div>
                    <h1 class="text-3xl lg:text-4xl font-bold text-white mb-2">
                      {{ recipe.name }}
                    </h1>
                    <p class="text-red-100 text-sm lg:text-base">
                      Created {{ formattedDate }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2">
                <UButton
                  :icon="recipe.isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
                  :color="recipe.isFavorite ? 'error' : 'neutral'"
                  :variant="recipe.isFavorite ? 'solid' : 'outline'"
                  :loading="isTogglingFavorite"
                  size="lg"
                  @click="toggleFavorite"
                />
                <UButton
                  :icon="recipe.isCooked ? 'i-heroicons-check-circle-solid' : 'i-heroicons-check-circle'"
                  :color="recipe.isCooked ? 'success' : 'neutral'"
                  :variant="recipe.isCooked ? 'solid' : 'outline'"
                  :loading="isTogglingCooked"
                  size="lg"
                  @click="toggleCooked"
                />
                <UButton
                  icon="i-heroicons-trash"
                  color="neutral"
                  variant="outline"
                  :loading="isDeleting"
                  size="lg"
                  @click="deleteRecipe"
                />
              </div>
            </div>
          </div>

          <!-- Recipe Meta Info -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 lg:p-8 bg-stone-50 border-b border-stone-200">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-white rounded-xl shadow-sm">
                <UIcon name="i-heroicons-clock" class="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p class="text-sm text-stone-600 font-medium">
                  Time
                </p>
                <p class="text-lg font-semibold text-stone-900">
                  {{ recipe.time }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="p-3 bg-white rounded-xl shadow-sm">
                <UIcon name="i-heroicons-user-group" class="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p class="text-sm text-stone-600 font-medium">
                  Servings
                </p>
                <p class="text-lg font-semibold text-stone-900">
                  {{ recipe.servings }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="p-3 bg-white rounded-xl shadow-sm">
                <UIcon :name="difficultyConfig?.icon || 'i-heroicons-star'" class="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p class="text-sm text-stone-600 font-medium">
                  Difficulty
                </p>
                <div class="flex items-center gap-2">
                  <UBadge
                    :color="difficultyConfig?.color"
                    variant="subtle"
                    size="md"
                  >
                    {{ difficultyConfig?.label }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="p-6 lg:p-8">
            <div class="flex items-start gap-3 mb-4">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-stone-600 mt-1" />
              <div class="flex-1">
                <h2 class="text-xl font-semibold text-stone-900 mb-3">
                  Description
                </h2>
                <p class="text-stone-700 leading-relaxed whitespace-pre-wrap">
                  {{ recipe.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Category Card -->
          <UCard>
            <div class="flex items-center gap-3">
              <div class="p-3 bg-red-100 rounded-xl">
                <UIcon name="i-heroicons-tag" class="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p class="text-sm text-stone-600 font-medium">
                  Category
                </p>
                <p class="text-lg font-semibold text-stone-900 capitalize">
                  {{ recipe.category.name }}
                </p>
              </div>
            </div>
          </UCard>

          <!-- Author Card -->
          <UCard>
            <div class="flex items-center gap-3">
              <div class="p-3 bg-red-100 rounded-xl">
                <UIcon name="i-heroicons-user" class="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p class="text-sm text-stone-600 font-medium">
                  Author
                </p>
                <p class="text-lg font-semibold text-stone-900">
                  {{ recipe.author.name }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </main>
</template>
