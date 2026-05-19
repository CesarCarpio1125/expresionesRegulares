<script setup>
import { ref, computed } from 'vue';
import BaseCard from '@/components/atoms/BaseCard.vue';
import BaseCode from '@/components/atoms/BaseCode.vue';
import RegexExample from '@/components/molecules/RegexExample.vue';
import RegexExplanationItem from '@/components/molecules/RegexExplanationItem.vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  icon: String,
  items: {
    type: Array,
    default: () => [],
  },
  examples: {
    type: Array,
    default: () => [],
  },
  tableData: {
    type: Object,
    default: null,
  },
  content: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
});

const expanded = ref(true);

const iconPaths = {
  rocket: 'M13 10V3L4 14h7v7l9-11h-7z',
  cursor: 'M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z',
  magnifying: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  puzzle: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
  check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  flag: 'M3 21v-7a2 2 0 012-2h14a2 2 0 012 2v7M3 10v11a2 2 0 002 2h14a2 2 0 002-2v-11M3 10h18',
  link: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
  bookmark: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
  lightbulb: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
};
</script>

<template>
  <section
    :id="id"
    class="scroll-mt-24"
  >
    <BaseCard padding="lg">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center gap-4">
          <div v-if="icon" class="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPaths[icon] || iconPaths.rocket" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium text-surface-400">Lección {{ order }}</span>
            </div>
            <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mt-1">
              {{ title }}
            </h2>
          </div>
        </div>
        <button
          class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          @click="expanded = !expanded"
        >
          <svg
            :class="['w-5 h-5 text-surface-500 transition-transform', expanded && 'rotate-180']"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div v-if="description" class="prose prose-surface dark:prose-invert max-w-none mb-6">
        <p>{{ description }}</p>
      </div>

      <div v-show="expanded" class="space-y-6">
        <div v-if="content" class="text-surface-600 dark:text-surface-400 leading-relaxed">
          {{ content }}
        </div>

        <div v-if="items.length > 0" class="grid gap-4">
          <RegexExplanationItem
            v-for="item in items"
            :key="item.symbol"
            v-bind="item"
          />
        </div>

        <div v-if="examples.length > 0" class="space-y-4">
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Ejemplos Interactivos
          </h3>
          <RegexExample
            v-for="(example, idx) in examples"
            :key="idx"
            v-bind="example"
            :expandable="examples.length > 2"
          />
        </div>

        <div v-if="tableData" class="space-y-4">
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Referencia Rápida
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-surface-200 dark:border-surface-700">
                  <th class="text-left py-3 px-4 text-xs font-semibold uppercase text-surface-500">Símbolo</th>
                  <th class="text-left py-3 px-4 text-xs font-semibold uppercase text-surface-500">Nombre</th>
                  <th class="text-left py-3 px-4 text-xs font-semibold uppercase text-surface-500">Descripción</th>
                  <th class="text-left py-3 px-4 text-xs font-semibold uppercase text-surface-500">Ejemplo</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in tableData.rows"
                  :key="row.symbol"
                  class="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50"
                >
                  <td class="py-3 px-4 font-mono text-green-400">{{ row.symbol }}</td>
                  <td class="py-3 px-4 text-surface-900 dark:text-surface-100 font-medium">{{ row.name }}</td>
                  <td class="py-3 px-4 text-surface-600 dark:text-surface-400">{{ row.description }}</td>
                  <td class="py-3 px-4 font-mono text-sm text-surface-500">{{ row.example }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BaseCard>
  </section>
</template>