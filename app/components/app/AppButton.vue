<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import type { AppIcon } from '~/types/icon/icon.type'

interface AppButtonProps extends ButtonProps {
  icon?: AppIcon
}

const props = defineProps<AppButtonProps>()
</script>

<template>
  <UButton v-bind="props">
    <slot />
  </UButton>
</template>
