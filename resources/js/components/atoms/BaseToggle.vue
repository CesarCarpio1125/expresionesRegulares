<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  label: String,
  description: String,
  disabled: Boolean,
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const sizeClasses = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 'translate-x-4',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translate: 'translate-x-7',
  },
};

const toggle = () => {
  if (props.disabled) return;
  emit('update:modelValue', !props.modelValue);
  emit('change', !props.modelValue);
};
</script>

<template>
  <label
    :class="[
      'inline-flex items-center gap-3 cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed',
    ]"
  >
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      :class="[
        'relative inline-flex shrink-0 rounded-full transition-colors duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900',
        modelValue ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600',
        sizeClasses[size].track,
      ]"
      @click="toggle"
    >
      <span
        :class="[
          'pointer-events-none inline-block rounded-full bg-white shadow-transform transition-transform duration-200 ease-in-out',
          sizeClasses[size].thumb,
          modelValue ? sizeClasses[size].translate : 'translate-x-0.5',
        ]"
      />
    </button>
    <span v-if="label || $slots.default" class="flex flex-col">
      <span class="text-sm font-medium text-surface-900 dark:text-surface-100">
        {{ label }}
      </span>
      <span v-if="description" class="text-xs text-surface-500 dark:text-surface-400">
        {{ description }}
      </span>
      <slot />
    </span>
  </label>
</template>