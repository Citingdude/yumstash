<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

interface AppNumberCounterProps {
  value: number
  duration?: number
  decimals?: number
  formatter?: (value: number) => string
}

const props = withDefaults(defineProps<AppNumberCounterProps>(), {
  duration: 900,
  decimals: 0,
})

const isClient = import.meta.client
const displayValue = ref<number>(0)

let frameId: number | null = null
let startTime: number | null = null
let startValue: number = 0

const decimals = computed<number>(() => Math.max(0, props.decimals))

const roundedValue = computed<number>(() => {
  const factor = 10 ** decimals.value
  return Math.round(displayValue.value * factor) / factor
})

const formattedValue = computed<string>(() => {
  return props.formatter?.(roundedValue.value) ?? roundedValue.value.toLocaleString(undefined, {
    minimumFractionDigits: decimals.value,
    maximumFractionDigits: decimals.value,
  })
})

function cancelAnimation(): void {
  if (frameId !== null) {
    cancelAnimationFrame(frameId)
    frameId = null
  }
}

function easing(progress: number): number {
  return 1 - (1 - progress) ** 3
}

function step(timestamp: number): void {
  if (startTime === null) {
    startTime = timestamp
  }

  const duration = Math.max(props.duration, 0)
  const elapsed = timestamp - startTime
  const progress = duration === 0 ? 1 : Math.min(elapsed / duration, 1)
  const easedProgress = easing(progress)

  displayValue.value = startValue + (props.value - startValue) * easedProgress

  if (progress < 1) {
    frameId = requestAnimationFrame(step)
    return
  }

  displayValue.value = props.value
  frameId = null
  startTime = null
  startValue = props.value
}

function startAnimation(): void {
  if (!isClient) {
    displayValue.value = props.value
    return
  }

  cancelAnimation()
  startTime = null
  startValue = displayValue.value
  frameId = requestAnimationFrame(step)
}

watch(
  () => props.value,
  () => {
    startAnimation()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  cancelAnimation()
})
</script>

<template>
  <span>
    {{ formattedValue }}
  </span>
</template>
