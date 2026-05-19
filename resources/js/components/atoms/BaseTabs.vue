<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  modelValue: String,
  variant: {
    type: String,
    default: 'underline',
    validator: (v) => ['underline', 'pills', 'cards'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
});

const emit = defineEmits(['update:modelValue']);

const activeTab = ref(props.modelValue || props.tabs[0]?.value);

watch(
  () => props.modelValue,
  (val) => {
    if (val) activeTab.value = val;
  }
);

const selectTab = (tab) => {
  activeTab.value = tab.value;
  emit('update:modelValue', tab.value);
};

const sizeClasses = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
};

const variantClasses = {
  underline: {
    container: 'border-b border-surface-200 dark:border-surface-700',
    tab: 'border-b-2 border-transparent -mb-px',
    active: 'border-primary-500 text-primary-600 dark:text-primary-400',
    inactive: 'text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200',
  },
  pills: {
    container: '',
    tab: 'rounded-full',
    active: 'bg-primary-500 text-white',
    inactive: 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700',
  },
  cards: {
    container: 'bg-surface-100 dark:bg-surface-800 rounded-xl p-1',
    tab: 'rounded-lg',
    active: 'bg-white dark:bg-surface-900 shadow-soft dark:shadow-soft-dark',
    inactive: '',
  },
};
</script>

<template>
  <div>
    <div
      :class="[
        'flex gap-1',
        variantClasses[variant].container,
      ]"
      role="tablist"
    >
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="[
          'font-medium transition-all duration-200 whitespace-nowrap',
          sizeClasses[size],
          variantClasses[variant].tab,
          activeTab === tab.value
            ? variantClasses[variant].active
            : variantClasses[variant].inactive,
        ]"
        role="tab"
        :aria-selected="activeTab === tab.value"
        @click="selectTab(tab)"
      >
        <span class="flex items-center gap-2">
          <component v-if="tab.icon" :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </span>
      </button>
    </div>
    <div class="mt-4">
      <slot :name="activeTab" />
    </div>
  </div>
</template>