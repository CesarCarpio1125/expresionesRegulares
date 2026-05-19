<script setup>
import { ref, computed } from 'vue'
import { useQuiz } from '@/composables/useQuiz'
import BaseCard from '@/components/atoms/BaseCard.vue'

const {
  fixRegexQuestions,
  currentQuestionIndex,
  showExplanation,
  lastAnswerCorrect,
  showTrivia,
  currentTrivia,
  answerQuestion,
  nextQuestion,
  score,
  streak
} = useQuiz()

const showHint = ref(false)
const selectedAnswer = ref(null)
const answered = ref(false)
const shuffledQuestions = ref([])

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const currentQuestion = computed(() => {
  if (shuffledQuestions.value.length === 0) return null
  if (currentQuestionIndex.value >= shuffledQuestions.value.length) return null
  return shuffledQuestions.value[currentQuestionIndex.value]
})

const totalQuestions = computed(() => fixRegexQuestions.length)

const progress = computed(() => {
  if (totalQuestions.value === 0) return 0
  return ((currentQuestionIndex.value) / totalQuestions.value) * 100
})

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value >= shuffledQuestions.value.length - 1
})

const levelColors = {
  basico: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-400', badge: 'bg-green-500' },
  intermedio: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-400', badge: 'bg-yellow-500' },
  avanzado: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-400', badge: 'bg-red-500' }
}

function startQuiz() {
  shuffledQuestions.value = shuffleArray([...fixRegexQuestions])
  currentQuestionIndex.value = 0
}

if (shuffledQuestions.value.length === 0) {
  startQuiz()
}

function toggleHint() {
  showHint.value = !showHint.value
}

function selectFix(index) {
  if (answered.value) return
  selectedAnswer.value = index
  answered.value = true
  
  const isCorrect = index === 0
  answerQuestion(isCorrect)
}

function getTestCaseClass(testCase) {
  if (testCase.shouldMatch === testCase.actualMatch) {
    return 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
  }
  return 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
}

function handleFinishOrNext() {
  showHint.value = false
  selectedAnswer.value = null
  answered.value = false
  nextQuestion()
}

function restartQuiz() {
  currentQuestionIndex.value = 0
  showHint.value = false
  selectedAnswer.value = null
  answered.value = false
  shuffledQuestions.value = shuffleArray([...fixRegexQuestions])
}

