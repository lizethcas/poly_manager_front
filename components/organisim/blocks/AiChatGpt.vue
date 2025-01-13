<template>
    <div class="bg-[#f5f5f5] p-4 rounded-md shadow-md my-4 text-center flex flex-col gap-2 items-center justify-center " >
      <h2 class="text-xl text-fuscous-gray-600 font-bold">
        {{ index + 1 }}. {{ headdings[index + 1] }}
      </h2>
      <div class="flex justify-center items-center  h-96"">
        <InputFile
          fileType="image"
          icon="true"
          @file-selected="addNewImage"
          :showPreview="false"
          :preview="false"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const index = ref(0);
  const headdings: Record<number, string> = {
    1: "Background image",
    2: "Background",
    3: "Background",
    4: "Background",
    5: "Background",
    6: "Background",
    7: "Background",
    8: "Background",
    9: "Background",
    10: "Background",
  };
  const addNewImage = (file: File) => {
    console.log(file);
  };
  
  </script>
  