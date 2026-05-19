<script setup>
import { ref, computed, watch } from 'vue';
import BaseCode from '@/components/atoms/BaseCode.vue';

const props = defineProps({
  pattern: {
    type: String,
    required: true,
  },
  testString: {
    type: String,
    required: true,
  },
  flags: {
    type: String,
    default: 'g',
  },
  title: String,
  description: String,
  expandable: {
    type: Boolean,
    default: false,
  },
});

const localPattern = ref(props.pattern);
const localTestString = ref(props.testString);
const localFlags = ref(props.flags);
const expanded = ref(!props.expandable);

const regex = computed(() => {
  try {
    return new RegExp(localPattern.value, localFlags.value);
  } catch {
    return null;
  }
});

const matches = computed(() => {
  if (!regex.value || !localTestString.value) return [];
  const results = [];
  let match;
  while ((match = regex.value.exec(localTestString.value)) !== null) {
    results.push({
      text: match[0],
      index: match.index,
    });
    if (match[0].length === 0) regex.value.lastIndex++;
  }
  return results;
});

const highlightedParts = computed(() => {
  if (!matches.value.length || !localTestString.value) {
    return [{ type: 'text', content: localTestString.value }];
  }
  const parts = [];
  let lastIndex = 0;
  for (const match of matches.value) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: localTestString.value.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'match', content: match.text, index: match.index });
    lastIndex = match.index + match.text.length;
  }
  if (lastIndex < localTestString.value.length) {
    parts.push({ type: 'text', content: localTestString.value.slice(lastIndex) });
  }
  return parts;
});

const matchCount = computed(() => matches.value.length);
const hasError = computed(() => !regex.value && localPattern.value.length > 0);
</script>

<template>
  <div class="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
    <div
      v-if="title || expandable"
      class="flex items-center justify-between px-4 py-3 bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-700"
    >
      <div class="flex items-center gap-2">
        <span v-if="title" class="font-medium text-surface-900 dark:text-surface-100">
          {{ title }}
        </span>
        <span
          v-if="!expandable && matchCount > 0"
          class="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
        >
          {{ matchCount }} match{{ matchCount !== 1 ? 'es' : '' }}
        </span>
      </div>
      <button
        v-if="expandable"
        class="p-1 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
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

    <div v-show="!expandable || expanded" class="p-4 space-y-4">
      <div v-if="description" class="text-sm text-surface-600 dark:text-surface-400">
        {{ description }}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-xs font-medium text-surface-500 uppercase tracking-wider">Pattern</label>
          <input
            v-model="localPattern"
            type="text"
            class="w-full px-3 py-2 font-mono text-sm rounded-lg bg-surface-900 text-green-400 border border-surface-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
            placeholder="Enter regex..."
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-medium text-surface-500 uppercase tracking-wider">Flags</label>
          <input
            v-model="localFlags"
            type="text"
            class="w-full px-3 py-2 font-mono text-sm rounded-lg bg-surface-900 text-yellow-400 border border-surface-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
            placeholder="g"
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-medium text-surface-500 uppercase tracking-wider">Test String</label>
        <input
          v-model="localTestString"
          type="text"
          class="w-full px-3 py-2 font-mono text-sm rounded-lg bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-700 text-surface-900 dark:text-surface-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
          placeholder="Enter test text..."
        />
      </div>

      <div class="space-y-2">
        <label class="text-xs font-medium text-surface-500 uppercase tracking-wider">Result</label>
        <div
          class="p-4 min-h-[60px] rounded-lg font-mono text-sm break-all leading-relaxed"
          :class="hasError ? 'bg-red-500/10 text-red-500' : 'bg-surface-900 text-surface-100'"
        >
          <template v-if="hasError">
            Invalid regex
          </template>
          <template v-else-if="matches.length === 0">
            <span class="text-surface-500">No matches</span>
          </template>
          <template v-else>
            <span
              v-for="(part, idx) in highlightedParts"
              :key="idx"
              :class="part.type === 'match' ? 'bg-primary-500/30 text-primary-300 rounded px-0.5' : ''"
            >{{ part.content }}</span>
          </template>
        </div>
      </div>

      <div v-if="matchCount > 0" class="flex flex-wrap gap-2">
        <div
          v-for="(match, idx) in matches"
          :key="idx"
          class="px-3 py-1.5 text-sm font-mono rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20"
        >
          "{{ match.text }}" at {{ match.index }}
        </div>
      </div>
    </div>
  </div>
</template>