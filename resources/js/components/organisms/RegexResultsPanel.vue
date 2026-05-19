<script setup>
import { computed } from 'vue';
import BaseCard from '@/components/atoms/BaseCard.vue';
import BaseBadge from '@/components/atoms/BaseBadge.vue';
import MatchCard from '@/components/molecules/MatchCard.vue';

const props = defineProps({
  matches: {
    type: Array,
    default: () => [],
  },
  matchCount: {
    type: Number,
    default: 0,
  },
  highlightedText: {
    type: [Array, String],
    default: '',
  },
  replacedString: {
    type: String,
    default: '',
  },
  replaceWith: {
    type: String,
    default: '',
  },
  testString: {
    type: String,
    default: '',
  },
});

const hasReplacement = computed(() => props.replaceWith && props.replaceWith.length > 0);

const renderHighlightedText = () => {
  if (!Array.isArray(props.highlightedText)) {
    return props.highlightedText;
  }

  return props.highlightedText.map((part, idx) => {
    if (part.type === 'match') {
      return `<mark class="regex-highlight">${escapeHtml(part.content)}</mark>`;
    }
    return escapeHtml(part.content);
  }).join('');
};

const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};
</script>

<template>
  <BaseCard padding="md" class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-surface-900 dark:text-surface-100">
        Resultados
      </h3>
      <BaseBadge :variant="matchCount > 0 ? 'success' : 'default'" size="sm">
        {{ matchCount }} coincidencia{{ matchCount !== 1 ? 's' : '' }}
      </BaseBadge>
    </div>

    <div v-if="testString" class="space-y-3">
      <div v-if="matchCount > 0" class="space-y-2">
        <label class="text-xs font-medium text-surface-500 dark:text-surface-400">
          Texto con coincidencias:
        </label>
        <div
          class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 font-mono text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap break-all"
          v-html="renderHighlightedText()"
        />
      </div>

      <div v-if="hasReplacement" class="space-y-2">
        <label class="text-xs font-medium text-surface-500 dark:text-surface-400">
          Resultado del reemplazo:
        </label>
        <div
          class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 font-mono text-sm text-emerald-700 dark:text-emerald-300 whitespace-pre-wrap break-all border border-emerald-200 dark:border-emerald-800"
        >
          {{ replacedString }}
        </div>
      </div>

      <div v-if="matches.length > 0" class="space-y-2 pt-2 border-t border-surface-200 dark:border-surface-700">
        <label class="text-xs font-medium text-surface-500 dark:text-surface-400">
          Coincidencias encontradas:
        </label>
        <div class="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
          <MatchCard
            v-for="(match, index) in matches"
            :key="index"
            :match="match"
            :index="index"
          />
        </div>
      </div>

      <div v-if="matchCount === 0 && testString" class="text-center py-8">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 mb-3">
          <svg class="w-6 h-6 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-sm text-surface-500 dark:text-surface-400">
          No se encontraron coincidencias
        </p>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-sm text-surface-400 dark:text-surface-500">
        Ingresa un texto de prueba para ver los resultados
      </p>
    </div>
  </BaseCard>
</template>