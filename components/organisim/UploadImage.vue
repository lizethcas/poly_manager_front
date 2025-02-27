<template>
  <div
    class="shadow-md shadow-fuscous-gray-300 rounded-lg p-2 flex items-center justify-between"
  >
    <InputFile
      fileType="image"
      :icon="true"
      title="Main image:"
      @file-selected="data.image = $event"
      :previewUrl="files?.image"
    />
    <div class="flex flex-col justify-between items-center">
      <AtomosButtonAtom type="crop" />
      <AtomosButtonAtom type="swap" />
      <AtomosButtonAtom type="delete" />
    </div>
  </div>
  <div class="shadow-md shadow-fuscous-gray-300 rounded-lg p-4">
    <div class="flex items-center justify-between">
      
      <InputFile
        fileType="audio"
        :icon="true"
        title="Audio file:"
        @file-selected="data.audio = $event"
        :previewUrl="files?.audio"
        :showPreview="true"
      />
      <div class="flex flex-col justify-between items-center">
        <AtomosButtonAtom type="swap" />
        <AtomosButtonAtom type="delete" />
      </div>
    </div>
    <slot />
  </div>
</template>
<script setup lang="ts">
import InputFile from "../InputFile.vue";
import AtomosButtonAtom from "../atomos/ButtonAtom.vue";
import { useTaskStore } from "~/stores/task.store";

const taskStore = useTaskStore();
const files = computed(() => taskStore.getTask("files"));
console.log(files.value);
const data = ref({
  image: null as File | null,
  audio: null as File | null,
});

// Watch for changes in data and update the store if needed
watch(data, (newData) => {
  if (newData.image || newData.audio) {
    taskStore.addTask('files', {
      image: newData.image ? URL.createObjectURL(newData.image) : files.value?.image,
      audio: newData.audio ? URL.createObjectURL(newData.audio) : files.value?.audio
    });
  }
}, { deep: true });
</script>
