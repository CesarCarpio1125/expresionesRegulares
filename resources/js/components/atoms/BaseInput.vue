<script setup>
defineProps({
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  disabled: Boolean,
  readonly: Boolean,
  error: String,
  label: String,
  id: String,
  name: String,
  autocomplete: String,
  inputClass: String,
});

defineEmits(['update:modelValue', 'focus', 'blur']);
</script>

<template>
  <div class="space-y-1.5">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-surface-700 dark:text-surface-300"
    >
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :name="name"
        :autocomplete="autocomplete"
        :class="[
          'block w-full rounded-xl border transition-colors duration-200',
          'bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100',
          'placeholder-surface-400 dark:placeholder-surface-500',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:focus:ring-red-500/20'
            : 'border-surface-300 dark:border-surface-700 focus:border-primary-500 focus:ring-primary-500/20 dark:focus:border-primary-400 dark:focus:ring-primary-400/20',
          disabled && 'opacity-50 cursor-not-allowed bg-surface-50 dark:bg-surface-800',
          inputClass,
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
      <slot name="suffix" />
    </div>
    <p
      v-if="error"
      class="text-sm text-red-600 dark:text-red-400"
    >
      {{ error }}
    </p>
  </div>
</template>