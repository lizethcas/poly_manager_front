<template>
  <div class="relative p-8 w-full min-h-[420px]">
    <!-- Background image container -->
    <div
      v-if="task.image"
      class="absolute top-0 left-0 w-full h-1/2 bg-cover bg-center rounded-t-2xl"
      :style="`background-image: url('${task.image}')`"
    ></div>

    <!-- Video container -->
    <div
      class="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden z-5"
    >
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

<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
</script>
