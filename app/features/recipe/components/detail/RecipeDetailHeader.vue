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
  printRecipe: []
}>()

const formattedDate = computed<string>(() => {
  if (!props.recipe.createdAt)
    return ''

  return DateUtil.format(props.recipe.createdAt)
})
</script>

<template>
  <header class="relative overflow-hidden rounded-3xl border border-default bg-default">
    <div class="absolute inset-x-0 top-0 h-1 bg-primary" />
    <div class="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-10 lg:p-10">
      <div class="flex size-28 shrink-0 items-center justify-center rounded-3xl bg-primary/10 text-6xl sm:size-36 sm:text-7xl lg:size-44 lg:text-8xl" aria-hidden="true">
        {{ recipe.emoji || '🍽️' }}
      </div>

      <div class="min-w-0 flex-1">
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <UBadge v-if="recipe.category" color="primary" variant="subtle" class="rounded-full capitalize">
            {{ recipe.category.name }}
          </UBadge>
          <UBadge v-if="recipe.isCooked" color="success" variant="subtle" icon="i-heroicons-check" class="rounded-full">
            Cooked before
          </UBadge>
        </div>
        <h1 class="text-3xl font-semibold tracking-tight text-highlighted break-words sm:text-4xl lg:text-5xl lg:leading-tight">
          {{ recipe.name }}
        </h1>
        <p v-if="formattedDate" class="mt-3 text-sm text-muted">
          In your collection since {{ formattedDate }}
        </p>

        <div class="mt-6 flex flex-wrap items-center gap-3 print:hidden">
          <AppButton
            :icon="recipe.isCooked ? 'i-heroicons-check' : 'i-mdi-pot-steam-outline'"
            :color="recipe.isCooked ? 'success' : 'primary'"
            :variant="recipe.isCooked ? 'soft' : 'solid'"
            :loading="props.isTogglingCooked"
            :aria-pressed="recipe.isCooked"
            size="lg"
            class="rounded-xl"
            @click="emit('toggleCooked')"
          >
            {{ recipe.isCooked ? 'Cooked' : 'Mark as cooked' }}
          </AppButton>
          <AppButton
            :icon="recipe.isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
            :color="recipe.isFavorite ? 'primary' : 'neutral'"
            :variant="recipe.isFavorite ? 'soft' : 'outline'"
            :loading="props.isTogglingFavorite"
            :aria-pressed="recipe.isFavorite"
            size="lg"
            class="rounded-xl"
            @click="emit('toggleFavorite')"
          >
            {{ recipe.isFavorite ? 'Favorited' : 'Favorite' }}
          </AppButton>
          <AppButton
            icon="i-heroicons-printer"
            color="neutral"
            variant="outline"
            size="lg"
            class="rounded-xl"
            @click="emit('printRecipe')"
          >
            Print recipe
          </AppButton>
          <AppButton
            icon="i-heroicons-trash"
            color="neutral"
            variant="ghost"
            aria-label="Delete recipe"
            :loading="isDeleting"
            size="lg"
            class="ml-auto rounded-xl"
            @click="emit('deleteRecipe')"
          />
        </div>
      </div>
    </div>
  </header>
</template>
