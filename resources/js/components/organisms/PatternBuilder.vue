<script setup>
import { ref, computed } from 'vue'
import { useQuiz } from '@/composables/useQuiz'
import BaseCard from '@/components/atoms/BaseCard.vue'

const {
  builderComponents,
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

const selectedComponents = ref([])
const showResult = ref(false)
const isCorrect = ref(false)

const componentCategories = [
  {
    name: 'Anclas',
    icon: '⚓',
    color: 'blue',
    items: [
      { id: 'start', symbol: '^', name: 'Inicio', description: 'Coincide al inicio de la cadena' },
      { id: 'end', symbol: '$', name: 'Fin', description: 'Coincide al final de la cadena' },
      { id: 'boundary', symbol: '\\b', name: 'Límite', description: 'Límite entre palabras' },
    ]
  },
  {
    name: 'Metacaracteres',
    icon: '🔣',
    color: 'purple',
    items: [
      { id: 'dot', symbol: '.', name: 'Cualquiera', description: 'Cualquier carácter (excepto salto de línea)' },
      { id: 'digit', symbol: '\\d', name: 'Dígito', description: 'Cualquier número (0-9)' },
      { id: 'word', symbol: '\\w', name: 'Palabra', description: 'Letra, número o guión bajo' },
      { id: 'space', symbol: '\\s', name: 'Espacio', description: 'Espacio en blanco' },
    ]
  },
  {
    name: 'Cuantificadores',
    icon: '🔢',
    color: 'orange',
    items: [
      { id: 'plus', symbol: '+', name: 'Uno+', description: 'Una o más veces' },
      { id: 'star', symbol: '*', name: 'Cero+', description: 'Cero o más veces' },
      { id: 'optional', symbol: '?', name: 'Opcional', description: 'Cero o una vez' },
      { id: 'exact', symbol: '{3}', name: 'Exactos', description: 'Exactamente 3 veces' },
      { id: 'range', symbol: '{2,4}', name: 'Rango', description: 'Entre 2 y 4 veces' },
    ]
  },
  {
    name: 'Clases de Caracteres',
    icon: '📦',
    color: 'green',
    items: [
      { id: 'class', symbol: '[abc]', name: 'Clase', description: 'a, b o c' },
      { id: 'range', symbol: '[a-z]', name: 'Rango', description: 'Letras minúsculas' },
      { id: 'negate', symbol: '[^abc]', name: 'Negar', description: 'Cualquiera excepto a,b,c' },
    ]
  },
  {
    name: 'Grupos',
    icon: '👥',
    color: 'pink',
    items: [
      { id: 'group', symbol: '(abc)', name: 'Grupo', description: 'Agrupa expresiones' },
      { id: 'or', symbol: '|', name: 'O', description: 'Esta expresión O la otra' },
    ]
  }
]

const currentQuestion = computed(() => {
  const filtered = questions.filter(q => q.level === 'basico')
  if (currentQuestionIndex.value >= filtered.length) {
    return null
  }
  return filtered[currentQuestionIndex.value]
})

const totalQuestions = computed(() => questions.filter(q => q.level === 'basico').length)

const progress = computed(() => {
  if (totalQuestions.value === 0) return 0
  return ((currentQuestionIndex.value) / totalQuestions.value) * 100
})

const builtRegex = computed(() => {
  return selectedComponents.value.map(c => c.symbol).join('')
})

function addComponent(component) {
  if (!showExplanation.value) {
    selectedComponents.value.push(component)
  }
}

function removeComponent(index) {
  if (!showExplanation.value) {
    selectedComponents.value.splice(index, 1)
  }
}

function clearSelection() {
  selectedComponents.value = []
  showResult.value = false
}

function checkAnswer() {
  if (!currentQuestion.value) return

  const correctRegex = currentQuestion.value.regexDisplay
  isCorrect.value = builtRegex.value === correctRegex
  showResult.value = true
  answerQuestion(isCorrect.value)
}

function handleNext() {
  selectedComponents.value = []
  showResult.value = false
  nextQuestion()
}

function getCategoryColor(color) {
  const colors = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400', btn: 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-400', btn: 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-400', btn: 'bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800' },
    green: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-400', btn: 'bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800' },
    pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200 dark:border-pink-800', text: 'text-pink-700 dark:text-pink-400', btn: 'bg-pink-100 dark:bg-pink-900/40 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-800' },
  }
  return colors[color] || colors.blue
}

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value >= totalQuestions.value - 1
})

