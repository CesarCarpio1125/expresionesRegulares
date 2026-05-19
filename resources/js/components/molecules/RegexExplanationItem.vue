<script setup>
defineProps({
  symbol: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  example: {
    type: String,
    default: '',
  },
  result: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'metacharacter',
    validator: (v) => ['metacharacter', 'quantifier', 'anchor', 'class', 'sequence', 'group', 'flag'].includes(v),
  },
  expandable: Boolean,
});

const typeColors = {
  metacharacter: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
  quantifier: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
  anchor: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
  class: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
  sequence: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
  group: 'bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/30',
  flag: 'bg-primary-500/20 text-primary-600 dark:text-primary-400 border-primary-500/30',
};
</script>

<template>
  <div class="group">
    <div class="flex items-start gap-4 p-4 rounded-xl border border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 transition-all duration-200">
      <div
        :class="[
          'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-bold',
          typeColors[type],
        ]"
      >
        {{ symbol }}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h4 class="font-semibold text-surface-900 dark:text-surface-100">
            {{ name }}
          </h4>
          <span
            :class="[
              'px-2 py-0.5 text-xs font-medium rounded-full',
              typeColors[type],
            ]"
          >
            {{ type }}
          </span>
        </div>
        <p class="text-sm text-surface-600 dark:text-surface-400">
          {{ description }}
        </p>
        <div v-if="example" class="mt-3 flex flex-wrap items-center gap-3">
          <code class="px-2 py-1 text-sm font-mono rounded bg-surface-900 text-green-400">
            {{ example }}
          </code>
          <span class="text-surface-500">→</span>
          <code
            v-if="result"
            class="px-2 py-1 text-sm font-mono rounded bg-primary-500/20 text-primary-400"
          >
            {{ result }}
          </code>
        </div>
      </div>
    </div>
  </div>
</template>