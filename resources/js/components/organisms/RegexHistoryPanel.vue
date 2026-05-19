<script setup>
import BaseCard from '@/components/atoms/BaseCard.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import HistoryItem from '@/components/molecules/HistoryItem.vue';

defineProps({
  history: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['select', 'delete', 'clear']);
</script>

<template>
  <BaseCard padding="md" class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-surface-900 dark:text-surface-100">
        Historial
      </h3>
      <button
        v-if="history.length > 0"
        class="text-xs text-surface-500 hover:text-red-600 dark:text-surface-400 dark:hover:text-red-400 transition-colors"
        @click="$emit('clear')"
      >
        Limpiar todo
      </button>
    </div>

    <div v-if="history.length > 0" class="space-y-1 max-h-[400px] overflow-y-auto scrollbar-thin">
      <HistoryItem
        v-for="(item, index) in history"
        :key="index"
        :item="item"
        :index="index"
        @select="$emit('select', item)"
        @delete="$emit('delete', index)"
      />
    </div>

    <div v-else class="text-center py-8">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 mb-3">
        <svg class="w-6 h-6 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-sm text-surface-500 dark:text-surface-400">
        Sin historial aún
      </p>
      <p class="text-xs text-surface-400 dark:text-surface-500 mt-1">
        Tu historial se guardará automáticamente
      </p>
    </div>
  </BaseCard>
</template>