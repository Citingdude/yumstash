<script setup lang="ts">
import type { CommandPaletteGroup } from '@nuxt/ui'

const colorMode = useColorMode()

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
        icon: 'i-heroicons-squares-2x2',
        to: '/',
        onSelect: () => {
          open.value = false
        },
      },
    ],
  },
  {
    id: 'color-mode',
    label: 'Color mode',
    items: [
      {
        label: 'System',
        icon: 'i-heroicons-computer-desktop',
        onSelect: () => {
          colorMode.preference = 'system'
          open.value = false
        },
      },
      {
        label: 'Light',
        icon: 'i-heroicons-sun',
        onSelect: () => {
          colorMode.preference = 'light'
          open.value = false
        },
      },
      {
        label: 'Dark',
        icon: 'i-heroicons-moon',
        onSelect: () => {
          colorMode.preference = 'dark'
          open.value = false
        },
      },
    ],
  },
]
</script>

<template>
  <UModal v-model:open="open" title="Quick actions" description="Find a page or change your appearance." :ui="{ content: 'max-w-xl' }">
    <template #content>
      <UCommandPalette
        close
        :groups="groups"
        placeholder="Where would you like to go?"
        class="h-80"
        :ui="{ input: 'text-base' }"
        @update:open="open = $event"
      />
    </template>
  </UModal>
</template>
