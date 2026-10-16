<script setup lang="ts">
import type { RecipeDifficultNameEnum } from '~~/shared/types/recipe-difficulty/recipeDifficultyName.enum'
import type { RecipeUuid } from '~~/shared/types/recipe/recipeUuid.type'

export interface RecipeCardProps {
  id: RecipeUuid
  emoji: string
  difficulty: RecipeDifficultNameEnum | null
  name: string
  description: string
  time: number
  servings: string
  category: string | null
  isFavorite: boolean
  isCooked: boolean
}

const props = defineProps<RecipeCardProps>()

const emit = defineEmits<{
  cooked: [
    recipeId: RecipeUuid,
    isCooked: boolean,
  ]
  delete: [
    recipeId: RecipeUuid,
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

function onCooked(): void {
  emit('cooked', props.id, props.isCooked)
}

function onDelete(): void {
  emit('delete', props.id)
}
const preview = computed(() => props.description
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, '\'')
  .replace(/\s+/g, ' ')
  .trim())

const coverClass = computed(() => {
  const colors = ['bg-primary/10', 'bg-amber-500/10', 'bg-emerald-500/10', 'bg-sky-500/10']
  const hash = [...props.id].reduce((sum, character) => sum + character.charCodeAt(0), 0)
  return colors[hash % colors.length]
})
</script>

<template>
  <article class="group flex h-full flex-col overflow-hidden rounded-3xl border border-default bg-default transition-shadow duration-200 hover:shadow-md">
    <NuxtLink :to="{ name: 'recipes-id', params: { id: props.id } }" class="flex flex-1 flex-col rounded-t-3xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary">
      <div :class="coverClass" class="relative m-3 mb-0 flex h-44 shrink-0 items-center justify-center overflow-hidden rounded-2xl">
        <span aria-hidden="true" class="text-7xl motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-110">{{ props.emoji || '🍽️' }}</span>
        <UBadge v-if="props.difficulty" :color="difficultyColor" class="absolute top-3 left-3 rounded-full capitalize" variant="subtle">
          {{ props.difficulty }}
        </UBadge>
        <span v-if="props.isFavorite" class="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-default text-primary" aria-label="Favorite">
          <UIcon name="i-heroicons-heart-solid" class="size-4" />
        </span>
      </div>
      <div class="flex flex-1 flex-col px-5 pt-5 pb-4">
        <p class="mb-2 text-xs font-medium text-primary capitalize">
          {{ props.category || 'Uncategorized' }}
        </p>
        <h3 class="line-clamp-2 text-lg font-semibold leading-7 tracking-tight text-highlighted break-words">
          {{ props.name }}
        </h3>
        <p class="mt-2 line-clamp-2 text-sm leading-6 text-muted break-words">
          {{ preview || 'A little inspiration for your next meal.' }}
        </p>
        <div class="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-xs text-muted">
          <span class="flex items-center gap-1.5">
            <UIcon name="i-heroicons-clock" class="size-4 shrink-0" />
            {{ props.time }} min
          </span>
          <span class="flex min-w-0 items-center gap-1.5" :aria-label="`Servings: ${props.servings || 'Not specified'}`">
            <UIcon name="i-heroicons-user-group" class="size-4 shrink-0" />
            <span class="break-words">{{ props.servings ? `${props.servings} servings` : 'Servings not specified' }}</span>
          </span>
        </div>
      </div>
    </NuxtLink>
    <div class="mx-5 flex items-center justify-between gap-2 border-t border-default py-3">
      <AppButton
        :icon="props.isCooked ? 'i-heroicons-check-circle' : 'i-mdi-pot-steam-outline'"
        :color="props.isCooked ? 'success' : 'neutral'"
        variant="ghost"
        size="sm"
        class="-ml-2 rounded-lg"
        :aria-pressed="props.isCooked"
        :aria-label="`${props.isCooked ? 'Mark as not cooked' : 'Mark as cooked'}: ${props.name}`"
        @click="onCooked"
      >
        {{ props.isCooked ? 'Cooked before' : 'Mark as cooked' }}
      </AppButton>
      <AppButton icon="i-heroicons-trash" color="neutral" variant="ghost" size="sm" class="-mr-2 rounded-lg" :aria-label="`Delete recipe: ${props.name}`" @click="onDelete" />
    </div>
  </article>
</template>
