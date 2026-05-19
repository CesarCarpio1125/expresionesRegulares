<script setup>
import { ref } from 'vue';
import BaseCard from '@/components/atoms/BaseCard.vue';
import BaseCode from '@/components/atoms/BaseCode.vue';
import RegexExample from '@/components/molecules/RegexExample.vue';

const props = defineProps({
  applications: {
    type: Array,
    required: true,
  },
});

const activeApp = ref(null);

const openPlayground = (app) => {
  activeApp.value = app;
};

const closePlayground = () => {
  activeApp.value = null;
};
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <BaseCard
        v-for="app in applications"
        :key="app.name"
        hover
        class="cursor-pointer group"
        @click="openPlayground(app)"
      >
        <div class="flex items-start gap-4">
          <div
            :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
              app.iconBg || 'bg-primary-500/10',
            ]"
          >
            <svg class="w-6 h-6" :class="app.iconColor || 'text-primary-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="app.icon" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-surface-900 dark:text-surface-100 group-hover:text-primary-500 transition-colors">
              {{ app.name }}
            </h3>
            <p class="text-sm text-surface-600 dark:text-surface-400 mt-1 line-clamp-2">
              {{ app.description }}
            </p>
            <div class="mt-3 flex items-center gap-2">
              <span class="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded">
                {{ app.pattern }}
              </span>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between">
          <span class="text-xs text-surface-500">Click para probar</span>
          <svg class="w-4 h-4 text-surface-400 group-hover:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </BaseCard>
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
          v-if="activeApp"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="closePlayground"
        >
          <div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <BaseCard padding="lg">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-4">
                  <div
                    :class="[
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      activeApp.iconBg || 'bg-primary-500/10',
                    ]"
                  >
                    <svg class="w-6 h-6" :class="activeApp.iconColor || 'text-primary-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="activeApp.icon" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-100">
                      {{ activeApp.name }}
                    </h2>
                    <p class="text-sm text-surface-500">{{ activeApp.description }}</p>
                  </div>
                </div>
                <button
                  class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  @click="closePlayground"
                >
                  <svg class="w-5 h-5 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <RegexExample
                :pattern="activeApp.pattern"
                :testString="activeApp.testString"
                :flags="activeApp.flags || 'gi'"
                title="Prueba esta expresión"
                :description="activeApp.explanation"
              />
            </BaseCard>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>