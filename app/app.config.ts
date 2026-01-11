export default defineAppConfig({
  ui: {
    colors: {
      primary: 'red',
      secondary: 'amber',
      neutral: 'stone',
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
