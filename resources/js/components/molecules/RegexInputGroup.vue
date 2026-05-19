<script setup>
import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseTextarea from '@/components/atoms/BaseTextarea.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseIcon from '@/components/atoms/BaseIcon.vue';

defineProps({
  pattern: String,
  testString: String,
  error: String,
  replaceWith: String,
});

defineEmits(['update:pattern', 'update:testString', 'update:replaceWith', 'copy', 'clear']);

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
          Expresión Regular
        </label>
        <div class="flex items-center gap-2">
          <button
            v-if="pattern"
            class="btn-ghost p-1.5"
            title="Copiar regex"
            @click="$emit('copy', pattern)"
          >
            <BaseIcon name="copy" :size="16" />
          </button>
          <button
            v-if="pattern"
            class="btn-ghost p-1.5"
            title="Limpiar"
            @click="$emit('clear')"
          >
            <BaseIcon name="x" :size="16" />
          </button>
        </div>
      </div>
      <div class="relative">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 font-mono text-lg">/</div>
        <input
          :value="pattern"
          class="input-base font-mono text-sm pl-7 pr-7"
          placeholder="Ingresa tu regex..."
          @input="$emit('update:pattern', $event.target.value)"
        />
        <div class="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 font-mono text-lg">/</div>
      </div>
      <p v-if="error" class="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
        <BaseIcon name="error" :size="14" />
        {{ error }}
      </p>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
        Texto de Prueba
      </label>
      <textarea
        :value="testString"
        class="input-base font-mono text-sm min-h-[120px]"
        placeholder="Ingresa el texto a probar..."
        rows="4"
        @input="$emit('update:testString', $event.target.value)"
      />
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
        Reemplazar con
      </label>
      <input
        :value="replaceWith"
        class="input-base font-mono text-sm"
        placeholder="Texto de reemplazo (opcional)"
        @input="$emit('update:replaceWith', $event.target.value)"
      />
    </div>
  </div>
</template>