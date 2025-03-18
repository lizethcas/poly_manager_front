<template>
  <div
    class="w-60 p-5 bg-white shadow-sm border-l border-gray-200 overflow-y-auto rounded-xl h-full"
  >
    <!-- Saludo y avatar -->
    <div class="flex items-start mb-4">
      <div
        class="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center mr-3"
      >
        <span class="text-xl">{{ avatar || "🤖" }}</span>
      </div>
      <div>
        <p class="text-sm font-medium">
          Hello, <span class="text-blue-600">{{ userName }}</span
          >! Nice to see you again! Here's your latest achievements:
        </p>
      </div>
    </div>

    <!-- Progress section -->
    <div class="mb-4">
      <h3 class="font-semibold text-gray-700 mb-2">Your Progress:</h3>

      <div class="space-y-3">
        <!-- Lessons -->
        <div class="flex items-center">
          <div
            class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-blue-500"
            >
              <path
                d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
              ></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-sm">Lessons</p>
            <p class="text-xs text-gray-500">
              Chapter {{ progress?.lessons?.chapter || 0 }}
            </p>
          </div>
        </div>

        <!-- Speaking practice -->
        <div class="flex items-center">
          <div
            class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-indigo-500"
            >
              <path
                d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
              ></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
          </div>
          <div>
            <p class="font-medium text-sm">Speaking practice</p>
            <p class="text-xs text-gray-500">
              {{ progress?.speaking?.hours || 0 }} hours
            </p>
          </div>
        </div>

        <!-- Hours -->
        <div class="flex items-center">
          <div
            class="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center mr-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-cyan-500"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div>
            <p class="font-medium text-sm">Hours</p>
            <p class="text-xs text-gray-500">
              Total: {{ progress?.totalHours || 0 }} hours
              {{ progress?.totalMinutes || 0 }} minutes
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Information section -->
    <div class="mb-4">
      <h3 class="font-semibold text-gray-700 mb-2">Information:</h3>

      <div class="space-y-3">
        <!-- Average score -->
        <div class="flex items-center">
          <div
            class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-green-500"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-sm">Your average score</p>
            <p class="text-xs text-gray-500" v-if="information?.averageScore">
              {{ information.averageScore }}%
            </p>
          </div>
        </div>

        <!-- Learnt words -->
        <div class="flex items-center">
          <div
            class="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-teal-500"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              ></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-sm">Learnt words</p>
            <p class="text-xs text-gray-500">
              {{ information?.learnedWords || 0 }} new words
            </p>
          </div>
        </div>
      </div>

      <div class="text-right mt-1" v-if="showViewDetails">
        <a href="#" class="text-xs text-blue-500">View details</a>
      </div>
    </div>

    <!-- Message input -->
    <!-- Mensaje a Pollie -->
    <div
      class="mt-4 bg-gray-50 rounded-xl p-3 shadow-sm border border-gray-100"
      v-if="showMessageBox"
    >
      <p class="text-sm font-medium text-gray-600 mb-2">
        Do you need something else?
      </p>

      <!-- Campo de entrada de mensaje -->
      <div class="relative">
        <input
          v-model="messageText"
          type="text"
          placeholder="Type your message here..."
          class="w-full p-2 pr-10 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none"
          @keyup.enter="sendMessage"
        />

        <!-- Botón de envío -->
        <button
          @click="sendMessage"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors"
          :disabled="!messageText.trim()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-blue-500"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>

      <!-- Mensaje de asistencia -->
      <p class="text-xs text-gray-400 mt-1">Message Pollie for assistance</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// Definición de las interfaces para las props
interface Progress {
  lessons?: {
    chapter: number;
  };
  speaking?: {
    hours: number;
  };
  totalHours?: number;
  totalMinutes?: number;
}

interface Information {
  averageScore?: number;
  learnedWords?: number;
}

// Propiedades del componente
defineProps({
  userName: {
    type: String,
    default: "User",
  },
  avatar: {
    type: String,
    default: "🤖",
  },
  progress: {
    type: Object as PropType<Progress>,
    default: () => ({
      lessons: { chapter: 0 },
      speaking: { hours: 0 },
      totalHours: 0,
      totalMinutes: 0,
    }),
  },
  information: {
    type: Object as PropType<Information>,
    default: () => ({
      averageScore: 0,
      learnedWords: 0,
    }),
  },
  showViewDetails: {
    type: Boolean,
    default: true,
  },
  showMessageBox: {
    type: Boolean,
    default: true,
  },
});

// Estado para el mensaje
const messageText = ref("");

// Eventos emitidos
const emit = defineEmits(['message']);

const sendMessage = () => {
  if (messageText.value.trim()) {
    emit("message", messageText.value);
    messageText.value = ""; // Limpiar el campo después de enviar
  }
};
</script>