function getOptionClass(index) {
  if (!answered.value) {
    return 'border-2 border-surface-200 dark:border-surface-700 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:shadow-md hover:scale-[1.01]'
  }
  
  if (index === 0) {
    return 'border-2 border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg'
  }
  if (selectedAnswer.value === index) {
    return 'border-2 border-red-500 bg-red-50 dark:bg-red-900/20'
  }
  return 'border-2 border-surface-200 dark:border-surface-700 opacity-50'
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
          🔧
        </div>
        <div>
          <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Corrige la Regex
          </h2>
          <p class="text-sm text-surface-500 dark:text-surface-400">
            Encuentra y repara los errores
          </p>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-bold shadow-lg">
          <span class="text-lg">🔥</span>
          <span>{{ streak }}</span>
          <span class="text-xs opacity-80">racha</span>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl text-white font-bold shadow-lg">
          <span class="text-lg">⭐</span>
          <span>{{ score }}</span>
          <span class="text-xs opacity-80">pts</span>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 px-4 py-2 rounded-full">
        🐛 {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
      </span>
      <span 
        v-if="currentQuestion"
        class="px-4 py-2 rounded-full text-xs font-bold text-white"
        :class="levelColors[currentQuestion.level]?.badge || 'bg-gray-500'"
      >
        {{ currentQuestion.level }}
      </span>
    </div>

    <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3 overflow-hidden">
      <div 
        class="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 h-3 rounded-full transition-all duration-500"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>

    <BaseCard v-if="currentQuestion" class="p-6 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>
      
      <h3 class="text-lg font-bold text-surface-900 dark:text-surface-100 mb-5">
        {{ currentQuestion.question }}
      </h3>

      <div class="bg-gradient-to-r from-red-900 to-surface-900 rounded-xl p-5 mb-5 border-2 border-red-500/30">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xl">❌</span>
          <span class="text-red-400 font-medium">Regex problemática:</span>
        </div>
        <code class="text-xl font-mono text-red-400 block">{{ currentQuestion.brokenRegex }}</code>
      </div>

      <div class="mb-5">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-lg">🧪</span>
          <span class="font-bold text-surface-900 dark:text-surface-100">Casos de prueba:</span>
        </div>
        <div class="space-y-2">
          <div
            v-for="(testCase, index) in currentQuestion.testCases"
            :key="index"
            class="flex items-center gap-3 p-3 rounded-xl border-2"
            :class="getTestCaseClass(testCase)"
          >
            <code class="font-mono text-sm text-surface-900 dark:text-surface-100 flex-1">{{ testCase.input || testCase.text }}</code>
            <span v-if="testCase.isError" class="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">⚠️ Error</span>
            <span v-else class="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">✓ OK</span>
          </div>
        </div>
      </div>

      <button
        @click="toggleHint"
        class="mb-4 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors flex items-center gap-2"
      >
        <span>💡</span>
        <span>{{ showHint ? 'Ocultar pista' : 'Mostrar pista' }}</span>
      </button>

      <div v-if="showHint" class="mb-5 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-400 rounded-xl">
        <p class="text-yellow-800 dark:text-yellow-200 font-medium">
          {{ currentQuestion.hint }}
        </p>
      </div>

      <div v-if="!showExplanation" class="space-y-4">
        <p class="text-sm font-bold text-surface-900 dark:text-surface-100">
          🤔 ¿Cuál es la solución correcta?
        </p>
        <div class="space-y-3">
          <button
            @click="selectFix(0)"
            :disabled="answered"
            class="w-full p-4 text-left rounded-xl border-2 transition-all font-mono"
            :class="getOptionClass(0)"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">✅</span>
              <code class="text-lg text-green-600 dark:text-green-400">{{ currentQuestion.fix }}</code>
            </div>
            <span class="ml-11 text-sm text-surface-500">Regex corregida</span>
          </button>
          <button
            @click="selectFix(1)"
            :disabled="answered"
            class="w-full p-4 text-left rounded-xl border-2 transition-all font-mono opacity-50"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">❌</span>
              <code class="text-lg text-surface-400">{{ currentQuestion.brokenRegex }}</code>
            </div>
            <span class="ml-11 text-sm text-surface-400">Mantener como está</span>
          </button>
        </div>
      </div>

      <div v-if="showExplanation" class="space-y-5 animate-fade-in">
        <div
          class="rounded-2xl p-6 border-2 shadow-2xl"
          :class="lastAnswerCorrect
            ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/30 border-green-400'
            : 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-800/30 border-red-400'"
        >
          <div class="flex items-start gap-4 mb-4">
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              :class="lastAnswerCorrect 
                ? 'bg-gradient-to-br from-green-400 to-green-600' 
                : 'bg-gradient-to-br from-red-400 to-red-600'"
            >
              {{ lastAnswerCorrect ? '🎉' : '😔' }}
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-bold mb-1" :class="lastAnswerCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'">
                {{ lastAnswerCorrect ? '¡Excelente!' : '¡Casi lo logras!' }}
              </h3>
              <p class="font-medium" :class="lastAnswerCorrect ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'">
                {{ lastAnswerCorrect 
                  ? `+${streak * 10} puntos ganados! 🔥 Racha: ${streak}` 
                  : 'Sigue practicando, ¡tú puedes!' }}
              </p>
            </div>
          </div>

          <div class="bg-white/70 dark:bg-black/30 rounded-xl p-4 mb-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg">📖</span>
              <span class="font-bold text-surface-900 dark:text-surface-100">Explicación</span>
            </div>
            <p class="text-surface-700 dark:text-surface-300 leading-relaxed">
              {{ currentQuestion.explanation }}
            </p>
            <div v-if="lastAnswerCorrect" class="mt-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <p class="text-sm text-green-600 dark:text-green-400 font-bold">Regex corregida:</p>
              <code class="text-green-600 dark:text-green-400 font-mono">{{ currentQuestion.fix }}</code>
            </div>
          </div>

          <div v-if="currentQuestion.trivia" class="flex items-start gap-3 text-sm bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <span class="text-xl">💡</span>
            <div>
              <span class="font-bold text-purple-700 dark:text-purple-400">¿Sabías que?</span>
              <p class="text-purple-600 dark:text-purple-400 mt-1">{{ currentQuestion.trivia }}</p>
            </div>
          </div>
        </div>

        <button
          @click="handleFinishOrNext"
          class="w-full py-5 px-6 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          :class="isLastQuestion
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
            : 'bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 text-white hover:from-primary-600 hover:via-purple-600 hover:to-pink-600'"
        >
          <span class="text-2xl">{{ isLastQuestion ? '🏆' : '➡️' }}</span>
          <div class="text-left">
            <div>{{ isLastQuestion ? 'Finalizar' : 'Siguiente' }}</div>
            <div class="text-xs font-normal opacity-80">{{ isLastQuestion ? 'Nivel completado!' : `Problema ${currentQuestionIndex + 2} de ${totalQuestions}` }}</div>
          </div>
        </button>

        <div v-if="isLastQuestion" class="text-center">
          <button
            @click="restartQuiz"
            class="px-6 py-3 rounded-xl font-bold bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600 transition-all"
          >
            🔄 Repetir desafíos
          </button>
        </div>
      </div>
    </BaseCard>

    <div v-if="showTrivia && currentTrivia" class="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50">
      <BaseCard class="p-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl">
        <div class="flex items-start gap-3">
          <span class="text-3xl">💡</span>
          <div>
            <p class="text-sm font-bold mb-1">¿Sabías que?</p>
            <p class="text-sm opacity-95 leading-relaxed">{{ currentTrivia.text }}</p>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: slide-up 0.4s ease-out forwards;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>