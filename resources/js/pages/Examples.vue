<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import BaseCard from '@/components/atoms/BaseCard.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import RegexExampleCard from '@/components/molecules/RegexExampleCard.vue';

const examples = [
  {
    id: 1,
    name: 'Email',
    description: 'Valida direcciones de correo electrónico comunes',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    testString: 'usuario@dominio.com',
    category: 'validacion',
  },
  {
    id: 2,
    name: 'URL',
    description: 'Detecta URLs HTTP y HTTPS',
    pattern: 'https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[\\w\\-.,@?^=%&:/~+#]*',
    testString: 'https://ejemplo.com/pagina?param=valor',
    category: 'urls',
  },
  {
    id: 3,
    name: 'Teléfono',
    description: 'Matches de teléfonos internacionales y locales',
    pattern: '\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}',
    testString: '+1 (555) 123-4567',
    category: 'patrones',
  },
  {
    id: 4,
    name: 'IPv4',
    description: 'Valida direcciones IPv4',
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    testString: '192.168.1.1',
    category: 'redes',
  },
  {
    id: 5,
    name: 'IPv6',
    description: 'Valida direcciones IPv6',
    pattern: '([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}',
    testString: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    category: 'redes',
  },
  {
    id: 6,
    name: 'Fecha (DD/MM/AAAA)',
    description: 'Valida fechas en formato día/mes/año',
    pattern: '(0?[1-9]|[12][0-9]|3[01])[\\/](0?[1-9]|1[012])[\\/](19|20)\\d{2}',
    testString: '25/12/2024',
    category: 'patrones',
  },
  {
    id: 7,
    name: 'Hora (HH:MM)',
    description: 'Valida formato de hora 24 horas',
    pattern: '([01]?[0-9]|2[0-3]):[0-5][0-9]',
    testString: '14:30',
    category: 'patrones',
  },
  {
    id: 8,
    name: 'Contraseña Fuerte',
    description: 'Mínimo 8 caracteres, mayúscula, minúscula y número',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
    testString: 'MiContraseña123',
    category: 'validacion',
  },
  {
    id: 9,
    name: 'Etiqueta HTML',
    description: 'Detecta etiquetas HTML de apertura y cierre',
    pattern: '<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)',
    testString: '<div class="container">Contenido</div>',
    category: 'desarrollo',
  },
  {
    id: 10,
    name: 'Número de Tarjeta',
    description: 'Detecta números de tarjeta de crédito (Visa, MasterCard)',
    pattern: '\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})\\b',
    testString: '4111111111111111',
    category: 'validacion',
  },
  {
    id: 11,
    name: 'Usuario GitHub',
    description: 'Valida nombres de usuario de GitHub',
    pattern: '@[a-zA-Z0-9-_]+',
    testString: '@username',
    category: 'redes',
  },
  {
    id: 12,
    name: 'Hex Color',
    description: 'Detecta colores hexadecimales',
    pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b',
    testString: '#FF5733',
    category: 'desarrollo',
  },
];

const categories = [...new Set(examples.map(e => e.category))];

const categoryLabels = {
  validacion: 'Validación',
  urls: 'URLs',
  patrones: 'Patrones',
  redes: 'Redes',
  desarrollo: 'Desarrollo',
};

const selectExample = (example) => {
  const query = new URLSearchParams({
    pattern: example.pattern,
    flags: 'g',
    test: example.testString,
  });
  window.location.href = `/playground?${query.toString()}`;
};

const copyPattern = async (pattern) => {
  try {
    await navigator.clipboard.writeText(pattern);
  } catch {}
};
</script>

<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">
          Ejemplos de Regex
        </h1>
        <p class="text-surface-600 dark:text-surface-400">
          Explora expresiones regulares comunes y úsalas en el playground
        </p>
      </div>

      <div
        v-for="category in categories"
        :key="category"
        class="mb-10"
      >
        <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
          <span class="w-1 h-6 bg-primary-500 rounded-full"></span>
          {{ categoryLabels[category] }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RegexExampleCard
            v-for="example in examples.filter(e => e.category === category)"
            :key="example.id"
            :example="example"
            @select="selectExample"
          />
        </div>
      </div>
    </div>
  </AppLayout>
</template>