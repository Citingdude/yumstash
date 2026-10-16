<script setup lang="ts">
import type { RecipeWithRelations } from '~~/shared/types/recipe/recipe.type'

const props = defineProps<{
  recipe: RecipeWithRelations
}>()
</script>

<template>
  <section aria-labelledby="recipe-content-title" class="min-w-0 rounded-3xl border border-default bg-default p-6 sm:p-8">
    <div class="mb-6 flex items-center gap-3 border-b border-default pb-5">
      <div class="flex size-10 items-center justify-center rounded-xl bg-primary/10">
        <UIcon name="i-heroicons-document-text" class="size-5 text-primary" />
      </div>
      <h2 id="recipe-content-title" class="text-xl font-semibold tracking-tight text-highlighted">
        The recipe
      </h2>
    </div>
    <div v-if="props.recipe.description.trim()" class="recipe-description text-base leading-8 text-toned" v-html="props.recipe.description" />
    <p v-else class="py-6 text-sm text-muted">
      No recipe notes have been added yet.
    </p>
  </section>
</template>

<style scoped>
.recipe-description {
  overflow-wrap: anywhere;
}
.recipe-description :deep(> * + *) {
  margin-top: 1.25rem;
}
.recipe-description :deep(h1),
.recipe-description :deep(h2),
.recipe-description :deep(h3) {
  margin-top: 2rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.recipe-description :deep(ul),
.recipe-description :deep(ol) {
  padding-left: 1.5rem;
}
.recipe-description :deep(ul) { list-style: disc; }
.recipe-description :deep(ol) { list-style: decimal; }
.recipe-description :deep(li + li) { margin-top: 0.5rem; }
.recipe-description :deep(a) { color: var(--ui-primary); text-decoration: underline; }
.recipe-description :deep(img) { max-width: 100%; height: auto; border-radius: 1rem; }
.recipe-description :deep(pre) { overflow-x: auto; }
.recipe-description :deep(blockquote) {
  border-left: 3px solid var(--ui-primary);
  padding-left: 1rem;
  color: var(--ui-text-muted);
}
</style>
