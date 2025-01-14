<template v-if="data">
  <div v-if="data.image" class="w-2/4 flex items-start justify-center relative">
    <ImageViewer :image-url="imgUrl ? imgUrl : data.image" alt="Question Image" />
  </div>

  <div
    :class="{
      'w-full': true,
      'w-3/4': data.image,
      'pr-4': true,
    }"
  >
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
import ImageViewer from '~/components/molecule/multipleTask/ImageViewer.vue';

import { useTaskStore } from '~/stores/task.store';

const taskStore = useTaskStore();
const imgUrl = computed(() => taskStore.getTask('img_gen')?.url);

defineProps<{
  data: any;
}>();
</script>
