export default defineAppConfig({
  icon: {
    mode: 'svg',
  },
  ui: {
    colors: {
      primary: 'red',
      secondary: 'amber',
      neutral: 'zinc',
    },
    modal: {
      slots: {
        overlay: 'bg-neutral-950/50 backdrop-blur-sm',
        content: 'rounded-3xl shadow-xl',
        header: 'p-6 sm:p-8',
        title: 'text-xl font-semibold tracking-tight text-highlighted',
        description: 'mt-2 text-sm leading-6 text-muted',
        body: 'p-6 sm:p-8',
        footer: 'gap-3 bg-muted/40 p-6 sm:px-8',
        close: 'top-5 end-5 rounded-full',
      },
    },
    select: {
      slots: {
        base: 'w-full rounded-xl',
      },
    },
    textarea: {
      slots: {
        base: 'rounded-xl',
        root: 'w-full',
      },
    },
    input: {
      slots: {
        base: 'rounded-xl',
        root: 'w-full',
      },
    },
  },
})
