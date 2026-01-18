import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: [
            '**/*.test.ts',
            'app/features/**/*.test.ts',
          ],
          environment: 'node',
        },
      },
    ],
    coverage: {
      enabled: true,
      provider: 'v8',
    },
  },
})
