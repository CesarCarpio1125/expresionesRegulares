<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import BaseCard from '@/components/atoms/BaseCard.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { useRegex } from '@/composables/useRegex';

const { pattern, testString, matches, matchCount, flags } = useRegex('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', 'g', 'Contáctanos: hola@ejemplo.com o soporte@dominio.org');
</script>

<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center space-y-6 mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-surface-900 dark:text-surface-100 tracking-tight">
          Expresiones Regulares
          <span class="text-primary-600 dark:text-primary-400">Simplificadas</span>
        </h1>
        <p class="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Prueba, explica y depura tus regex con una herramienta moderna e intuitiva.
          Soporta múltiples flags, grupos capturados y más.
        </p>
        <div class="flex items-center justify-center gap-4 flex-wrap">
          <a href="/playground" class="btn-primary text-base px-6 py-3">
            Ir al Playground
            <svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a href="/examples" class="btn-secondary text-base px-6 py-3">
            Ver Ejemplos
          </a>
          <a href="/quiz" class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg">
            🎯 Quiz Interactivo
          </a>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <BaseCard padding="lg" class="text-center">
          <div class="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">Tiempo Real</h3>
          <p class="text-sm text-surface-600 dark:text-surface-400">
            Resultados instantáneos mientras escribes tu expresión regular.
          </p>
        </BaseCard>

        <BaseCard padding="lg" class="text-center">
          <div class="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">Explicación Visual</h3>
          <p class="text-sm text-surface-600 dark:text-surface-400">
            Cada token de tu regex se explica en lenguaje natural.
          </p>
        </BaseCard>

        <BaseCard padding="lg" class="text-center">
          <div class="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">Aprende Regex</h3>
          <p class="text-sm text-surface-600 dark:text-surface-400">
            Tutorial interactivo para dominar expresiones regulares desde cero.
          </p>
          <a href="/learn" class="mt-4 inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
            Comenzar aprendizaje
            <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </BaseCard>

      </div>

      <BaseCard padding="lg" class="mb-16">
        <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-6 text-center">
          Demo Interactiva
        </h2>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2 block">
              Pattern: <code class="text-primary-600 dark:text-primary-400">\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b</code>
            </label>
          </div>
          <div>
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2 block">
              Test String: <code class="text-surface-600 dark:text-surface-400">Contáctanos: hola@ejemplo.com o soporte@dominio.org</code>
            </label>
          </div>
          <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 font-mono text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap break-all">
            <span v-if="matches.length === 0">{{ testString }}</span>
            <template v-else>
              <span v-if="matches[0].index > 0">{{ testString.slice(0, matches[0].index) }}</span>
              <mark class="regex-highlight">{{ matches[0].fullMatch }}</mark>
              <span v-if="matches.length > 1 && matches[0].index + matches[0].fullMatch.length < matches[1].index">
                {{ testString.slice(matches[0].index + matches[0].fullMatch.length, matches[1].index) }}
              </span>
              <mark v-if="matches.length > 1" class="regex-highlight">{{ matches[1].fullMatch }}</mark>
              <span v-if="matches.length > 1">{{ testString.slice(matches[1].index + matches[1].fullMatch.length) }}</span>
            </template>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Resultado:
            </span>
            <span class="badge-success">{{ matchCount }} coincidencia{{ matchCount !== 1 ? 's' : '' }}</span>
          </div>
        </div>
      </BaseCard>

      <div class="text-center">
        <p class="text-surface-500 dark:text-surface-400 mb-4">
          ¿Listo para probar tus propias expresiones?
        </p>
        <a href="/playground" class="btn-primary">
          Comenzar Ahora
        </a>
      </div>
    </div>
  </AppLayout>
</template>