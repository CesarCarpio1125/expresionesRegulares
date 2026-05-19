<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'
import { useQuiz } from '@/composables/useQuiz'
import BaseCard from '@/components/atoms/BaseCard.vue'

const {
  questions,
  currentQuestionIndex,
  score,
  streak,
  timeRemaining,
  isTimerRunning,
  showExplanation,
  lastAnswerCorrect,
  showTrivia,
  currentTrivia,
  answerQuestion,
  nextQuestion,
  startTimer,
  stopTimer,
  resetQuiz
} = useQuiz()

const gameStarted = ref(false)
const gameEnded = ref(false)
const selectedAnswer = ref(null)
const shuffledQuestions = ref([])
const previousScore = ref(0)
const pointsAnimation = ref(null)
let timerInterval = null

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function shuffleOptions(options) {
  const shuffled = [...options]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const currentQuestion = computed(() => {
  if (shuffledQuestions.value.length === 0) return null
  if (currentQuestionIndex.value >= shuffledQuestions.value.length) return null
  
  const question = shuffledQuestions.value[currentQuestionIndex.value]
  const mixedQuestion = { ...question }
  mixedQuestion.options = shuffleOptions([...question.options])
  return mixedQuestion
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

const timerColor = computed(() => {
  if (timeRemaining.value > 40) return 'text-green-500'
  if (timeRemaining.value > 20) return 'text-yellow-500'
  return 'text-red-500'
})

const questionsAnswered = computed(() => {
  return currentQuestionIndex.value + 1
})

function startGame() {
  shuffledQuestions.value = shuffleArray([...questions])
  gameStarted.value = true
  gameEnded.value = false
  resetQuiz()
  startTimer()
  timerInterval = setInterval(() => {
    if (timeRemaining.value <= 0) {
      endGame()
    }
  }, 1000)
}

function endGame() {
  clearInterval(timerInterval)
  gameEnded.value = true
  isTimerRunning.value = false
}

function selectAnswer(index) {
  if (showExplanation.value) return
  selectedAnswer.value = index

  const option = currentQuestion.value.options[index]
  const isCorrect = option.isCorrect === true
  answerQuestion(isCorrect)

  setTimeout(() => {
    if (!gameEnded.value && currentQuestionIndex.value < shuffledQuestions.value.length - 1) {
      nextQuestion()
      selectedAnswer.value = null
    } else if (!gameEnded.value) {
      endGame()
    }
  }, 1200)
}

function restartGame() {
  selectedAnswer.value = null
  gameStarted.value = false
  gameEnded.value = false
  shuffledQuestions.value = []
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

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  stopTimer()
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="!gameStarted" class="text-center py-12">
      <div class="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-5xl shadow-2xl">
        ⚡
      </div>
      <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-4">
        Speed Challenge
      </h2>
      <p class="text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
        Tienes <strong class="text-orange-500">60 segundos</strong> para responder tantas preguntas como puedas.
        ¡Cada respuesta correcta te da más puntos!
      </p>

      <div class="flex flex-col items-center gap-4 mb-8">
        <div class="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-bold shadow-lg">
          <span class="text-xl">🔥</span>
          <span>Bonus por racha: x{{ streak + 1 }}</span>
        </div>
        <div class="flex items-center gap-2 text-surface-600 dark:text-surface-400">
          <span>🎯</span>
          <span>{{ questions.length }} preguntas disponibles</span>
        </div>
      </div>

      <button
        @click="startGame"
        class="px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl font-bold rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-xl"
      >
        🚀 ¡Empezar!
      </button>
    </div>

    <div v-else-if="gameEnded" class="text-center py-8">
      <div class="text-7xl mb-6">🏁</div>
      <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">
        ¡Tiempo terminado!
      </h2>
      <p class="text-surface-500 dark:text-surface-400 mb-8">
        ¡Buen trabajo! Aquí están tus resultados:
      </p>

      <BaseCard class="p-8 max-w-md mx-auto mb-8">
        <div class="grid grid-cols-2 gap-8 text-center">
          <div class="relative">
            <p class="text-5xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">{{ score }}</p>
            <p class="text-surface-500 dark:text-surface-400 mt-2 font-medium">Puntos</p>
            <div v-if="pointsAnimation" class="absolute -top-2 right-0 text-green-500 font-bold animate-bounce">
              +{{ pointsAnimation }}
            </div>
          </div>
          <div>
            <p class="text-5xl font-bold text-orange-500">{{ streak }}</p>
            <p class="text-surface-500 dark:text-surface-400 mt-2 font-medium">Racha máxima</p>
          </div>
        </div>
        <div class="mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
          <p class="text-surface-600 dark:text-surface-400">
            <span class="font-bold text-green-500">{{ questionsAnswered }}</span> preguntas respondidas
          </p>
        </div>
      </BaseCard>

      <button
        @click="startGame"
        class="px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl font-bold rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-xl"
      >
        🔄 Jugar de nuevo
      </button>
    </div>

    <div v-else class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-4">
          <div class="text-3xl font-bold" :class="timerColor">
            ⏱️ {{ timeRemaining }}s
          </div>
          <div class="w-32 bg-surface-200 dark:bg-surface-700 rounded-full h-2 overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-1000"
              :style="{ width: `${(timeRemaining / 60) * 100}%` }"
            ></div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-bold shadow-lg">
            <span class="text-lg">🔥</span>
            <span>{{ streak }}</span>
            <span class="text-xs opacity-80">racha</span>
          </div>
          <div class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl text-white font-bold shadow-lg relative">
            <span class="text-lg">⭐</span>
            <span>{{ score }}</span>
            <span class="text-xs opacity-80">pts</span>
            <Transition name="bounce">
              <div v-if="pointsAnimation" class="absolute -top-8 left-1/2 -translate-x-1/2 text-green-400 font-bold text-sm">
                +{{ pointsAnimation }}
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <BaseCard v-if="currentQuestion" class="p-6 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
        
        <div class="mb-5">
          <code class="text-xl font-mono text-primary-600 dark:text-primary-400 bg-surface-100 dark:bg-surface-800 px-4 py-2 rounded-xl block">
            {{ currentQuestion.regexDisplay }}
          </code>
        </div>

        <h3 class="text-lg font-bold text-surface-900 dark:text-surface-100 mb-5">
          {{ currentQuestion.question }}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="selectAnswer(index)"
            :disabled="showExplanation"
            class="p-4 text-center rounded-xl border-2 transition-all duration-200 font-medium"
            :class="getOptionClass(index)"
          >
            <span class="text-surface-900 dark:text-surface-100">
              {{ option.text }}
            </span>
          </button>
        </div>
      </BaseCard>

      <Transition name="slide">
        <div v-if="showExplanation" class="text-center py-3">
          <div 
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg"
            :class="lastAnswerCorrect 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'"
          >
            <span class="text-2xl">{{ lastAnswerCorrect ? '✅' : '❌' }}</span>
            <span>{{ lastAnswerCorrect ? `¡Correcto! +${streak * 10} pts` : 'Incorrecto' }}</span>
          </div>
        </div>
      </Transition>
    </div>

    <div v-if="showTrivia && currentTrivia && gameStarted && !gameEnded" class="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50">
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
@keyframes bounce {
  0% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(-20px); opacity: 0; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.bounce-enter-active {
  animation: bounce 0.5s ease-out;
}

.slide-up-enter-active {
  animation: slide-up 0.3s ease-out;
}

.slide-enter-active {
  animation: slide 0.3s ease-out;
}
</style>