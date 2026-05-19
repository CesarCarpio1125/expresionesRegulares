<script setup>
import BaseBadge from '@/components/atoms/BaseBadge.vue';

defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const getTypeColor = (type) => {
  const colors = {
    digit: 'info',
    'non-digit': 'warning',
    word: 'success',
    'non-word': 'error',
    whitespace: 'info',
    'non-whitespace': 'warning',
    boundary: 'primary',
    'non-boundary': 'primary',
    newline: 'default',
    tab: 'default',
    return: 'default',
    start: 'primary',
    end: 'primary',
    any: 'warning',
    'zero-plus': 'success',
    'one-plus': 'success',
    optional: 'info',
    or: 'warning',
    quantifier: 'success',
    'group-start': 'primary',
    'group-end': 'primary',
    'char-class-start': 'info',
    'char-class-end': 'info',
    escape: 'error',
    literal: 'default',
  };
  return colors[type] || 'default';
};
</script>

<template>
  <div class="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
    <code class="font-mono text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded min-w-[60px] text-center">
      {{ item.token }}
    </code>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-0.5">
        <BaseBadge :variant="getTypeColor(item.type)" size="sm">
          {{ item.label }}
        </BaseBadge>
      </div>
      <p class="text-xs text-surface-500 dark:text-surface-400">
        {{ item.description }}
      </p>
    </div>
  </div>
</template>