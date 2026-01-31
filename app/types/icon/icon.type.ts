// Commonly used Heroicons with autocomplete
export type AppIcon
  // Actions
  = | 'i-heroicons-arrow-left'
    | 'i-heroicons-arrow-right'
    | 'i-heroicons-arrow-up'
    | 'i-heroicons-arrow-down'
    | 'i-heroicons-plus'
    | 'i-heroicons-minus'
    | 'i-heroicons-x-mark'
    | 'i-heroicons-check'
    | 'i-heroicons-check-circle'
    | 'i-heroicons-check-circle-solid'
    | 'i-heroicons-pencil'
    | 'i-heroicons-pencil-square'
    | 'i-heroicons-trash'
    | 'i-heroicons-ellipsis-vertical'
    | 'i-heroicons-ellipsis-horizontal'

  // Navigation
    | 'i-heroicons-chevron-left'
    | 'i-heroicons-chevron-right'
    | 'i-heroicons-chevron-up'
    | 'i-heroicons-chevron-down'
    | 'i-heroicons-bars-3'

  // Content
    | 'i-heroicons-heart'
    | 'i-heroicons-heart-solid'
    | 'i-heroicons-bookmark'
    | 'i-heroicons-bookmark-solid'
    | 'i-heroicons-star'
    | 'i-heroicons-star-solid'

  // User & Account
    | 'i-heroicons-user'
    | 'i-heroicons-user-circle'
    | 'i-heroicons-user-group'
    | 'i-heroicons-arrow-right-on-rectangle'
    | 'i-heroicons-arrow-left-on-rectangle'

  // Information
    | 'i-heroicons-exclamation-circle'
    | 'i-heroicons-exclamation-triangle'
    | 'i-heroicons-information-circle'
    | 'i-heroicons-question-mark-circle'

  // Recipe specific
    | 'i-heroicons-clock'
    | 'i-heroicons-fire'
    | 'i-heroicons-bolt'
    | 'i-heroicons-beaker'

  // UI Elements
    | 'i-heroicons-magnifying-glass'
    | 'i-heroicons-funnel'
    | 'i-heroicons-adjustments-horizontal'
    | 'i-heroicons-document-text'
    | 'i-heroicons-tag'
    | 'i-heroicons-cog-6-tooth'
    | 'i-heroicons-bell'
    | 'i-heroicons-bell-solid'

  // Status
    | 'i-heroicons-eye'
    | 'i-heroicons-eye-slash'
    | 'i-heroicons-lock-closed'
    | 'i-heroicons-lock-open'

  // MDI Icons - Material Design Icons
    | 'i-mdi-pot'
    | 'i-mdi-pot-outline'
    | 'i-mdi-pot-steam'
    | 'i-mdi-pot-steam-outline'
    | 'i-mdi-chef-hat'
    | 'i-mdi-silverware-fork-knife'
    | 'i-mdi-food'
    | 'i-mdi-food-variant'

  // Allow any other heroicon or mdi icon (fallback without autocomplete)
    | (string & {})
