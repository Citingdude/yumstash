<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description: string
  icon: string
}>()
</script>

<template>
  <section class="relative overflow-hidden rounded-3xl border border-default bg-default shadow-sm">
    <div aria-hidden="true" class="absolute inset-x-0 top-0 h-1 bg-primary" />
    <header class="px-6 pt-8 sm:px-8 sm:pt-10">
      <div class="mb-6 flex size-12 items-center justify-center rounded-2xl bg-primary/10">
        <UIcon :name="icon" class="size-6 text-primary" />
      </div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
        {{ eyebrow }}
      </p>
      <h1 class="text-3xl font-semibold tracking-tight text-highlighted">
        {{ title }}
      </h1>
      <p class="mt-3 text-sm leading-6 text-muted">
        {{ description }}
      </p>
    </header>
    <div class="px-6 py-8 sm:px-8">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="border-t border-default bg-muted/40 px-6 py-5 text-center text-sm text-muted sm:px-8">
      <slot name="footer" />
    </footer>
  </section>
</template>
