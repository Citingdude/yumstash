// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  isInEditor: false,
  rules: {
    'node/prefer-global/process': 'off',
    'node/prefer-global/buffer': 'off',
  },
})
