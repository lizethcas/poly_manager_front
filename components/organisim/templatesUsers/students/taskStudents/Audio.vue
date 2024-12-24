<template>
  <div class="bg-white rounded-lg p-4 shadow-sm mb-4">
    <!-- Title section -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-medium">{{ task.title || "" }}</h3>
    </div>

    <!-- Audio player section -->
    <div class="relative bg-gray-100 rounded-xl p-2">
      <div class="flex p-2">
        <audio
          :src="task.audio"
          controls
          preload="metadata"
          class="flex-1 h-12 [&::-webkit-media-controls-panel]:bg-transparent"
        >
          <source :src="task.audio" type="audio/mp3" />
          Your browser does not support the audio tag.
        </audio>

        <!-- Script toggle button -->

        <button
          v-if="task.audio_transcription"
          @click="showScript = !showScript"
          class="hover:bg-gray-200 rounded-full transition-colors"
        >
          <Icon
            v-if="showScript"
            name="solar:eye-closed-bold"
            class="text-tarawera-600 group-hover:text-fuscous-gray-600"
            size="20"
          />

          <Icon
            v-else
            name="solar:list-bold"
            size="20"
            class="text-tarawera-600 group-hover:text-fuscous-gray-600"
          />
        </button>
      </div>
    </div>

    <!-- Script content -->
    <Transition name="slide-fade">
      <div 
        v-if="task.audio_transcription && showScript" 
        class="mt-4 overflow-hidden transform transition-all duration-300 ease-out"
      >
        <p class="text-gray-700 font-medium mb-2">Script:</p>
        <p class="text-gray-600">{{ task.audio_transcription }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "#components";

const props = defineProps<{
  task: {
    audio: string;
    title?: string;
    audio_transcription?: string;
  };
}>();

const showScript = ref(true);
</script>

<style>
.slide-fade-enter-active {
  @apply transition-all duration-300 ease-out;
}

.slide-fade-leave-active {
  @apply transition-all duration-300 ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  @apply transform translate-y-1 opacity-0;
}
</style>
