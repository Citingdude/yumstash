<script setup lang="ts">
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'

const props = defineProps<{
  recipe: RecipeWithRelations
}>()

const difficultyConfig = computed(() => {
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
  return difficultyMap[props.recipe.difficulty.name]
})
</script>

<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 lg:p-8 bg-stone-50 border-b border-stone-200"
  >
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
        <UIcon
          :name="difficultyConfig?.icon || 'i-heroicons-star'" class="w-6 h-6 text-red-600"
        />
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
</template>
