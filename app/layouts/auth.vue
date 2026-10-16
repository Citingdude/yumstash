<template>
  <main class="min-h-screen bg-muted/40 px-4 py-8 sm:py-12">
    <div class="mx-auto w-full max-w-lg">
      <div class="mb-8 flex items-center justify-between px-2">
        <NuxtLink to="/" aria-label="Yumstash home" class="rounded-lg focus-visible:outline-2 focus-visible:outline-primary">
          <AppLogo />
        </NuxtLink>
        <UColorModeButton />
      </div>
      <slot />
      <p class="mt-6 text-center text-xs text-muted">
        A home for everything you love to cook.
      </p>
    </div>
  </main>
</template>
