<template v-if="data">
  <div v-if="data.image" class="w-1/4 flex items-start justify-center">
    <img
      :src="data.image"
      alt="Question Image"
      class="w-full h-auto object-center rounded-[10px]"
    />
  </div>
  <div :class="{ 'w-full': true, 'w-3/4': data.image }">
    <audio
      v-if="data.audio"
      :src="data.audio"
      controls
      class="mb-4 w-full"
    ></audio>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: any;
}>();
</script>
