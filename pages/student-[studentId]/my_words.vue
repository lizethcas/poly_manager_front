<!-- <template>
  <h1 class="text-fuscous-gray-600 text-md font-bold">My words</h1>
  <div v-show="showAddWords" class="flex gap-2 relative">
    <IconMolecule
      @click="showAddWords = false"
      :name="IconType.previous"
      :size="24"
      color="text-gray-400 hover:text-[#4287DF]"

      class="cursor-pointer mt-4 bg-white rounded-lg px-1 w-fit h-fit p-2 md:left-4 left-1 z-50 sticky md:top-[40%] top-[20%]"
    />
    <AddWords class="flex-1" />
  </div>

  <AddCourseButton
    v-show="!showAddWords"
    text="Add or remove words"
    @handleAdd="showAddWords = true"
  />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"],
});
import AddCourseButton from "@/components/AddCourseButton.vue";
import AddWords from "@/components/organisim/templatesUsers/students/AddWords.vue";
import IconMolecule from "@/components/atomos/Icon.vue";
import { IconType } from "~/data/iconsType";
const showAddWords = ref(false);
</script> -->


<template>
  <h1 class="text-2xl font-medium text-gray-700 mb-4">My Words</h1>

  <!-- Barra de búsqueda -->
  <div class="relative mb-6">
    <input
      type="text"
      placeholder="Look up words or expressions"
      class="pl-8 pr-4 py-2 rounded-md bg-white border border-gray-200 w-full text-sm focus:outline-none"
    />
    <div class="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
    </div>
  </div>

  <!-- Categorías -->
  <div class="flex mb-6">
    <div class="flex flex-col items-center mr-8">
      <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
        <div class="w-6 h-6 bg-blue-500 rounded-sm"></div>
      </div>
      <span class="text-xs">Flashcards</span>
    </div>
    <div class="flex flex-col items-center mr-8">
      <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
        <div class="w-6 h-6 bg-blue-500 rounded"></div>
      </div>
      <span class="text-xs">Learn</span>
    </div>
    <div class="flex flex-col items-center">
      <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
        <div class="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center">
          <div class="w-3 h-3 bg-white"></div>
        </div>
      </div>
      <span class="text-xs">Test</span>
    </div>
  </div>

  <!-- Tarjeta principal -->
  <div class="mb-6 overflow-hidden rounded-lg ">
    <div class="flex justify-between items-center p-3 bg-white">
      <div class="flex items-center">
        <div class="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-2">
          <span class="text-xs">💡</span>
        </div>
        <span class="text-xs">get a hint</span>
      </div>
      <div class="text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6.5"></path><path d="M9 18H4a2 2 0 0 1-2-2v-5"></path><circle cx="9" cy="9" r="2"></circle><path d="m15 9 6 6"></path><path d="m21 9-6 6"></path></svg>
      </div>
    </div>
    
    <!-- Contenido de la tarjeta (clic para voltear) -->
    <div 
      class="h-48 flex items-center justify-center bg-white cursor-pointer"
      @click="handleFlip"
    >
      <div class="text-2xl font-medium">
        {{ isFlipped ? studyWords[currentIndex].spanish : studyWords[currentIndex].english }}
      </div>
    </div>
    
    <!-- Controles de la tarjeta -->
    <div class="flex justify-center items-center p-3 bg-blue-100 text-sm">
      <button class="px-3 py-1 bg-white rounded-md border border-gray-300 text-xs mr-2">
        Pass
      </button>
      <button class="px-3 py-1 bg-white rounded-md border border-gray-300 text-xs mr-2">
        Space
      </button>
      <span class="text-xs">or click on the card to flip</span>
    </div>
    
    <!-- Navegación -->
    <div class="flex justify-between items-center p-3 bg-white">
      <div class="flex items-center">
        <button class="text-green-500 p-1" @click="handleCorrect">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
        </button>
        <span class="mx-2 text-sm">{{ currentIndex + 1 }}/{{ studyWords.length }}</span>
        <button class="text-red-500 p-1" @click="handleIncorrect">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>
      <div class="flex items-center">
        <button class="text-gray-500 p-1 mr-2" @click="prevCard">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
        </button>
        <button class="text-gray-500 p-1 mr-2" @click="nextCard">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
        </button>
        <button class="text-gray-500 p-1 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        </button>
        <button class="text-gray-500 p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" x2="14" y1="3" y2="10"></line><line x1="3" x2="10" y1="21" y2="14"></line></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Lista de palabras para estudiar -->
  <div class="mb-4">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-medium text-gray-600">Words to study</h2>
      <div class="relative">
        <select class="appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-8 py-1 text-sm focus:outline-none">
          <option>All words</option>
          <option>New words</option>
          <option>Learned</option>
        </select>
        <div class="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg overflow-hidden border border-gray-200">
      <div v-for="(word, index) in studyWords.slice(0, 5)" :key="word.id" class="flex justify-between items-center p-3 border-b border-gray-100">
        <div class="flex-1">
          <div class="font-medium">{{ word.english }}</div>
          <div class="text-gray-500">{{ word.spanish }}</div>
        </div>
        <div class="flex items-center">
          <button class="p-1 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </button>
          <button class="p-1 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6.5"></path><path d="M9 18H4a2 2 0 0 1-2-2v-5"></path><circle cx="9" cy="9" r="2"></circle><path d="m15 9 6 6"></path><path d="m21 9-6 6"></path></svg>
          </button>
          <button class="p-1 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <div class="mt-4 flex justify-center">
      <button class="bg-blue-500 text-white px-4 py-2 rounded-md text-sm">
        add or remove words
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"],
});
import { ref } from 'vue'

