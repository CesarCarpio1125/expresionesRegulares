<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import QuizMenu from '@/components/organisms/QuizMenu.vue'
import ProgressiveQuiz from '@/components/organisms/ProgressiveQuiz.vue'
import PatternBuilder from '@/components/organisms/PatternBuilder.vue'
import SpeedChallenge from '@/components/organisms/SpeedChallenge.vue'
import FixRegex from '@/components/organisms/FixRegex.vue'
import { useQuiz } from '@/composables/useQuiz'

const quizComposable = useQuiz()
const currentMode = computed(() => quizComposable.currentMode.value)
const score = computed(() => quizComposable.score.value)
const userLevel = computed(() => quizComposable.userLevel.value)
const progressToNextLevel = computed(() => quizComposable.progressToNextLevel.value)

const selectMode = quizComposable.selectMode
const resetQuiz = quizComposable.resetQuiz

const quizKey = ref(0)

const handleModeSelect = (mode) => {
  selectMode(mode)
  quizKey.value++
}

const handleBack = () => {
  quizComposable.currentMode.value = null
  resetQuiz()
}
</script>

<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="!currentMode" class="space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-3">
            🧪 Quiz de Regex
          </h1>
          <p class="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
            ¡Pon a prueba tus conocimientos de expresiones regulares!
            Elige una modalidad y comienza a aprender.
          </p>
        </div>

        <div class="bg-surface-50 dark:bg-surface-900 rounded-2xl p-6 mb-8">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <span class="text-3xl">{{ userLevel.icon }}</span>
              <div>
                <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  {{ userLevel.name }}
                </h3>
                <p class="text-sm text-surface-500 dark:text-surface-400">
                  Nivel actual
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {{ userProgress?.xp || 0 }} XP
              </p>
            </div>
          </div>
          <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3">
            <div
              class="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
              :style="{ width: `${progressToNextLevel}%` }"
            ></div>
          </div>
          <p class="text-sm text-surface-500 dark:text-surface-400 mt-2 text-center">
            Progreso hacia el siguiente nivel
          </p>
        </div>

        <QuizMenu @select="handleModeSelect" />
      </div>

      <div v-else>
        <div class="flex items-center justify-between mb-6">
          <button
            @click="handleBack"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver al menú
          </button>
          <div class="flex items-center gap-4">
            <div class="px-4 py-2 bg-surface-100 dark:bg-surface-800 rounded-lg">
              <span class="text-sm text-surface-500 dark:text-surface-400">Puntos: </span>
              <span class="font-bold text-primary-600 dark:text-primary-400">{{ score }}</span>
            </div>
          </div>
        </div>

        <component
          :is="currentMode === 'progressive' ? ProgressiveQuiz :
               currentMode === 'builder' ? PatternBuilder :
               currentMode === 'speed' ? SpeedChallenge : FixRegex"
          :key="quizKey"
        />
      </div>
    </div>
  </AppLayout>
</template>