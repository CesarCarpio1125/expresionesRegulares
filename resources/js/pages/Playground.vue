<script setup>
import { ref, onMounted } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import RegexPlayground from '@/components/organisms/RegexPlayground.vue';
import BaseCard from '@/components/atoms/BaseCard.vue';

const playgroundRef = ref(null);

const examples = [
  {
    name: 'Email',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    testString: 'Contáctanos: hola@ejemplo.com o soporte@dominio.org',
  },
  {
    name: 'URL',
    pattern: 'https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[\\w\\-.,@?^=%&:/~+#]*',
    testString: 'Visita https://ejemplo.com o https://sub.dominio.com/pagina',
  },
  {
    name: 'Teléfono',
    pattern: '\\+?\\d{1,3}[-.\\s]?\\(?\\d{2,4}\\)?[-.\\s]?\\d{3,4}[-.\\s]?\\d{3,4}',
    testString: 'Tel: +1 (555) 123-4567 o 555-123-4567',
  },
];

const loadExample = (example) => {
  if (playgroundRef.value) {
    playgroundRef.value.pattern = example.pattern;
    playgroundRef.value.testString = example.testString;
    playgroundRef.value.flags = 'g';
  }
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('pattern')) {
  }
});
</script>

<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">
          Regex Playground
        </h1>
        <p class="text-surface-600 dark:text-surface-400">
          Prueba y depura tus expresiones regulares en tiempo real
        </p>
      </div>

      <div class="flex items-center gap-2 mb-6 flex-wrap">
        <span class="text-sm font-medium text-surface-500 dark:text-surface-400">
          Pruebas rápidas:
        </span>
        <button
          v-for="example in examples"
          :key="example.name"
          class="px-3 py-1.5 text-sm rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          @click="loadExample(example)"
        >
          {{ example.name }}
        </button>
      </div>

      <RegexPlayground ref="playgroundRef" :showHistory="true" />
    </div>
  </AppLayout>
</template>