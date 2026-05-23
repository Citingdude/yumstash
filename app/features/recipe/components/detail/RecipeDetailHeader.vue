<script setup lang="ts">
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import { DateUtil } from '~/utils/date/date.util'

const props = defineProps<{
  recipe: RecipeWithRelations
  isTogglingFavorite: boolean
  isTogglingCooked: boolean
  isDeleting: boolean
}>()

const emit = defineEmits<{
  toggleFavorite: []
  toggleCooked: []
  deleteRecipe: []
}>()

const formattedDate = computed<string>(() => {
  if (!props.recipe.createdAt)
    return ''

  return DateUtil.format(props.recipe.createdAt)
})
</script>

<template>
  <header class="bg-linear-to-br from-primary-500 to-primary-600 p-8 lg:p-12">
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-3 mb-4">
          <div class="text-6xl lg:text-7xl">
            {{ recipe.emoji || '🍽️' }}
          </div>
          <div>
            <h1 class="text-3xl lg:text-4xl font-bold mb-2 text-neutral-50">
              {{ recipe.name }}
            </h1>
            <p class="text-neutral-50 text-sm lg:text-base">
              Created {{ formattedDate }}
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <AppButton
          :icon="recipe.isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
          :color="recipe.isFavorite ? 'secondary' : 'neutral'"
          :variant="recipe.isFavorite ? 'solid' : 'outline'"
          :loading="props.isTogglingFavorite"
          size="lg"
          @click="emit('toggleFavorite')"
        />
        <AppButton
          :icon="recipe.isCooked ? 'i-mdi-pot-steam' : 'i-mdi-pot-steam-outline'"
          :color="recipe.isCooked ? 'secondary' : 'neutral'"
          :variant="recipe.isCooked ? 'solid' : 'outline'"
          :loading="props.isTogglingCooked"
          size="lg"
          @click="emit('toggleCooked')"
        />
        <AppButton
          icon="i-heroicons-trash"
          color="neutral"
          variant="solid"
          :loading="isDeleting"
          size="lg"
          @click="emit('deleteRecipe')"
        />
      </div>
    </div>
  </header>
</template>
