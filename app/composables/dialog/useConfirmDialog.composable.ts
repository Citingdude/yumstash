import type { ConfirmDialogProps } from '~/components/dialog/ConfirmDialog.vue'

interface ConfirmDialogOptions extends Omit<ConfirmDialogProps, 'isOpen'> {
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

interface UseConfirmDialogReturn {
  isOpen: Ref<boolean>
  options: Ref<ConfirmDialogOptions>
  open: (options: ConfirmDialogOptions) => void
  close: () => void
  confirm: () => Promise<void>
  cancel: () => void
}

export function useConfirmDialog(): UseConfirmDialogReturn {
  const isOpen = ref(false)
  const options = ref<ConfirmDialogOptions>({})

  function open(dialogOptions: ConfirmDialogOptions) {
    options.value = dialogOptions
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  async function confirm() {
    if (options.value.onConfirm) {
      await options.value.onConfirm()
    }
    close()
  }

  function cancel() {
    if (options.value.onCancel) {
      options.value.onCancel()
    }
    close()
  }

  return {
    isOpen,
    options,
    open,
    close,
    confirm,
    cancel,
  }
}
