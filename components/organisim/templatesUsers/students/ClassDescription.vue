<template>
  <!-- Modal backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-between z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <!-- Modal container -->
    <div
      class="bg-white rounded-2xl p-6 shadow-lg max-w-3xl mx-auto flex gap-6 relative"
    >
      <!-- Left content section -->
      <div class="flex-1">
        <!-- Unit indicator -->
        <span
          class="inline-block px-3 font-bold rounded-md text-md mb-4 bg-[#E0EEEB] text-[#78CBB6]"
          role="text"
        >
          Unit {{ unit || 0 }}
        </span>

        <!-- Decorative zigzag -->
        <div class="text-yellow-400 text-m mb-4">〰️</div>

        <!-- Title -->
        <h1 id="modal-title" class="text-3xl font-bold mb-4">{{ name }}</h1>

        <!-- Description -->
        <h2
          class="bg-mint-100 py-2 rounded-md text-md mb-2 inline-block text-[#78CBB6] font-bold"
        >
          In this unit
        </h2>
        <p class="text-gray-600 mb-6">{{ description }}</p>

        <!-- Communicative topics -->
        <div class="mb-6">
          <h2 class="text-mint-600 mb-3">Communicative topics:</h2>
          <ul class="space-y-2">
            <li
              v-for="(point, index) in bulletPoints"
              :key="index"
              class="flex items-center gap-2"
            >
              <span
                v-show="point !== ''"
                class="bg-[#E0EEEB] w-6 h-6 rounded-lg flex items-center justify-center text-[#78CBB6] text-sm"
              >
                {{ index + 1 }}
              </span>
              <span class="text-gray-700">{{ point }}</span>
            </li>
          </ul>
        </div>

        <!-- Start lesson button -->
        <div class="flex gap-2">
          <button
            class="p-3 rounded-lg border border-gray-200"
            aria-label="Close modal"
            @click="$emit('close')"
          >
            <span class="text-gray-400">←</span>
          </button>
          <button
            @click="() => $emit('handleClick', courseId, id)"
            class="bg-[#78CBB6] text-white text-center px-6 py-3 rounded-lg flex-1"
            role="button"
            aria-label="Start the lesson"

          >
            {{ textButton }}
          </button>
        </div>
      </div>

      <!-- Right image section -->
      <div class="flex-1 flex items-center">
        <img
          :src="cover"
          :alt="`Cover image for ${name}`"
          class="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { routes } from "~/data/routes";

interface ClassDescriptionProps {
  name: string;
  description: string;
  bulletPoints: string[];
  unit?: string;
  cover: string;
  courseId: number;
  id: number;
  isOpen: boolean;
  textButton: string;
}

defineProps<ClassDescriptionProps>();
defineEmits<{
  (e: "close"): void;
  (e: "handleClick", courseId: number, id: number): void;
}>();
</script>
