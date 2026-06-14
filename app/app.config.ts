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
    select: {
      slots: {
        base: 'w-full',
      },
    },
    textarea: {
      slots: {
        root: 'w-full',
      },
    },
    input: {
      slots: {
        root: 'w-full',
      },
    },
  },
})
