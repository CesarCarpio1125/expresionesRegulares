<script setup>
import { ref } from 'vue';

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'regex',
  },
  title: String,
  showLineNumbers: {
    type: Boolean,
    default: false,
  },
  compact: Boolean,
  copyable: {
    type: Boolean,
    default: true,
  },
});

const copied = ref(false);

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {}
};

const lines = props.code.split('\n');
</script>

<template>
  <div
    :class="[
      'relative group rounded-xl overflow-hidden',
      'bg-surface-900 dark:bg-black',
      compact ? 'text-sm' : 'text-base',
    ]"
  >
    <div
      v-if="title || copyable"
      class="flex items-center justify-between px-4 py-2 border-b border-surface-800"
    >
      <span v-if="title" class="text-sm font-medium text-surface-400">
        {{ title }}
      </span>
      <span v-else class="text-xs uppercase tracking-wider text-surface-500">
        {{ language }}
      </span>
      <button
        v-if="copyable"
        class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-surface-800"
        @click="copyCode"
      >
        <svg
          v-if="!copied"
          class="w-4 h-4 text-surface-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <svg
          v-else
          class="w-4 h-4 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>
    </div>
    <div class="overflow-x-auto">
      <pre
        :class="[
          'p-4 font-mono leading-relaxed',
          compact ? 'py-3' : 'py-5',
        ]"
      ><code><slot>{{ code }}</slot></code></pre>
    </div>
  </div>
</template>