<script setup>
import { watch, onMounted, computed } from 'vue';
import { useRegex } from '@/composables/useRegex';
import { useRegexExplain } from '@/composables/useRegexExplain';
import { useHistory } from '@/composables/useHistory';
import RegexInputGroup from '@/components/molecules/RegexInputGroup.vue';
import FlagsSelector from '@/components/molecules/FlagsSelector.vue';
import RegexResultsPanel from '@/components/organisms/RegexResultsPanel.vue';
import RegexExplanationPanel from '@/components/organisms/RegexExplanationPanel.vue';
import RegexHistoryPanel from '@/components/organisms/RegexHistoryPanel.vue';

const props = defineProps({
  initialPattern: {
    type: String,
    default: '',
  },
  initialFlags: {
    type: String,
    default: 'g',
  },
  initialTestString: {
    type: String,
    default: '',
  },
  showHistory: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:pattern', 'update:flags', 'update:testString', 'share']);

const {
  pattern,
  flags,
  testString,
  replaceWith,
  error,
  regex,
  matches,
  matchCount,
  replacedString,
  highlightedText,
  isValid,
  hasFlag,
  toggleFlag,
} = useRegex(
  props.initialPattern,
  props.initialFlags,
  props.initialTestString
);

const { explanation, summary } = useRegexExplain(pattern);

const { history, addEntry, removeEntry, clearHistory, restoreEntry } = useHistory();

watch([pattern, flags, testString], () => {
  emit('update:pattern', pattern.value);
  emit('update:flags', flags.value);
  emit('update:testString', testString.value);
}, { deep: true });

const saveToHistory = () => {
  if (pattern.value && testString.value) {
    addEntry(pattern.value, flags.value, testString.value);
  }
};

const handleCopy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {}
};

const handleClear = () => {
  pattern.value = '';
};

const handleSelectHistory = (item) => {
  pattern.value = item.pattern;
  flags.value = item.flags;
  testString.value = item.testString;
};

const handleShare = () => {
  const url = new URL(window.location.href);
  url.searchParams.set('pattern', pattern.value);
  url.searchParams.set('flags', flags.value);
  url.searchParams.set('test', testString.value);
  navigator.clipboard.writeText(url.toString());
  emit('share', url.toString());
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('pattern')) {
    pattern.value = params.get('pattern');
  }
  if (params.get('flags')) {
    flags.value = params.get('flags');
  }
  if (params.get('test')) {
    testString.value = params.get('test');
  }
});

defineExpose({
  pattern,
  flags,
  testString,
  saveToHistory,
});
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-6">
        <RegexInputGroup
          v-model:pattern="pattern"
          v-model:testString="testString"
          v-model:replaceWith="replaceWith"
          :error="error"
          @copy="handleCopy"
          @clear="handleClear"
        />

        <FlagsSelector
          v-model:flags="flags"
        />

        <div class="flex items-center gap-3">
          <button
            class="btn-primary flex-1"
            :disabled="!pattern || !isValid"
            @click="saveToHistory"
          >
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Guardar
          </button>
          <button
            class="btn-secondary flex-1"
            :disabled="!pattern"
            @click="handleShare"
          >
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Compartir
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <RegexResultsPanel
          :matches="matches"
          :matchCount="matchCount"
          :highlightedText="highlightedText"
          :replacedString="replacedString"
          :replaceWith="replaceWith"
          :testString="testString"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RegexExplanationPanel
        :pattern="pattern"
        :explanation="explanation"
        :summary="summary"
      />

      <RegexHistoryPanel
        v-if="showHistory"
        :history="history"
        @select="handleSelectHistory"
        @delete="removeEntry"
        @clear="clearHistory"
      />
    </div>
  </div>
</template>