function handleFinishOrNext() {
  selectedComponents.value = []
  showResult.value = false
  nextQuestion()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-2xl shadow-lg">
          🧱
        </div>
        <div>
          <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Constructor de Regex
          </h2>
          <p class="text-sm text-surface-500 dark:text-surface-400">
            Construye la expresión correcta
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
        🎯 {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
      </span>
    </div>

    <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3 overflow-hidden">
      <div 
        class="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 h-3 rounded-full transition-all duration-500"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>

    <BaseCard v-if="currentQuestion" class="p-6">
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xl">📝</span>
          <span class="text-lg font-bold text-surface-900 dark:text-surface-100">
            {{ currentQuestion.question }}
          </span>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all text-center"
            :class="option.isCorrect
              ? 'bg-green-100 dark:bg-green-900/30 border-green-400 text-green-700 dark:text-green-400'
              : 'bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400'"
          >
            {{ option.text }}
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="bg-gradient-to-r from-surface-900 via-surface-800 to-surface-900 rounded-2xl p-6 mb-5 min-h-[120px] flex items-center flex-wrap gap-3 border-2 border-emerald-500/30 shadow-inner">
          <div v-if="selectedComponents.length === 0" class="w-full text-center">
            <p class="text-surface-400 text-lg mb-2">👇 Construye tu regex aquí</p>
            <p class="text-surface-500 text-sm">Haz click en los componentes de abajo</p>
          </div>
          <TransitionGroup name="pop">
            <button
              v-for="(comp, index) in selectedComponents"
              :key="index"
              @click="removeComponent(index)"
              :disabled="showExplanation"
              class="px-5 py-3 rounded-xl font-mono text-xl font-bold transition-all hover:scale-110 hover:rotate-3 cursor-pointer shadow-lg"
              :class="getCategoryColor(comp.color || 'purple').btn"
            >
              {{ comp.symbol }}
              <span class="ml-2 text-sm opacity-75 hidden md:inline">{{ comp.name }}</span>
            </button>
          </TransitionGroup>
        </div>

        <div class="text-center mb-5">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-surface-100 dark:bg-surface-800 rounded-xl">
            <span class="text-surface-500 font-medium">Tu regex:</span>
            <code class="text-2xl font-bold text-emerald-500 font-mono">{{ builtRegex || '...' }}</code>
          </div>
        </div>

        <div class="flex justify-center gap-3">
          <button
            @click="clearSelection"
            :disabled="showExplanation || selectedComponents.length === 0"
            class="px-6 py-3 rounded-xl font-bold bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-300 dark:hover:bg-surface-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <span>🗑️</span>
            <span>Limpiar</span>
          </button>
          <button
            @click="checkAnswer"
            :disabled="selectedComponents.length === 0 || showExplanation"
            class="px-8 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center gap-2"
          >
            <span>✅</span>
            <span>Verificar</span>
          </button>
        </div>
      </div>
    </BaseCard>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="category in componentCategories" 
        :key="category.name"
        class="rounded-2xl overflow-hidden"
      >
        <div 
          class="px-4 py-3 flex items-center gap-2"
          :class="getCategoryColor(category.color).bg + ' ' + getCategoryColor(category.color).text"
        >
          <span class="text-lg">{{ category.icon }}</span>
          <span class="font-bold">{{ category.name }}</span>
        </div>
        <div class="p-3 bg-surface-50 dark:bg-surface-900 grid grid-cols-2 md:grid-cols-3 gap-2">
          <button
            v-for="item in category.items"
            :key="item.id"
            @click="addComponent({...item, color: category.color})"
            :disabled="showExplanation"
            class="px-3 py-2 rounded-xl text-sm font-mono transition-all hover:scale-105 hover:shadow-md text-left"
            :class="getCategoryColor(category.color).btn"
          >
            <span class="font-bold text-base">{{ item.symbol }}</span>
            <span class="ml-1 text-xs opacity-75">{{ item.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="showResult" class="space-y-5 animate-fade-in">
      <div
        class="rounded-2xl p-6 border-2 shadow-2xl"
        :class="lastAnswerCorrect
          ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/30 border-green-400'
          : 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-800/30 border-red-400'"
      >
        <div class="flex items-start gap-4 mb-4">
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
          <div v-if="!lastAnswerCorrect" class="mt-3 p-3 bg-surface-100 dark:bg-surface-800 rounded-lg">
            <p class="text-sm text-surface-500 dark:text-surface-400">Regex correcta:</p>
            <code class="text-primary-500 font-mono">{{ currentQuestion.regexDisplay }}</code>
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
          <div class="text-xs font-normal opacity-80">{{ isLastQuestion ? 'Nivel completado!' : `Pregunta ${currentQuestionIndex + 2} de ${totalQuestions}` }}</div>
        </div>
      </button>
    </div>

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
@keyframes pop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.pop-enter-active {
  animation: pop 0.3s ease-out;
}

.animate-fade-in {
  animation: slide-up 0.4s ease-out forwards;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>