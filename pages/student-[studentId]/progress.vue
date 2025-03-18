<template>
  <div class="bg-gray-50 p-6 max-w-4xl mx-auto">
    <!-- Goal Section -->
    <div class="bg-white rounded-lg p-4 mb-6 shadow-sm flex items-center">
      <div class="bg-blue-100 rounded-full p-3 mr-4">
        <div class="relative">
          <img
            src="
https://via.placeholder.com
          "
            alt="Mountain icon"
            class="w-10 h-10"
          />
          <div
            class="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center"
          >
            <span class="text-white text-xs">2</span>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <div class="text-gray-500 text-sm font-medium">Goal:</div>
        <div class="font-medium">{{ userData.goal.title }}</div>
        <div class="text-sm text-gray-500">
          Reached:
          <span class="font-medium"
            >{{ userData.goal.progress }}% out of
            {{ userData.goal.total }}</span
          >
        </div>
      </div>
    </div>

    <!-- History Section -->
    <div class="mb-8">
      <h2 class="text-xl font-medium text-gray-700 mb-4">History</h2>

      <!-- Log History -->
      <div class="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium">Log History</h3>
          <div class="text-gray-500">
            {{ userData.history.month }} {{ userData.history.year }}
          </div>
        </div>

        <!-- Calendar -->
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <button class="text-gray-400"><i-lucide-chevron-left /></button>
            <button class="text-gray-400"><i-lucide-chevron-right /></button>
          </div>
          <div class="grid grid-cols-7 gap-1 text-center">
            <div
              v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']"
              :key="day"
              class="text-xs text-gray-500 py-1"
            >
              {{ day }}
            </div>
            <template
              v-for="(day, index) in userData.history.calendar"
              :key="index"
            >
              <div
                :class="[
                  'rounded-full h-7 w-7 flex items-center justify-center text-xs',
                  day.active
                    ? 'bg-blue-500 text-white'
                    : day.current
                    ? 'border border-blue-500 text-blue-500'
                    : 'text-gray-500',
                ]"
              >
                {{ day.date > 0 ? day.date : "" }}
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Study Time -->
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-medium">Study Time (minutes)</h3>
          <div class="flex items-center">
            <span class="text-gray-500 mr-2">Progress</span>
            <span class="text-red-500 font-medium">{{
              userData.studyTime.progress
            }}</span>
          </div>
        </div>

        <!-- Chart -->
        <!-- Chart -->
<div class="relative flex items-end h-32 mb-6">
  <!-- Líneas de referencia horizontales -->
  <div class="absolute inset-0 flex flex-col justify-between">
    <div v-for="i in 5" :key="i" class="border-t border-gray-100 w-full h-0"></div>
  </div>
  
  <!-- Barras del gráfico -->
  <div
    v-for="(day, index) in userData.studyTime.data"
    :key="index"
    class="relative flex-1 mx-1 flex flex-col items-center group"
  >
    <!-- Valor sobre la barra al pasar el cursor -->
    <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none">
      {{ day.minutes }} min
    </div>
    
    <!-- Barra con gradiente y animación -->
    <div
      class="w-full rounded-t-md transition-all duration-700 ease-out"
      :class="getBarColorClass(day.minutes)"
      :style="{
        height: `${Math.max((day.minutes / userData.studyTime.maxMinutes) * 100, 2)}%`,
        minHeight: '4px',
      }"
    ></div>
    
    <!-- Indicador cuando supera cierto umbral -->
    <div v-if="day.minutes > 75" class="mt-1 w-2 h-2 rounded-full bg-green-500"></div>
  </div>
</div>

<!-- X-axis labels -->
<div class="flex justify-between text-xs text-gray-500 px-1">
  <div
    v-for="(day, index) in userData.studyTime.data" 
    :key="index"
    class="flex-1 text-center font-medium"
  >
    {{ day.date }}
  </div>
</div>

  
      
      </div>
    </div>

    <!-- Current Level Section -->
    <div class="mb-8">
      <h2 class="text-xl font-medium text-gray-700 mb-4">My current level</h2>

      <div class="bg-white rounded-lg p-4 shadow-sm">
        <div v-for="skill in userData.skills" :key="skill.name" class="mb-4">
          <div class="flex items-center mb-1">
            <i-lucide-book
              v-if="skill.name === 'Reading'"
              class="mr-2 text-gray-500"
            />
            <i-lucide-headphones
              v-else-if="skill.name === 'Listening'"
              class="mr-2 text-gray-500"
            />
            <i-lucide-layout
              v-else-if="skill.name === 'Structures'"
              class="mr-2 text-gray-500"
            />
            <i-lucide-message-circle
              v-else-if="skill.name === 'Speaking'"
              class="mr-2 text-gray-500"
            />
            <i-lucide-mic
              v-else-if="skill.name === 'Pronunciation'"
              class="mr-2 text-gray-500"
            />
            <span class="text-gray-700">{{ skill.name }}</span>

            <div
              v-if="skill.goalReached"
              class="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full"
            >
              Goal reached!
            </div>
          </div>

          <div class="h-2 rounded-full overflow-hidden bg-gray-200">
            <div
              class="h-full rounded-full"
              :class="getSkillColorClass(skill.name)"
              :style="{ width: `${skill.progress}%` }"
            ></div>
          </div>

          <div class="text-right text-sm text-gray-500 mt-1">
            {{ skill.progress }}%
          </div>
        </div>
      </div>
    </div>

    <!-- Tip Section -->
    <div class="flex mb-8">
      <div class="bg-white rounded-lg p-4 shadow-sm flex-1">
        <div class="flex items-start">
          <div class="bg-red-100 rounded-full p-2 mr-3">
            <div class="text-red-500">
              <i-lucide-target class="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 class="font-medium mb-1">Pay attention to your speaking!</h3>
            <p class="text-sm text-gray-600 mb-4">
              Speaking is an integral part of fluency, and many students
              struggle with it. We recommend you make use of Speaking practice
              as much as possible.
            </p>
            <button class="bg-blue-500 text-white px-4 py-2 rounded-md text-sm">
              Check Someone
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Achievements Section -->
    <div>
      <h2 class="text-xl font-medium text-gray-700 mb-4">My achievements</h2>

      <div class="bg-white rounded-lg p-4 shadow-sm">
        <div class="flex flex-wrap">
          <div
            v-for="(achievement, index) in userData.achievements"
            :key="index"
            class="mr-4 mb-4 relative"
          >
            <div :class="`bg-${achievement.color}-100 rounded-full p-3`">
              <img
                :src="achievement.icon"
                :alt="achievement.name"
                class="w-10 h-10"
              />
            </div>
            <div
              v-if="achievement.isNew"
              class="absolute -top-2 -right-2 bg-red-400 text-white text-xs px-2 py-0.5 rounded-full"
            >
              NEW
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// import Calendar2 from '~/components/Calendar2.vue';
definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"],
});

