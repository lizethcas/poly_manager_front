<template>
  <div
    class="shadow-md shadow-fuscous-gray-300 rounded-lg p-2 flex items-center justify-between"
  >
    <InputFile
      fileType="image"
      icon="true"
      title="Main image:"
      @file-selected="data.image = $event"
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
        icon="true"
        title="Auio file:"
        @file-selected="data.audio = $event"
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
const data = ref({
  image: null as File | null,
  audio: null as File | null,
});

watch(
  data,
  (newValue) => {
    taskStore.addTask("files", {
      image: newValue.image,
      audio: newValue.audio,
    });
  },
  { deep: true }
);
</script>
