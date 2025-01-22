<template>
  <div class="my-4">
    <p class="text-md">{{ taskData.text }}</p>
  </div>
</template>
<script lang="ts" setup>

interface TextBlock {
  text: string;
  columns: number;
}

interface Props {
  taskData: TextBlock;
}

defineProps<Props>();






</script>
