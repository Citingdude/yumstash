<script setup lang="ts">
import type { CommandPaletteGroup } from '@nuxt/ui'

const open = ref(false)

defineShortcuts({
  meta_k: () => {
    open.value = !open.value
  },
})

const groups: CommandPaletteGroup[] = [
  {
    id: 'navigation',
    label: 'Navigation',
    items: [
      {
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        to: '/',
        onSelect: () => {
          open.value = false
        },
      },
      {
        label: 'Settings',
        icon: 'i-lucide-settings',
        to: '/settings',
        onSelect: () => {
          open.value = false
        },
      },
    ],
  },
]
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <UCommandPalette
        close
        :groups="groups"
        placeholder="Search..."
        class="h-80"
        @update:open="open = $event"
      />
    </template>
  </UModal>
</template>
