<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  flags: {
    type: Array,
    required: true,
  },
  compact: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const activeFlags = computed(() => props.modelValue.split(''));

const isActive = (flag) => activeFlags.value.includes(flag);

const toggle = (flag) => {
  const current = props.modelValue.split('');
  const idx = current.indexOf(flag);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(flag);
  }
  emit('update:modelValue', current.join(''));
};

const getFlagInfo = (flag) => {
  const flagsInfo = {
    g: { label: 'global', description: 'Find all matches', color: 'primary' },
    i: { label: 'case insensitive', description: 'Ignore case', color: 'purple' },
    m: { label: 'multiline', description: '^ and $ match line boundaries', color: 'blue' },
    s: { label: 'dotall', description: '. matches newlines', color: 'green' },
    u: { label: 'unicode', description: 'Enable unicode support', color: 'yellow' },
    y: { label: 'sticky', description: 'Match at lastIndex only', color: 'pink' },
  };
  return flagsInfo[flag] || { label: flag, description: '', color: 'gray' };
};
</script>

<template>
  <div :class="compact ? 'space-y-2' : 'space-y-4'">
    <div :class="compact ? 'flex flex-wrap gap-2' : 'grid grid-cols-2 sm:grid-cols-3 gap-3'">
      <button
        v-for="flag in flags"
        :key="flag"
        :class="[
          'relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200',
          isActive(flag)
            ? 'border-primary-500 bg-primary-500/10 dark:bg-primary-500/20'
            : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600',
        ]"
        @click="toggle(flag)"
      >
        <div
          :class="[
            'w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-lg',
            isActive(flag)
              ? 'bg-primary-500 text-white'
              : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400',
          ]"
        >
          {{ flag }}
        </div>
        <div class="text-left">
          <div
            :class="[
              'font-medium text-sm',
              isActive(flag)
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-surface-700 dark:text-surface-300',
            ]"
          >
            {{ getFlagInfo(flag).label }}
          </div>
          <div v-if="!compact" class="text-xs text-surface-500 mt-0.5">
            {{ getFlagInfo(flag).description }}
          </div>
        </div>
        <svg
          v-if="isActive(flag)"
          class="absolute -top-1 -right-1 w-5 h-5 text-primary-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>