<template>
  <div class="flex flex-col bg-white rounded-lg overflow-hidden p-2">
    <img 
      :src="item.image || '/placeholder.svg?height=200&width=200'"
      alt="Class preview"
      class="w-full md:w-32 h-32 rounded-2xl object-cover mb-4"
    />
    <h3 class="text-blue-500 text-lg font-bold mb-2">{{ item.title || 'Level 3. Lesson 13' }}</h3>
    <p class="text-gray-600 text-sm mb-4 leading-relaxed">
      {{ item.description || 'The description of the lesson taken directly from the class description that we set at the lesson creation step. The search result should show any lesson from any course even if the student is not subscribed, the lesson should be indexed in any case.' }}
    </p>
    <button @click="openLesson" class="bg-blue-500 text-white px-8 py-1 rounded-lg  md:w-fit ">
      Open
    </button>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  item: Object
});

const openLesson = () => {
  console.log('Opening class:', props.item);
};
</script>