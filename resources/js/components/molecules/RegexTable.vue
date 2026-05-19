<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  striped: {
    type: Boolean,
    default: true,
  },
  hoverable: {
    type: Boolean,
    default: true,
  },
  compact: Boolean,
});

const getValue = (row, column) => {
  if (column.key in row) return row[column.key];
  if (column.render) return column.render(row);
  return '';
};
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-700">
    <table class="w-full">
      <thead>
        <tr class="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-700">
          <th
            v-for="column in columns"
            :key="column.key"
            :class="[
              'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400',
              column.align === 'center' && 'text-center',
              column.align === 'right' && 'text-right',
            ]"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, idx) in data"
          :key="idx"
          :class="[
            'border-b border-surface-100 dark:border-surface-800',
            striped && idx % 2 === 1 && 'bg-surface-50/50 dark:bg-surface-800/30',
            hoverable && 'hover:bg-surface-100 dark:hover:bg-surface-800/50 transition-colors',
            compact && 'py-2',
          ]"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="[
              'px-4 py-3 text-sm',
              column.align === 'center' && 'text-center',
              column.align === 'right' && 'text-right',
              column.monospace && 'font-mono',
              column.highlight && 'text-primary-600 dark:text-primary-400 font-medium',
            ]"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="getValue(row, column)">
              {{ getValue(row, column) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>