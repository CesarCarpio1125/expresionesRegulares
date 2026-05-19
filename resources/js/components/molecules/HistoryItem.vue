<script setup>
import BaseBadge from '@/components/atoms/BaseBadge.vue';

defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

defineEmits(['select', 'delete']);

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'Hace un momento';
  if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} h`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};
</script>

<template>
  <div class="group flex items-start gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
    <button
      class="flex-1 text-left min-w-0"
      @click="$emit('select', item)"
    >
      <div class="flex items-center gap-2 mb-1">
        <code class="text-sm font-mono text-primary-600 dark:text-primary-400 truncate">
          {{ item.pattern }}
        </code>
        <BaseBadge v-if="item.flags" variant="default" size="sm">
          {{ item.flags }}
        </BaseBadge>
      </div>
      <p class="text-xs text-surface-400 dark:text-surface-500 truncate">
        {{ item.testString || 'Sin texto de prueba' }}
      </p>
      <p class="text-xs text-surface-400 dark:text-surface-500 mt-1">
        {{ formatDate(item.timestamp) }}
      </p>
    </button>
    <button
      class="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all"
      title="Eliminar"
      @click.stop="$emit('delete', index)"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>