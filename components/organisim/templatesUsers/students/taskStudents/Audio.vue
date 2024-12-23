<template>
  <div >
    <audio :src="task.audio" controls preload="metadata" class="w-full">
      <source :src="task.audio" type="audio/mp3" />
      Your browser does not support the audio tag.
    </audio>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  task: any;
}>();
</script>