// Array de palabras y sus traducciones
const words = [
  { id: 1, english: "turn left", spanish: "girar a la izquierda" },
  { id: 2, english: "turn right", spanish: "girar a la derecha" },
  { id: 3, english: "go straight on", spanish: "ir todo recto" },
  { id: 4, english: "go past", spanish: "pasar" },
  { id: 5, english: "stop", spanish: "detenerse" },
  { id: 6, english: "traffic light", spanish: "semáforo" },
  { id: 7, english: "roundabout", spanish: "rotonda" },
  { id: 8, english: "crossroads", spanish: "cruce" },
  { id: 9, english: "highway", spanish: "autopista" },
  { id: 10, english: "street", spanish: "calle" },
  { id: 11, english: "avenue", spanish: "avenida" },
  { id: 12, english: "bridge", spanish: "puente" },
  { id: 13, english: "tunnel", spanish: "túnel" },
  { id: 14, english: "parking lot", spanish: "estacionamiento" },
  { id: 15, english: "gas station", spanish: "gasolinera" },
  { id: 16, english: "bus stop", spanish: "parada de autobús" },
  { id: 17, english: "train station", spanish: "estación de tren" },
  { id: 18, english: "airport", spanish: "aeropuerto" },
  { id: 19, english: "taxi stand", spanish: "parada de taxi" },
  { id: 20, english: "pedestrian crossing", spanish: "paso de peatones" },
  { id: 21, english: "sidewalk", spanish: "acera" },
  { id: 22, english: "bicycle lane", spanish: "carril para bicicletas" },
  { id: 23, english: "one-way street", spanish: "calle de sentido único" },
  { id: 24, english: "dead end", spanish: "callejón sin salida" },
  { id: 25, english: "detour", spanish: "desvío" },
  { id: 26, english: "toll road", spanish: "carretera de peaje" },
  { id: 27, english: "speed limit", spanish: "límite de velocidad" },
  { id: 28, english: "yield", spanish: "ceder el paso" },
  { id: 29, english: "no parking", spanish: "prohibido estacionar" },
  { id: 30, english: "no entry", spanish: "prohibido el paso" },
  { id: 31, english: "road work", spanish: "obras en la carretera" },
  { id: 32, english: "school zone", spanish: "zona escolar" },
  { id: 33, english: "hospital zone", spanish: "zona hospitalaria" },
  { id: 34, english: "residential area", spanish: "zona residencial" },
]

const currentIndex = ref(0)
const isFlipped = ref(false)
const studyWords = ref(words)

// Función para voltear la tarjeta
const handleFlip = () => {
  isFlipped.value = !isFlipped.value
}

// Función para ir a la siguiente tarjeta
const nextCard = () => {
  isFlipped.value = false
  currentIndex.value = (currentIndex.value + 1) % studyWords.value.length
}

// Función para ir a la tarjeta anterior
const prevCard = () => {
  isFlipped.value = false
  currentIndex.value = (currentIndex.value - 1 + studyWords.value.length) % studyWords.value.length
}

// Función para marcar como correcta
const handleCorrect = () => {
  nextCard()
}

// Función para marcar como incorrecta
const handleIncorrect = () => {
  nextCard()
}
</script>

<style>
</style>

