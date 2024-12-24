<template>
  <!-- Attention Box (Original) -->
  <div class="relative rounded-2xl p-8 border-2 border-orange-400" v-show="task.content_details[0].info_type === 'attention'">
    <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 z-1">
      <div class="w-10 h-10 rounded-full bg-gradient-to-b from-orange-400 to-red-500 flex items-center justify-center">
        <span class="text-white text-xl font-bold">!</span>
      </div>
    </div>

    <!-- Content section -->
    <div class="mt-4 text-center">
      <h2 class="text-2xl font-bold text-red-500 mb-4">{{ task.tittle }}</h2>
      <p class="text-gray-600">{{ task.instructions }}</p>
    </div>
  </div>

  <!-- Grammar Box -->
  <div class="relative rounded-2xl p-8 border-2 border-green-400" v-show="task.content_details[0].info_type === 'grammar'">
    <div class="absolute -left-5 top-1/2 transform -translate-y-1/2 z-1">
      <div class="w-10 h-10 rounded-full bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center">
        <span class="text-white text-xl font-bold">i</span>
      </div>
    </div>
    <div class="ml-4 text-left">
      <h2 class="text-2xl font-bold text-green-600 mb-4">{{ task.tittle }}</h2>
      <p class="text-gray-600">{{ task.instructions }}</p>
    </div>
  </div>

  <!-- Tip Box -->
  <div class="relative rounded-2xl p-8 border-2 border-blue-400" v-show="task.content_details[0].info_type === 'tip'">
    <div class="absolute -left-5 top-1/2 transform -translate-y-1/2 z-1">
      <div class="w-10 h-10 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center">
        <span class="text-white text-xl font-bold">💡</span>
      </div>
    </div>
    <div class="ml-4 text-left">
      <h2 class="text-2xl font-bold text-blue-600 mb-4">{{ task.tittle }}</h2>
      <p class="text-gray-600">{{ task.instructions }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  task: {
    instructions: string;
    tittle: string;
    content_details: Array<{ info_type: string }>;
  };
}>();
</script>
