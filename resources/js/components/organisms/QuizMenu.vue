<script setup>
const emit = defineEmits(['select'])

const modes = [
  {
    id: 'progressive',
    name: 'Progresivo',
    icon: '📈',
    description: 'Aprende por niveles: Básico, Intermedio, Avanzado',
    color: 'from-blue-500 to-blue-600',
    hoverColor: 'hover:from-blue-600 hover:to-blue-700'
  },
  {
    id: 'builder',
    name: 'Constructor',
    icon: '🧱',
    description: 'Arma la regex arrastrando componentes visuales',
    color: 'from-emerald-500 to-emerald-600',
    hoverColor: 'hover:from-emerald-600 hover:to-emerald-700'
  },
  {
    id: 'speed',
    name: 'Velocidad',
    icon: '⚡',
    description: 'Responde rápido antes de que se agote el tiempo',
    color: 'from-orange-500 to-orange-600',
    hoverColor: 'hover:from-orange-600 hover:to-orange-700'
  },
  {
    id: 'fix',
    name: 'Corrige',
    icon: '🔧',
    description: 'Encuentra y repara los errores en las regex',
    color: 'from-purple-500 to-purple-600',
    hoverColor: 'hover:from-purple-600 hover:to-purple-700'
  }
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <button
      v-for="mode in modes"
      :key="mode.id"
      @click="emit('select', mode.id)"
      class="group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      :class="mode.hoverColor"
    >
      <div
        class="absolute inset-0 opacity-90"
        :class="`bg-gradient-to-br ${mode.color}`"
      ></div>

      <div class="relative z-10">
        <div class="flex items-center gap-4 mb-4">
          <span class="text-4xl group-hover:scale-110 transition-transform duration-300">
            {{ mode.icon }}
          </span>
          <div>
            <h3 class="text-xl font-bold text-white">
              {{ mode.name }}
            </h3>
            <p class="text-white/80 text-sm">
              Modalidad
            </p>
          </div>
        </div>

        <p class="text-white/90 text-sm leading-relaxed">
          {{ mode.description }}
        </p>

        <div class="mt-4 flex items-center text-white/70 text-sm group-hover:text-white transition-colors">
          <span>Comenzar</span>
          <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
    </button>
  </div>
</template>