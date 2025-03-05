<template>
  <div class="bg-white rounded-lg overflow-hidden shadow-lg">
    <div class="relative">
      <img
        :src="item.cover || 'https://via.placeholder.com/400x200'"
        alt="Class preview"
        class="w-full h-48 object-cover"
      />
      <div class="absolute top-2 left-2 flex items-center space-x-2">
        <span class="bg-green-500 text-white text-xs px-2 py-1 rounded"
          >NEW</span
        >
        <span
          class="bg-gray-800 bg-opacity-50 text-white text-xs px-2 py-1 rounded"
          >3D AGO</span
        >
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2 text-blue-400">{{ item.title }}</h3>
      <p class="text-sm text-gray-600 mb-4">{{ item.description }}</p>
      <div class="flex justify-between items-center">
        <button
          @click="openLesson"
          class="bg-blue-500 text-white px-6 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Open
        </button>
        <button class="text-gray-400 hover:text-gray-600">
          <Icon name="more-horizontal" size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import Icon from "~/components/atomos/Icon.vue";

const props = defineProps({
  item: Object,
});

console.log(props.item);

const openLesson = () => {
  console.log("Opening course:", props.item);
};
</script>
