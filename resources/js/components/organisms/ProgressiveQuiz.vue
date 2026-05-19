<script setup>
import { ref, computed, watch } from 'vue'
import { useQuiz } from '@/composables/useQuiz'
import BaseCard from '@/components/atoms/BaseCard.vue'

const {
  questions,
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

const selectedLevel = ref('basico')
const selectedAnswer = ref(null)
const previousScore = ref(0)
const pointsAnimation = ref(null)

const levelLabels = {
  basico: { name: 'Básico', color: 'green', icon: '🌱' },
  intermedio: { name: 'Intermedio', color: 'yellow', icon: '📚' },
  avanzado: { name: 'Avanzado', color: 'red', icon: '🔥' }
}

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const filteredQuestions = computed(() => {
  const filtered = questions.filter(q => q.level === selectedLevel.value)
  return shuffleArray(filtered)
})

const currentQuestion = computed(() => {
  const filtered = filteredQuestions.value
  if (currentQuestionIndex.value >= filtered.length) {
    return null
  }
  const question = { ...filtered[currentQuestionIndex.value] }
  question.options = shuffleArray([...question.options])
  return question
})

const progress = computed(() => {
  const total = filteredQuestions.value.length
  if (total === 0) return 0
  return ((currentQuestionIndex.value) / total) * 100
})

watch(score, (newScore, oldScore) => {
  if (newScore > oldScore) {
    const points = newScore - oldScore
    pointsAnimation.value = points
    setTimeout(() => {
      pointsAnimation.value = null
    }, 2000)
  }
  previousScore.value = oldScore
})

function selectAnswer(index) {
  if (showExplanation.value) return
  
  const option = currentQuestion.value.options[index]
  const isCorrect = option.isCorrect === true
  
  selectedAnswer.value = index
  answerQuestion(isCorrect)
}

function restartQuiz() {
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  previousScore.value = 0
}

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value >= filteredQuestions.value.length - 1
})

function handleFinishOrNext() {
  selectedAnswer.value = null
  nextQuestion()
}

function handleFinishLevel() {
  selectedAnswer.value = null
  currentQuestionIndex.value = 0
}

