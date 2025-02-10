<template>
  <h1 class="text-fuscous-gray-600 text-md font-bold">My words</h1>
  <div v-show="showAddWords" class="flex gap-2 relative">
    <IconMolecule
      @click="showAddWords = false"
      :name="IconType.previous"
      :size="24"
      color="text-gray-400 hover:text-[#4287DF]"

      class="cursor-pointer mt-4 bg-white rounded-lg px-1 w-fit h-fit p-2 md:left-4 left-1 z-50 sticky md:top-[40%] top-[20%]"
    />
    <AddWords class="flex-1" />
  </div>

  <AddCourseButton
    v-show="!showAddWords"
    text="Add or remove words"
    @handleAdd="showAddWords = true"
  />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"],
});
import AddCourseButton from "@/components/AddCourseButton.vue";
import AddWords from "@/components/organisim/templatesUsers/students/AddWords.vue";
import IconMolecule from "@/components/atomos/Icon.vue";
import { IconType } from "~/data/iconsType";
const showAddWords = ref(false);
</script>
