<template>
  <div class="w-full max-w-2xl mx-auto relative" ref="searchRef">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        <Icon name="search" size="16" />
      </div>
      <input
        type="search"
        placeholder="Buscar..."
        class="pl-10 bg-white border rounded-full h-10 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        v-model="query"
        @input="handleInput"
        @focus="handleFocus"
      />
    </div>
    
    <div 
      v-if="isOpen && filteredResults.length > 0" 
      class="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10 overflow-hidden"
    >
      <div class="flex">
        <!-- Lista de resultados -->
        <div class="w-1/2 border-r max-h-[70vh] overflow-y-auto p-2">
          <div v-for="(category, index) in filteredResults" :key="index" class="mb-4">
            <h3 class="text-sm font-medium text-blue-600 mb-1">{{ category.category }}</h3>
            <ul class="space-y-1">
              <li 
                v-for="(item, itemIndex) in category.items" 
                :key="itemIndex" 
                class="text-sm py-1 px-2 hover:bg-gray-100 rounded cursor-pointer flex items-start"
                @click="selectItem(item, category.category)"
                :class="{ 'bg-gray-100': selectedItem === item }"
              >
                <span class="text-gray-400 mr-2">•</span>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Panel de detalles dinámico -->
        <div v-if="selectedItem" class="w-1/2 max-h-[70vh] overflow-y-auto">
          <!-- Card para My notes -->
          <div v-if="selectedCategory === 'My notes:'" class="p-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-500 mb-1">{{ getCurrentDate() }}</div>
              <h3 class="text-lg font-semibold mb-3">Level 0, Lesson 25</h3>
              <div class="space-y-2 mb-4">
                <p class="text-gray-700">{{ selectedItem }}</p>
                <ol class="list-decimal ml-5 space-y-1">
                  <li>Good morning/afternoon/evening, [Boss's Name].</li>
                  <li>Hello, [Boss's Name]. How are you today?</li>
                  <li>Hi, [Boss's Name]. It's great to see you.</li>
                  <li>Good to see you, [Boss's Name].</li>
                  <li>Hi there, [Boss's Name]. How's everything going?</li>
                </ol>
              </div>
              <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full">
                open
              </button>
            </div>
          </div>

          <!-- Card para PolyAcademy classes -->
          <div v-else-if="selectedCategory === 'PolyAcademy classes:'" class="p-4">
            <div class="bg-white rounded-lg overflow-hidden border">
              <div class="relative">
                <img 
                  src="https://via.placeholder.com/400x200"
                  alt="Class preview"
                  class="w-full h-48 object-cover"
                />
                <div class="absolute top-2 left-2 flex items-center space-x-2">
                  <span class="bg-green-500 text-white text-xs px-2 py-1 rounded">NEW</span>
                  <span class="bg-gray-800 bg-opacity-50 text-white text-xs px-2 py-1 rounded">3D AGO</span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">{{ selectedItem }}</h3>
                <p class="text-sm text-gray-600 mb-4">Practice your English with interactive lessons and real-life scenarios.</p>
                <div class="flex justify-between items-center">
                  <button class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
                    start
                  </button>
                  <button class="text-gray-400 hover:text-gray-600">
                    <Icon name="more-horizontal" size="20" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Card para Speaking Scenarios -->
          <div v-else-if="selectedCategory === 'Speaking Scenarios:'" class="p-4">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold">{{ selectedItem }}</h3>
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Practice</span>
              </div>
              <p class="text-sm text-gray-600 mb-4">
                Master common speaking patterns and improve your conversation skills.
              </p>
              <div class="flex space-x-2">
                <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex-1">
                  Start Practice
                </button>
                <button class="border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors">
                  Preview
                </button>
              </div>
            </div>
          </div>

          <!-- Card para Grammar Plus -->
          <div v-else-if="selectedCategory === 'Grammar Plus:'" class="p-4">
            <div class="border-l-4 border-purple-500 bg-white rounded-lg p-4 shadow">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-lg font-semibold">{{ selectedItem }}</h3>
                <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Grammar</span>
              </div>
              <div class="space-y-3 mb-4">
                <p class="text-sm text-gray-600">
                  Master essential grammar concepts with clear explanations and examples.
                </p>
                <div class="flex items-center text-sm text-gray-500">
                  <Icon name="book-open" size="16" class="mr-2" />
                  <span>15 exercises included</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <button class="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors">
                  Start Learning
                </button>
                <div class="flex items-center space-x-2">
                  <button class="text-gray-400 hover:text-gray-600">
                    <Icon name="bookmark" size="20" />
                  </button>
                  <button class="text-gray-400 hover:text-gray-600">
                    <Icon name="share" size="20" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Icon from '~/components/atomos/Icon.vue';

const query = ref('');
const isOpen = ref(false);
const searchRef = ref(null);
const selectedItem = ref(null);
const selectedCategory = ref(null);

// Mock search results based on query
const searchResults = [
  {
    category: "PolyAcademy classes:",
    items: [
      "What would you like to have for breakfast?",
      "My ideal breakfast",
      "What's in the fridge?",
      "Welcome to my house!"
    ]
  },
  {
    category: "Speaking Scenarios:",
    items: [
      "The Present Simple for regular actions",
      "Giving Instructions in English"
    ]
  },
  {
    category: "Grammar Plus:",
    items: [
      "The Present Simple for regular actions",
      "Giving Instructions in English"
    ]
  },
  {
    category: "My notes:",
    items: [
      "12/07/2024, para saludar a tu jefe en ingles ..."
    ]
  }
];

const getCurrentDate = () => {
  const date = new Date();
  return date.toLocaleDateString('en-US');
};

const filteredResults = computed(() => {
  if (!query.value) return [];
  
  return searchResults.filter(category => 
    category.items.some(item => 
      item.toLowerCase().includes(query.value.toLowerCase())
    )
  );
});

const selectItem = (item, category) => {
  selectedItem.value = item;
  selectedCategory.value = category;
};

const handleInput = () => {
  isOpen.value = query.value.length > 0;
};

const handleFocus = () => {
  if (query.value) {
    isOpen.value = true;
  }
};

const handleClickOutside = (event) => {
  if (searchRef.value && !searchRef.value.contains(event.target)) {
    isOpen.value = false;
    selectedItem.value = null;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>