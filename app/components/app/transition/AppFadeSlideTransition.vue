<script setup lang="ts">
defineProps<{
  /** Change this key to transition between versions of the slot content. */
  transitionKey: string | number
}>()
</script>

<template>
  <Transition name="fade-slide" mode="out-in">
    <div :key="transitionKey">
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.fade-slide-leave-active {
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: none;
  }

  .fade-slide-enter-from,
  .fade-slide-leave-to {
    transform: none;
  }
}
</style>
