<script setup lang="ts">
import type { RecipeDifficultNameEnum } from '~~/shared/types/recipe-difficulty/recipeDifficultyName.enum'
import type { RecipeUuid } from '~~/shared/types/recipe/recipeUuid.type'

export interface RecipeCardProps {
  id: RecipeUuid
  emoji: string
  difficulty: RecipeDifficultNameEnum
  name: string
  description: string
  time: string
  servings: string
  category: string
  isFavorite: boolean
  isCooked: boolean
}

const props = defineProps<RecipeCardProps>()

const emit = defineEmits<{
  favorite: [
    recipeId: RecipeUuid,
    isFavorite: boolean,
  ]
  cooked: [
    recipeId: RecipeUuid,
    isCooked: boolean,
  ]
}>()

const difficultyColor = computed(() => {
  switch (props.difficulty) {
    case 'easy':
      return 'success'

    case 'medium':
      return 'warning'

    case 'hard':
      return 'error'

    default:
      return undefined
  }
})

function onFavorite(): void {
  emit('favorite', props.id, props.isFavorite)
}

function onCooked(): void {
  emit('cooked', props.id, props.isCooked)
}
</script>

<template>
  <UCard
    class="hover:shadow-lg transition-shadow cursor-pointer"
  >
    <template #header>
      <div class="relative">
        <div class="w-full h-48 bg-stone-200 rounded-lg flex items-center justify-center text-6xl">
          {{ props.emoji }}
        </div>
        <UBadge
          :color="difficultyColor"
          class="absolute top-2 right-2 capitalize"
        >
          {{ props.difficulty }}
        </UBadge>
      </div>
    </template>

    <div class="space-y-3">
      <div>
        <h3 class="text-lg font-semibold text-stone-900 mb-1">
          {{ props.name }}
        </h3>
        <p class="text-sm text-stone-600">
          {{ props.description }}
        </p>
      </div>

      <div class="flex items-center gap-4 text-sm text-stone-600">
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-clock" />
          <span>{{ props.time }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-user-group" />
          <span>{{ props.servings }}</span>
        </div>
      </div>

      <div class="flex items-center justify-between pt-2 border-t border-stone-200">
        <UBadge color="secondary" variant="solid">
          {{ props.category }}
        </UBadge>
        <div class="flex items-center gap-2">
          <UButton
            :icon="props.isCooked ? 'i-mdi-pot-steam-outline' : 'i-mdi-pot-outline'"
            :color="props.isCooked ? 'success' : 'neutral'"
            variant="ghost"
            size="sm"
            :aria-pressed="props.isCooked"
            aria-label="Toggle cooked"
            @click="onCooked"
          />
          <UButton
            :icon="props.isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
            color="error"
            variant="ghost"
            size="sm"
            :aria-pressed="props.isFavorite"
            aria-label="Toggle favorite"
            @click="onFavorite"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>
