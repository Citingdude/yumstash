<script setup lang="ts">
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'

const props = defineProps<{
  recipe: RecipeWithRelations
}>()
</script>

<template>
  <aside aria-labelledby="recipe-details-title" class="self-start rounded-3xl border border-default bg-default p-6 lg:sticky lg:top-24">
    <h2 id="recipe-details-title" class="mb-5 text-sm font-semibold text-highlighted">
      About this recipe
    </h2>
    <dl class="space-y-5">
      <div class="flex items-start gap-3">
        <UIcon name="i-heroicons-tag" class="mt-0.5 size-5 shrink-0 text-muted" />
        <div class="min-w-0">
          <dt class="text-xs text-muted">
            Category
          </dt>
          <dd class="mt-1 text-sm font-medium text-highlighted capitalize break-words">
            {{ props.recipe.category?.name || 'Uncategorized' }}
          </dd>
        </div>
      </div>
      <div class="flex items-start gap-3 border-t border-default pt-5">
        <UIcon name="i-heroicons-user-circle" class="mt-0.5 size-5 shrink-0 text-muted" />
        <div class="min-w-0">
          <dt class="text-xs text-muted">
            Added by
          </dt>
          <dd class="mt-1 text-sm font-medium text-highlighted break-words">
            {{ props.recipe.author?.name || 'Unknown author' }}
          </dd>
        </div>
      </div>
    </dl>
    <div class="mt-6 rounded-xl bg-primary/5 p-4 print:hidden">
      <UIcon name="i-mdi-chef-hat" class="mb-2 size-6 text-primary" />
      <p class="text-sm font-medium text-highlighted">
        {{ recipe.isCooked ? 'One to make again' : 'Ready when you are' }}
      </p>
      <p class="mt-1 text-xs leading-5 text-muted">
        {{ recipe.isCooked ? 'You’ve made this recipe before. Keep it handy for your next meal.' : 'Made this recipe? Mark it as cooked to keep track of what you’ve tried.' }}
      </p>
    </div>
  </aside>
</template>
