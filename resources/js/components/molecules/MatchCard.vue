<script setup>
import BaseBadge from '@/components/atoms/BaseBadge.vue';

defineProps({
  match: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const copyMatch = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {}
};
</script>

<template>
  <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs font-medium text-surface-500 dark:text-surface-400">
            Match #{{ index + 1 }}
          </span>
          <span class="text-xs text-surface-400 dark:text-surface-500">
            Índice: {{ match.index }}
          </span>
        </div>
        <code class="block text-sm font-mono text-surface-900 dark:text-surface-100 break-all bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-lg">
          {{ match.fullMatch }}
        </code>

        <div v-if="match.groups && match.groups.length > 0" class="mt-3 space-y-1.5">
          <span class="text-xs font-medium text-surface-500 dark:text-surface-400">
            Grupos capturados:
          </span>
          <div v-for="(group, gIdx) in match.groups" :key="gIdx" class="flex items-center gap-2">
            <BaseBadge variant="info" size="sm">
              Grupo {{ gIdx + 1 }}
            </BaseBadge>
            <code class="text-sm font-mono text-emerald-600 dark:text-emerald-400">
              {{ group || '(vacío)' }}
            </code>
          </div>
        </div>

        <div v-if="match.namedGroups && Object.keys(match.namedGroups).length > 0" class="mt-2 space-y-1">
          <span class="text-xs font-medium text-surface-500 dark:text-surface-400">
            Grupos nombrados:
          </span>
          <div v-for="(value, name) in match.namedGroups" :key="name" class="flex items-center gap-2">
            <BaseBadge variant="success" size="sm">
              {{ name }}
            </BaseBadge>
            <code class="text-sm font-mono text-emerald-600 dark:text-emerald-400">
              {{ value || '(vacío)' }}
            </code>
          </div>
        </div>
      </div>
      <button
        class="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
        title="Copiar match"
        @click="copyMatch(match.fullMatch)"
      >
        <svg class="w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H6a2 2 0 00-2 2v2m0 8v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2" />
        </svg>
      </button>
    </div>
  </div>
</template>