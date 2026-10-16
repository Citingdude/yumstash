<script setup lang="ts">
import type { AppIcon } from '~/types/icon/icon.type'

export interface StatCardProps {
  icon: AppIcon
  title: string
  number: string
}

const props = defineProps<StatCardProps>()
</script>

<template>
  <div class="flex items-center gap-4 rounded-2xl border border-default bg-default px-5 py-4 sm:p-5">
    <div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
      <UIcon :name="props.icon" class="size-5 text-primary" />
    </div>
    <div class="flex flex-1 items-center justify-between gap-3 sm:block">
      <p class="text-xs font-medium text-muted">
        {{ props.title }}
      </p>
      <p class="text-2xl font-semibold tracking-tight text-highlighted sm:mt-1">
        <AppNumberCounter :duration="300" :value="Number.parseInt(props.number)" />
      </p>
    </div>
  </div>
</template>
