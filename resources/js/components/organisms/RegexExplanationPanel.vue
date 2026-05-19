<script setup>
import { computed } from 'vue';
import BaseCard from '@/components/atoms/BaseCard.vue';
import BaseBadge from '@/components/atoms/BaseBadge.vue';
import ExplanationItem from '@/components/molecules/ExplanationItem.vue';

const props = defineProps({
  pattern: {
    type: String,
    default: '',
  },
  explanation: {
    type: Array,
    default: () => [],
  },
  summary: {
    type: String,
    default: '',
  },
});

const tokenCount = computed(() => props.explanation.length);
const literalCount = computed(() => props.explanation.filter(t => t.type === 'literal').length);
const specialCount = computed(() => props.explanation.filter(t => t.type !== 'literal').length);
</script>

<template>
  <BaseCard padding="md" class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-surface-900 dark:text-surface-100">
        Explicación
      </h3>
      <div class="flex gap-2">
        <BaseBadge v-if="tokenCount > 0" variant="primary" size="sm">
          {{ tokenCount }} token{{ tokenCount !== 1 ? 's' : '' }}
        </BaseBadge>
      </div>
    </div>

    <div v-if="pattern && explanation.length > 0" class="space-y-3">
      <div v-if="summary" class="flex items-center gap-2 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
        <svg class="w-5 h-5 text-primary-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm text-primary-700 dark:text-primary-300">{{ summary }}</span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="flex items-center gap-1.5 p-2 rounded-lg bg-surface-50 dark:bg-surface-800/50">
          <span class="w-2 h-2 rounded-full bg-primary-500"></span>
          <span class="text-surface-600 dark:text-surface-400">{{ specialCount }} especial{{ specialCount !== 1 ? 'es' : '' }}</span>
        </div>
        <div class="flex items-center gap-1.5 p-2 rounded-lg bg-surface-50 dark:bg-surface-800/50">
          <span class="w-2 h-2 rounded-full bg-surface-400"></span>
          <span class="text-surface-600 dark:text-surface-400">{{ literalCount }} literal{{ literalCount !== 1 ? 'es' : '' }}</span>
        </div>
      </div>

      <div class="border-t border-surface-200 dark:border-surface-700 pt-3">
        <label class="text-xs font-medium text-surface-500 dark:text-surface-400 mb-2 block">
          Desglose:
        </label>
        <div class="space-y-1 max-h-[300px] overflow-y-auto scrollbar-thin">
          <ExplanationItem
            v-for="(item, index) in explanation"
            :key="index"
            :item="item"
          />
        </div>
      </div>
    </div>

    <div v-else-if="pattern" class="text-center py-8">
      <p class="text-sm text-surface-400 dark:text-surface-500">
        Patrón demasiado simple para explicar
      </p>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-sm text-surface-400 dark:text-surface-500">
        Ingresa una expresión regular para ver la explicación
      </p>
    </div>
  </BaseCard>
</template>