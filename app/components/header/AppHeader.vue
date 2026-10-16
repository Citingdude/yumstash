<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useAppToast } from '~/composables/toast/useAppToast.composable'
import { AuthService } from '~/features/auth/services/auth.service'

const emit = defineEmits<{
  addRecipe: []
}>()

const toast = useAppToast()
const route = useRoute()
const commandPaletteOpen = useState<boolean>('command-palette-open', () => false)
const isLoggingOut = ref(false)
const isCookbookRoute = computed(() => route.path === '/' || route.path.startsWith('/recipes/'))

function onAddRecipe(): void {
  emit('addRecipe')
}

async function logout(): Promise<void> {
  if (isLoggingOut.value)
    return

  isLoggingOut.value = true
  try {
    await AuthService.logout()
    await navigateTo('/login')
  }
  catch {
    toast.error({
      title: 'Logout failed',
    })
  }
  finally {
    isLoggingOut.value = false
  }
}

const userMenuItems = computed<DropdownMenuItem[][]>(() => [
  [{
    label: 'Your kitchen',
    type: 'label',
  }, {
    label: 'My cookbook',
    icon: 'i-heroicons-book-open',
    to: '/',
  }, {
    label: 'Quick actions',
    icon: 'i-heroicons-command-line',
    onSelect: () => {
      commandPaletteOpen.value = true
    },
  }],
  [{
    label: isLoggingOut.value ? 'Signing out…' : 'Sign out',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    disabled: isLoggingOut.value,
    onSelect: logout,
  }],
])
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-default bg-default/90 backdrop-blur-xl">
    <div class="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
      <div class="flex min-w-0 items-center gap-8">
        <NuxtLink to="/" aria-label="Yumstash home" class="shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <AppLogo class="[&_img]:h-7 [&_img]:w-auto sm:[&_img]:h-8 dark:[&_img]:brightness-0 dark:[&_img]:invert" />
        </NuxtLink>

        <nav aria-label="Main navigation" class="hidden border-l border-default pl-8 md:block">
          <NuxtLink
            to="/"
            :aria-current="route.path === '/' ? 'page' : undefined"
            class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary"
            :class="isCookbookRoute ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-elevated hover:text-highlighted'"
          >
            <UIcon name="i-heroicons-book-open" class="size-4" />
            My cookbook
          </NuxtLink>
        </nav>
      </div>

      <div class="flex shrink-0 items-center gap-1 sm:gap-2">
        <AppButton
          icon="i-heroicons-command-line"
          color="neutral"
          variant="ghost"
          aria-label="Open quick actions"
          title="Quick actions"
          class="hidden size-10 justify-center rounded-xl lg:inline-flex"
          @click="commandPaletteOpen = true"
        />
        <UColorModeButton class="size-10 justify-center rounded-xl" />

        <AppButton
          icon="i-heroicons-plus"
          color="primary"
          size="lg"
          aria-label="Add recipe"
          class="size-10 justify-center rounded-xl sm:w-auto sm:px-4"
          @click="onAddRecipe"
        >
          <span class="hidden sm:inline">Add recipe</span>
        </AppButton>

        <div class="ml-1 sm:ml-2 sm:border-l sm:border-default sm:pl-3">
          <UDropdownMenu
            :items="userMenuItems"
            :content="{ align: 'end', sideOffset: 12 }"
            :ui="{ content: 'w-52 rounded-2xl p-1.5', item: 'rounded-lg p-2.5', label: 'px-2.5 py-2 text-xs text-muted' }"
          >
            <AppButton
              icon="i-heroicons-user-circle"
              color="neutral"
              variant="soft"
              aria-label="Open account menu"
              :loading="isLoggingOut"
              class="size-10 justify-center rounded-full ring ring-default"
              :ui="{ leadingIcon: 'size-5' }"
            />
          </UDropdownMenu>
        </div>
      </div>
    </div>
  </header>
</template>
