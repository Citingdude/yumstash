<script setup lang="ts">
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'

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
  <dl class="grid grid-cols-1 divide-y divide-default rounded-2xl border border-default bg-default sm:grid-cols-3 sm:divide-x sm:divide-y-0">
    <div class="flex items-center gap-4 p-5 sm:p-6">
      <UIcon name="i-heroicons-clock" class="size-6 shrink-0 text-primary" />
      <div>
        <dt class="text-xs font-medium uppercase tracking-wider text-muted">
          Total time
        </dt>
        <dd class="mt-1 text-lg font-semibold text-highlighted">
          {{ recipe.time }} <span class="text-sm font-normal text-muted">min</span>
        </dd>
      </div>
    </div>
    <div class="flex items-center gap-4 p-5 sm:p-6">
      <UIcon name="i-heroicons-user-group" class="size-6 shrink-0 text-primary" />
      <div class="min-w-0">
        <dt class="text-xs font-medium uppercase tracking-wider text-muted">
          Servings
        </dt>
        <dd class="mt-1 text-lg font-semibold text-highlighted break-words">
          {{ recipe.servings || 'Not specified' }}
        </dd>
      </div>
    </div>
    <div class="flex items-center gap-4 p-5 sm:p-6">
      <UIcon :name="difficultyConfig?.icon || 'i-heroicons-star'" class="size-6 shrink-0 text-primary" />
      <div>
        <dt class="text-xs font-medium uppercase tracking-wider text-muted">
          Difficulty
        </dt>
        <dd class="mt-1">
          <UBadge v-if="difficultyConfig" :color="difficultyConfig.color" variant="subtle" class="rounded-full">
            {{ difficultyConfig.label }}
          </UBadge>
          <span v-else class="text-sm text-muted">Not specified</span>
        </dd>
      </div>
    </div>
  </dl>
</template>
