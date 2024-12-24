<template>
  <div class="relative p-8 w-full min-h-[420px] my-4">
    <!-- Background image container -->
    <div
      v-if="task.image"
      class="absolute top-0 left-0 w-full h-full bg-cover bg-center rounded-2xl"
      :style="`background-image: url('${task.image}')`"
    ></div>

    <!-- Video container -->
    <div
      class="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden z-5"
    >
      <div class="flex justify-start gap-2 my-2" v-show="task.tittle">
        <p class="bg-tarawera-200 text-tarawera-800 px-2 py-1 rounded-md">
          {{ index }}
        </p>
        <h3 class="text-lg font-bold bg-white text-tarawera-700 px-4">
          {{ capitalizeFirstLetter(task.tittle) }}
        </h3>
      </div>
      <p class="">{{ task.instructions}}</p>
      <video
        v-if="task.video"
        :src="task.video"
        class="w-[80%] aspect-video m-auto rounded-lg"
        controls
        preload="metadata"
      >
        <source :src="task.video" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCapitalizerLetter } from "~/composables/useCapitalizerLetter";

const { capitalizeFirstLetter } = useCapitalizerLetter();
interface Props {
  index?: number;
  task: any;
}

const { index, task } = defineProps<Props>();
</script>
