<script setup lang="ts">
const props = defineProps<{
  icon: string
  title: string
  value?: string
}>()
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="p-3 bg-accented rounded-xl shadow-sm">
      <UIcon
        :name="props.icon"
        class="w-6 h-6 text-primary"
      />
    </div>
    <div>
      <p class="text-sm font-medium text-muted">
        {{ props.title }}
      </p>
      <slot>
        <p class="text-lg font-semibold">
          {{ props.value }}
        </p>
      </slot>
    </div>
  </div>
</template>
