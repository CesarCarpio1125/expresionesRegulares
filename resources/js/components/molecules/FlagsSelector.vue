<script setup>
import BaseBadge from '@/components/atoms/BaseBadge.vue';

const props = defineProps({
  flags: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:flags']);

const flagOptions = [
  { flag: 'g', label: 'g', title: 'Global', description: 'Encuentra todas las coincidencias' },
  { flag: 'i', label: 'i', title: 'Insensible', description: 'Ignora mayúsculas/minúsculas' },
  { flag: 'm', label: 'm', title: 'Multilínea', description: '^ y $ coinciden con inicio/fin de línea' },
  { flag: 's', label: 's', title: 'Punto', description: 'El punto coincide con saltos de línea' },
  { flag: 'u', label: 'u', title: 'Unicode', description: 'Soporte completo de Unicode' },
];

const hasFlag = (flag) => {
  return (props.flags || '').includes(flag);
};

const toggleFlag = (flag) => {
  const current = props.flags || '';
  if (current.includes(flag)) {
    emit('update:flags', current.replace(flag, ''));
  } else {
    emit('update:flags', current + flag);
  }
};
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2 flex-wrap">
      <span class="text-sm font-medium text-surface-700 dark:text-surface-300">
        Flags:
      </span>
      <button
        v-for="option in flagOptions"
        :key="option.flag"
        @click="toggleFlag(option.flag)"
        :class="[
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono transition-all duration-200',
          hasFlag(option.flag)
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 ring-1 ring-primary-500/30'
            : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700',
        ]"
        :title="option.description"
      >
        <span>{{ option.label }}</span>
        <span class="text-xs text-surface-400 hidden sm:inline">{{ option.title }}</span>
      </button>
    </div>
    <p class="text-xs text-surface-500 dark:text-surface-400">
      <span v-for="(option, idx) in flagOptions" :key="option.flag">
        <span v-if="hasFlag(option.flag)" class="mr-2">
          • {{ option.description }}
        </span>
      </span>
    </p>
  </div>
</template>