function getOptionClass(index) {
  if (!showExplanation.value) {
    return selectedAnswer.value === index
      ? 'border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md transform scale-[1.02]'
      : 'border-2 border-surface-200 dark:border-surface-700 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-md hover:scale-[1.01]'
  }

  const option = currentQuestion.value.options[index]
  if (option.isCorrect === true) {
    return 'border-2 border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg'
  }
  if (selectedAnswer.value === index && option.isCorrect !== true) {
    return 'border-2 border-red-500 bg-red-50 dark:bg-red-900/20'
  }
  return 'border-2 border-surface-200 dark:border-surface-700 opacity-50'
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-3">
        <button
          v-for="(level, key) in levelLabels"
          :key="key"
          @click="selectedLevel = key; restartQuiz()"
          class="px-5 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2 border-2"
          :class="selectedLevel === key
            ? 'bg-green-500 border-green-500 text-white shadow-lg scale-105'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-green-50 hover:border-green-400 dark:hover:bg-green-900/20 hover:scale-105'"
        >
          <span class="text-lg">{{ level.icon }}</span>
          <span>{{ level.name }}</span>
        </button>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-bold shadow-lg">
          <span>🔥</span>
          <span>{{ streak }}</span>
          <span class="text-xs opacity-80">racha</span>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl text-white font-bold shadow-lg">
          <span>⭐</span>
          <span>{{ score }}</span>
          <span class="text-xs opacity-80">pts</span>
        </div>
      </div>
    </div>

    <div v-if="currentQuestion" class="space-y-6">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 px-3 py-1 rounded-full">
          Pregunta {{ currentQuestionIndex + 1 }} / {{ filteredQuestions.length }}
        </span>
        <span class="text-sm text-surface-500 dark:text-surface-400 capitalize bg-surface-100 dark:bg-surface-800 px-3 py-1 rounded-full">
          {{ currentQuestion.category }}
        </span>
      </div>

      <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3 overflow-hidden">
        <div 
          class="bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700 ease-out relative"
          :style="{ width: `${progress}%` }"
        >
          <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>

      <div class="relative">
        <BaseCard class="p-6 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-purple-500"></div>
          
          <div class="mb-5">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-100 dark:bg-surface-800 rounded-lg mb-3">
              <span class="text-xs font-medium text-surface-500 uppercase tracking-wider">Pattern</span>
            </div>
            <code class="text-lg font-mono text-primary-600 dark:text-primary-400 bg-gradient-to-r from-surface-900 to-surface-800 px-4 py-2 rounded-xl block">
              {{ currentQuestion.regexDisplay }}
            </code>
          </div>
          
          <h3 class="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6">
            {{ currentQuestion.question }}
          </h3>

          <div class="space-y-3">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              @click="selectAnswer(index)"
              :disabled="showExplanation"
              class="w-full p-4 text-left rounded-xl border-2 transition-all duration-300 cursor-pointer"
              :class="getOptionClass(index)"
            >
              <span class="font-medium text-surface-900 dark:text-surface-100">
                {{ option.text }}
              </span>
            </button>
          </div>
        </BaseCard>
      </div>

      <div v-if="showExplanation" class="space-y-5 animate-fade-in">
        <Transition name="bounce" appear>
          <div
            class="rounded-2xl p-6 border-2 shadow-2xl relative overflow-hidden"
            :class="lastAnswerCorrect
              ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/30 border-green-400'
              : 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-800/30 border-red-400'"
          >
            <div v-if="lastAnswerCorrect" class="absolute top-0 right-0 w-24 h-24 bg-green-500/20 rounded-full blur-3xl -mr-12 -mt-12"></div>
            <div v-else class="absolute top-0 right-0 w-24 h-24 bg-red-500/20 rounded-full blur-3xl -mr-12 -mt-12"></div>
            
            <div class="flex items-start gap-4 relative z-10">
              <div
                class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                :class="lastAnswerCorrect 
                  ? 'bg-gradient-to-br from-green-400 to-green-600' 
                  : 'bg-gradient-to-br from-red-400 to-red-600'"
              >
                {{ lastAnswerCorrect ? '🎉' : '😔' }}
              </div>
              <div class="flex-1">
                <h3 class="text-2xl font-bold mb-1" :class="lastAnswerCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'">
                  {{ lastAnswerCorrect ? '¡Correcto!' : '¡Incorrecto!' }}
                </h3>
                <p class="text-base font-medium" :class="lastAnswerCorrect ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'">
                  {{ lastAnswerCorrect 
                    ? `+${streak * 10} puntos ganados! 🔥 Racha: ${streak}` 
                    : 'Sigue intentándolo, ¡tú puedes!' }}
                </p>
              </div>
            </div>

            <div class="mt-5 bg-white/70 dark:bg-black/30 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">📖</span>
                <span class="font-bold text-surface-900 dark:text-surface-100">Explicación</span>
              </div>
              <p class="text-surface-700 dark:text-surface-300 leading-relaxed">
                {{ currentQuestion.explanation }}
              </p>
            </div>

            <div v-if="currentQuestion.trivia" class="mt-4 flex items-start gap-3 text-sm bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <span class="text-xl">💡</span>
              <div>
                <span class="font-bold text-purple-700 dark:text-purple-400">¿Sabías que?</span>
                <p class="text-purple-600 dark:text-purple-400 mt-1">{{ currentQuestion.trivia }}</p>
              </div>
            </div>
          </div>
        </Transition>

        <div class="flex gap-3">
          <button
            @click="handleFinishOrNext"
            class="flex-1 py-5 px-6 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            :class="isLastQuestion
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
              : 'bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 text-white hover:from-primary-600 hover:via-purple-600 hover:to-pink-600'"
          >
            <span class="text-2xl">{{ isLastQuestion ? '🏆' : '➡️' }}</span>
            <div class="text-left">
              <div>{{ isLastQuestion ? 'Finalizar' : 'Siguiente' }}</div>
              <div class="text-xs font-normal opacity-80">{{ isLastQuestion ? 'Nivel completado!' : `Pregunta ${currentQuestionIndex + 2} de ${filteredQuestions.length}` }}</div>
            </div>
          </button>
          <button
            v-if="isLastQuestion"
            @click="handleFinishLevel"
            class="px-6 py-5 rounded-2xl font-bold bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🔄
          </button>
        </div>
      </div>
    </div>

    <div v-if="showTrivia && currentTrivia" class="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50">
      <Transition name="slide-up" appear>
        <BaseCard class="p-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl">
          <div class="flex items-start gap-3">
            <span class="text-3xl">💡</span>
            <div>
              <p class="text-sm font-bold mb-1">¿Sabías que?</p>
              <p class="text-sm opacity-95 leading-relaxed">{{ currentTrivia.text }}</p>
            </div>
          </div>
        </BaseCard>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: slide-up 0.4s ease-out forwards;
}

.slide-up-enter-active {
  animation: slide-up 0.3s ease-out;
}

.bounce-enter-active {
  animation: bounce 0.5s ease-out;
}
</style>