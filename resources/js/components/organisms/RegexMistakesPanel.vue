<script setup>
import { ref } from 'vue';
import BaseCard from '@/components/atoms/BaseCard.vue';
import RegexExample from '@/components/molecules/RegexExample.vue';

const props = defineProps({
  mistakes: {
    type: Array,
    required: true,
  },
});

const activeMistake = ref(null);

const showExample = (mistake) => {
  activeMistake.value = mistake;
};

const closeExample = () => {
  activeMistake.value = null;
};
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-4">
      <div
        v-for="(mistake, idx) in mistakes"
        :key="idx"
        class="rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden"
      >
        <div
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
          @click="showExample(mistake)"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h4 class="font-medium text-surface-900 dark:text-surface-100">
                {{ mistake.title }}
              </h4>
              <p class="text-sm text-surface-600 dark:text-surface-400 mt-0.5">
                {{ mistake.description }}
              </p>
            </div>
          </div>
          <svg class="w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <div class="border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/30 p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <span class="text-xs font-medium text-red-500 uppercase tracking-wider">Incorrecto</span>
              <code class="block p-3 rounded-lg bg-red-500/10 text-red-400 font-mono text-sm">
                {{ mistake.incorrect }}
              </code>
              <p class="text-xs text-surface-500">{{ mistake.incorrectWhy }}</p>
            </div>
            <div class="space-y-2">
              <span class="text-xs font-medium text-green-500 uppercase tracking-wider">Correcto</span>
              <code class="block p-3 rounded-lg bg-green-500/10 text-green-400 font-mono text-sm">
                {{ mistake.correct }}
              </code>
              <p class="text-xs text-surface-500">{{ mistake.correctWhy }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="activeMistake"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="closeExample"
        >
          <div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <BaseCard padding="lg">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-100">
                      {{ activeMistake.title }}
                    </h2>
                    <p class="text-sm text-surface-500">{{ activeMistake.description }}</p>
                  </div>
                </div>
                <button
                  class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  @click="closeExample"
                >
                  <svg class="w-5 h-5 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <RegexExample
                :pattern="activeMistake.correct"
                :testString="activeMistake.testString || 'Ejemplo de prueba'"
                flags="g"
                title="Ejemplo corregido"
              />
            </BaseCard>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>