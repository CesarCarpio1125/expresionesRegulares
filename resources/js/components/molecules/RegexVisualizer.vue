<script setup>
import { computed } from 'vue';

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
  showGroups: {
    type: Boolean,
    default: false,
  },
  colorize: {
    type: Boolean,
    default: true,
  },
});

const regex = computed(() => {
  try {
    return new RegExp(props.pattern, props.flags);
  } catch {
    return null;
  }
});

const parts = computed(() => {
  if (!regex.value || !props.testString) {
    return [{ type: 'text', content: props.testString }];
  }

  const results = [];
  let match;
  const re = new RegExp(props.pattern, props.flags);

  while ((match = re.exec(props.testString)) !== null) {
    const currentLength = results.reduce((acc, p) => acc + (p.content?.length || 0), 0);
    if (match.index > currentLength) {
      results.push({
        type: 'text',
        content: props.testString.slice(currentLength, match.index),
      });
    }
    results.push({
      type: 'match',
      content: match[0],
    });
    if (match[0].length === 0) re.lastIndex++;
    if (!props.flags.includes('g')) break;
  }

  const totalMatched = results.reduce((acc, p) => acc + (p.type === 'match' ? p.content.length : p.content.length), 0);
  if (totalMatched < props.testString.length) {
    results.push({ type: 'text', content: props.testString.slice(totalMatched) });
  }

  return results;
});

const isValid = computed(() => regex.value !== null);
const hasMatches = computed(() => parts.value.some((p) => p.type === 'match'));
</script>

<template>
  <div class="relative">
    <div class="p-4 rounded-xl font-mono text-sm leading-relaxed break-all min-h-[60px] bg-surface-900 dark:bg-black text-surface-100">
      <span v-if="!isValid" class="text-red-400">Invalid regex</span>
      <template v-else>
        <span v-for="(part, idx) in parts" :key="idx">
          <span v-if="part.type === 'text'" class="text-surface-400">{{ part.content }}</span>
          <span
            v-else
            :class="[
              'rounded px-0.5 mx-0.5',
              colorize ? 'bg-primary-500/40 text-primary-300' : 'bg-yellow-500/20 text-yellow-300',
            ]"
          >{{ part.content }}</span>
        </span>
      </template>
    </div>

    <div
      v-if="!isValid || !hasMatches"
      class="absolute inset-0 flex items-center justify-center"
    >
      <span class="text-sm text-surface-500">
        {{ !isValid ? 'Invalid pattern' : 'No matches found' }}
      </span>
    </div>
  </div>
</template>