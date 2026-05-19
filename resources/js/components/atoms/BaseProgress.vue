<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    default: 0,
    validator: (v) => v >= 0 && v <= 100,
  },
  max: {
    type: Number,
    default: 100,
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'success', 'warning', 'error'].includes(v),
  },
  animated: Boolean,
  trackClass: String,
});

const percentage = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)));

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const variantClasses = {
  primary: 'bg-primary-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};
</script>

<template>
  <div class="w-full">
    <div
      v-if="showLabel"
      class="flex items-center justify-between mb-2"
    >
      <span class="text-sm font-medium text-surface-700 dark:text-surface-300">
        <slot>Progress</slot>
      </span>
      <span class="text-sm text-surface-500 dark:text-surface-400">
        {{ Math.round(percentage) }}%
      </span>
    </div>
    <div
      :class="[
        'w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden',
        sizeClasses[size],
        trackClass,
      ]"
    >
      <div
        :class="[
          'h-full rounded-full transition-all duration-500 ease-out',
          variantClasses[variant],
          animated && 'animate-pulse',
        ]"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>