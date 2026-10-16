<script setup lang="ts">
import AppButton from '~/components/app/AppButton.vue'

export interface ConfirmDialogProps {
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'primary' | 'error' | 'warning' | 'success'
  icon?: string
}

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  title: 'Confirm Action',
  description: 'Are you sure you want to proceed?',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  confirmColor: 'primary',
  icon: 'i-heroicons-exclamation-triangle',
})

const emit = defineEmits<{
  close: [result: boolean]
}>()

async function onConfirm() {
  emit('close', true)
}

function onCancel() {
  emit('close', false)
}
</script>

<template>
  <UModal
    :title="props.title"
    :description="props.description"
    :ui="{ content: 'max-w-md', footer: 'flex-col-reverse sm:flex-row sm:justify-end' }"
    @update:open="(open) => { if (!open) onCancel() }"
  >
    <template #title>
      <span class="mb-5 flex size-12 items-center justify-center rounded-2xl" :class="props.confirmColor === 'error' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'">
        <UIcon :name="props.icon" class="size-6" />
      </span>
      {{ props.title }}
    </template>
    <template #footer>
      <AppButton
        color="neutral"
        variant="outline"
        size="lg"
        class="w-full justify-center rounded-xl sm:w-auto"
        @click="onCancel"
      >
        {{ props.cancelLabel }}
      </AppButton>
      <AppButton
        :color="props.confirmColor"
        size="lg"
        class="w-full justify-center rounded-xl sm:w-auto"
        @click="onConfirm"
      >
        {{ props.confirmLabel }}
      </AppButton>
    </template>
  </UModal>
</template>
