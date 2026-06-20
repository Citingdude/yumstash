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
  favorite: [
    recipeId: RecipeUuid,
    isFavorite: boolean,
  ]
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

function onFavorite(): void {
  emit('favorite', props.id, props.isFavorite)
}

function onCooked(): void {
  emit('cooked', props.id, props.isCooked)
}

function onDelete(): void {
  emit('delete', props.id)
}
</script>

<template>
  <NuxtLink
    class="group"
    :to="{
      name: 'recipes-id',
      params: {
        id: props.id,
      },
    }"
  >
    <UCard
      class="group-hover:shadow-xl group-hover:-translate-y-2 transition-all cursor-pointer"
      variant="soft"
      :ui="{
        body: 'border-none',
      }"
    >
      <template #header>
        <div class="relative">
          <div class="w-full h-48 bg-elevated rounded-lg flex items-center justify-center text-6xl">
            {{ props.emoji }}
          </div>
          <UBadge
            :color="difficultyColor"
            class="absolute top-2 right-2 capitalize"
            variant="soft"
          >
            {{ props.difficulty }}
          </UBadge>
        </div>
      </template>

      <div class="space-y-3">
        <div>
          <h3 class="text-lg font-semibold text-highlighted mb-1">
            {{ props.name }}
          </h3>
          <p class="text-sm">
            {{ props.description }}
          </p>
        </div>

        <div class="flex items-center gap-4 text-sm text-muted">
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-clock" />
            <span>{{ props.time }}</span>
          </div>
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-user-group" />
            <span>{{ props.servings }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-default">
          <UBadge color="secondary" variant="outline">
            {{ props.category }}
          </UBadge>
          <div class="flex items-center gap-2">
            <AppButton
              :icon="props.isCooked ? 'i-mdi-pot-steam-outline' : 'i-mdi-pot-outline'"
              color="primary"
              variant="ghost"
              size="sm"
              :aria-pressed="props.isCooked"
              aria-label="Toggle cooked"
              @click.prevent="onCooked"
            />
            <AppButton
              :icon="props.isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
              color="primary"
              variant="ghost"
              size="sm"
              :aria-pressed="props.isFavorite"
              aria-label="Toggle favorite"
              @click.prevent="onFavorite"
            />
            <AppButton
              icon="i-heroicons-trash"
              color="primary"
              variant="ghost"
              size="sm"
              aria-label="Delete recipe"
              @click.prevent="onDelete"
            />
          </div>
        </div>
      </div>
    </UCard>
  </NuxtLink>
</template>
