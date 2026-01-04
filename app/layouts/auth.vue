<template>
  <div class="relative min-h-screen bg-linear-to-br from-stone-900 via-stone-800 to-red-800 text-white">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -left-16 top-24 h-64 w-64 rounded-full bg-red-600/40 blur-3xl" aria-hidden="true" />
      <div class="absolute bottom-12 right-6 h-72 w-72 rounded-full bg-yellow-500/30 blur-3xl" aria-hidden="true" />
      <div class="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-white/20 via-transparent" aria-hidden="true" />
    </div>

    <div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
      <div class="w-full max-w-6xl">
        <slot />
      </div>
    </div>
  </div>
</template>