//Datos simulados que vendrían del backend
const userData = {
  goal: {
    title: "Reach level B2 for a promotion at work",
    progress: 45,
    total: 1000,
  },
  history: {
    month: "December",
    year: 2024,
    calendar: [
      { date: 0, active: false, current: false },
      { date: 0, active: false, current: false },
      { date: 0, active: false, current: false },
      { date: 0, active: false, current: false },
      { date: 0, active: false, current: false },
      { date: 1, active: false, current: false },
      { date: 2, active: false, current: false },
      { date: 3, active: false, current: false },
      { date: 4, active: false, current: false },
      { date: 5, active: false, current: false },
      { date: 6, active: false, current: false },
      { date: 7, active: false, current: false },
      { date: 8, active: false, current: false },
      { date: 9, active: false, current: false },
      { date: 10, active: false, current: false },
      { date: 11, active: false, current: false },
      { date: 12, active: true, current: false },
      { date: 13, active: false, current: false },
      { date: 14, active: false, current: false },
      { date: 15, active: false, current: false },
      { date: 16, active: false, current: false },
      { date: 17, active: false, current: false },
      { date: 18, active: false, current: false },
      { date: 19, active: false, current: false },
      { date: 20, active: true, current: false },
      { date: 21, active: false, current: false },
      { date: 22, active: false, current: false },
      { date: 23, active: false, current: false },
      { date: 24, active: true, current: false },
      { date: 25, active: false, current: false },
      { date: 26, active: false, current: false },
      { date: 27, active: false, current: false },
      { date: 28, active: false, current: false },
      { date: 29, active: false, current: false },
      { date: 30, active: false, current: false },
      { date: 31, active: true, current: true },
      { date: 0, active: false, current: false },
      { date: 0, active: false, current: false },
      { date: 0, active: false, current: false },
      { date: 0, active: false, current: false },
    ],
  },
  studyTime: {
    progress: "-2%",
    maxMinutes: 100,
    data: [
      { date: "12.01", minutes: 70 },
      { date: "12.02", minutes: 85 },
      { date: "12.03", minutes: 65 },
      { date: "12.04", minutes: 75 },
      { date: "12.05", minutes: 60 },
      { date: "12.06", minutes: 80 },
      { date: "12.07", minutes: 55 },
    ],
  },
  skills: [
    { name: "Reading", progress: 100, goalReached: true },
    { name: "Listening", progress: 75, goalReached: false },
    { name: "Structures", progress: 80, goalReached: false },
    { name: "Speaking", progress: 65, goalReached: false },
    { name: "Pronunciation", progress: 75, goalReached: false },
  ],
  achievements: [
    {
      name: "Trophy",
      icon: "/placeholder.svg?height=40&width=40",
      color: "blue",
      isNew: false,
    },
    {
      name: "Star",
      icon: "/placeholder.svg?height=40&width=40",
      color: "yellow",
      isNew: false,
    },
    {
      name: "Cup",
      icon: "/placeholder.svg?height=40&width=40",
      color: "orange",
      isNew: false,
    },
    {
      name: "Idea",
      icon: "/placeholder.svg?height=40&width=40",
      color: "yellow",
      isNew: true,
    },
    {
      name: "Badge",
      icon: "/placeholder.svg?height=40&width=40",
      color: "pink",
      isNew: true,
    },
  ],
};

// Función para determinar el color de la barra según el valor
const getBarColorClass = (minutes) => {
  if (minutes >= 80) return 'bg-gradient-to-t from-blue-400 to-blue-600';
  if (minutes >= 65) return 'bg-gradient-to-t from-blue-300 to-blue-500'; 
  if (minutes >= 50) return 'bg-gradient-to-t from-blue-200 to-blue-400';
  return 'bg-gradient-to-t from-blue-100 to-blue-300';
};

// Función para obtener la clase de color según la habilidad
const getSkillColorClass = (skillName) => {
  const colorMap = {
    Reading: "bg-green-500",
    Listening: "bg-purple-500",
    Structures: "bg-orange-500",
    Speaking: "bg-blue-500",
    Pronunciation: "bg-pink-500",
  };

  return colorMap[skillName] || "bg-gray-500";
};
</script>
