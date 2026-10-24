---
name: vue-named-event-handlers
description: Apply this repository's named event handler convention when creating or editing Vue templates, especially inline assignments, toggles, and other event logic.
---

# Vue named event handlers

Keep event behavior in named functions inside `<script setup lang="ts">`. Bind template events to those handlers instead of writing assignments, toggles, or other action logic inline. Apply this convention to new and changed event bindings; avoid unrelated repository-wide rewrites unless requested.

- Name handlers with `on` followed by the action, such as `onClearSearch`, `onClearCategory`, or `onToggleFavorites`.
- Use function declarations with descriptive names, including for one-line actions.
- Access refs with `.value` in script; retain existing state ownership and component contracts.
- Bind handlers directly when no explicit arguments are needed: `@click="onClearSearch"`.
- When an action needs item-specific arguments, keep only the named handler call in the template, such as `@click="onDeleteRecipe(recipe.id)"`. Put the behavior in the handler.
- Keep Vue event modifiers such as `.stop` and `.prevent` on the binding when appropriate.
- Keep normal `v-model` bindings; this convention does not require replacing them with manual event handlers.

Instead of:

```vue
<template>
  <AppButton @click="query = ''">
    Clear search
  </AppButton>
</template>
```

Use:

```vue
<script setup lang="ts">
const query = defineModel<string>('query')

function onClearSearch() {
  query.value = ''
}
</script>

<template>
  <AppButton @click="onClearSearch">
    Clear search
  </AppButton>
</template>
```

Before finishing a Vue change, inspect affected event bindings and extract any inline action logic into named handlers without changing behavior.
