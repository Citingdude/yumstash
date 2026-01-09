import type { Toast } from '@nuxt/ui/runtime/composables/useToast.js'

interface ToastSuccessBody {
  title: string
  description?: string
}

interface ToastErrorBody {
  title: string
  errorMessage?: string
}

interface ToastInfoBody {
  title: string
  description?: string
}

export function useAppToast() {
  const toast = useToast()

  function success(body: ToastSuccessBody): Toast {
    return toast.add({
      title: body.title,
      description: body.description,
      color: 'success',
    })
  }

  function error(body: ToastErrorBody): Toast {
    return toast.add({
      title: body.title,
      description: body.errorMessage,
      color: 'error',
    })
  }

  function info(body: ToastInfoBody): Toast {
    return toast.add({
      title: body.title,
      description: body.description,
      color: 'info',
    })
  }

  return {
    success,
    error,
    info,
  }
}
