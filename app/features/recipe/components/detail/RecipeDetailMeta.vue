<script setup lang="ts">
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'
import RecipeMetaCard from '~/features/recipe/components/meta/RecipeMetaCard.vue'

const props = defineProps<{
  recipe: RecipeWithRelations
}>()

const difficultyConfig = computed(() => {
  if (!props.recipe.difficulty) {
    return null
  }

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
  <ul
    class="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 lg:p-8 border-b border-default"
  >
    <li>
      <RecipeMetaCard
        icon="i-heroicons-clock"
        title="Time"
        :value="recipe.time"
      />
    </li>
    <li>
      <RecipeMetaCard
        icon="i-heroicons-user-group"
        title="Servings"
        :value="recipe.time"
      />
    </li>
    <li>
      <RecipeMetaCard
        :icon="difficultyConfig?.icon || 'i-heroicons-star'"
        title="Difficulty"
      >
        <UBadge
          :color="difficultyConfig?.color"
          variant="subtle"
          size="md"
        >
          {{ difficultyConfig?.label }}
        </UBadge>
      </RecipeMetaCard>
    </li>
  </ul>
</template>
