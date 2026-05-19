<script setup>
defineProps({
  padding: {
    type: String,
    default: 'md',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v),
  },
  hover: Boolean,
});

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};
</script>

<template>
  <div
    :class="[
      'bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800',
      'shadow-soft dark:shadow-soft-dark',
      hover && 'hover:border-surface-300 dark:hover:border-surface-700 transition-colors duration-200',
      paddingClasses[padding],
    ]"
  >
    <slot />
  </div>
</template>