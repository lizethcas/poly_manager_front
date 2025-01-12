<template>
  <uploadImage />

  <MoleculeInput
    type="text_area"
    title="Add script"
    size="lg"
    container-class="py-2"
  />

  <NuxtLayout name="none">
    <TaskSelector />
  </NuxtLayout>
</template>

<script setup lang="ts">
import UploadImage from "~/components/organisim/UploadImage.vue";
import MoleculeInput from "~/components/molecule/Input.vue";
import TaskSelector from "~/components/organisim/TaskSelector.vue";
</script>
