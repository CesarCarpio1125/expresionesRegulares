<script setup>
import BaseCard from '@/components/atoms/BaseCard.vue';

defineProps({
  example: {
    type: Object,
    required: true,
  },
});

defineEmits(['select']);

const copyPattern = async (pattern) => {
  try {
    await navigator.clipboard.writeText(pattern);
  } catch {}
};
</script>

<template>
  <BaseCard
    hover
    class="cursor-pointer group"
    @click="$emit('select', example)"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-1">
          {{ example.name }}
        </h3>
        <p class="text-xs text-surface-500 dark:text-surface-400 mb-2 line-clamp-2">
          {{ example.description }}
        </p>
        <code class="text-xs font-mono text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">
          {{ example.pattern }}
        </code>
      </div>
      <button
        class="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
        title="Copiar"
        @click.stop="copyPattern(example.pattern)"
      >
        <svg class="w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H6a2 2 0 00-2 2v2m0 8v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2" />
        </svg>
      </button>
    </div>
  </BaseCard>
</template>