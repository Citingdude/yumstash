<script setup lang="ts">
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
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer>
      <UButton
        color="neutral"
        variant="outline"
        @click="onCancel"
      >
        {{ props.cancelLabel }}
      </UButton>
      <UButton
        :color="props.confirmColor"
        @click="onConfirm"
      >
        {{ props.confirmLabel }}
      </UButton>
    </template>
  </UModal>
</template>
