<template >
  <!-- Attention Box -->
  <div 
    class="relative rounded-3xl p-8 border-[3px] border-orange-400 bg-white  mx-auto"
    v-show="task.content_details[0].info_type === 'attention'"
    role="alert"
    aria-labelledby="attention-title"
  >
    <!-- Add a pseudo-element for the curved border -->
    <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-white border-[3px] border-b-0 border-orange-400 rounded-t-full"></div>
    
    <!-- Icon container -->
    <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10 -mt-4">
      <div class=" w-16 h-16 rounded-full bg-gradient-to-b from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
        <span class="text-white text-2xl font-bold " aria-hidden="true">!</span>
      </div>
    </div>

    <!-- Content section -->
    <div class="mt-2 text-center p-10">
      <h2 id="attention-title" class="text-xl font-bold text-red-500 mb-4">{{ task.tittle }}</h2>
      <p class="text-gray-600 text-start text-lg leading-relaxed mt-6 break-words text-md">{{ task.instructions }}</p>
    </div>
  </div>

  <!-- Grammar Box -->
  <div class="relative rounded-2xl p-8 border-2 border-green-400" v-show="task.content_details[0].info_type === 'grammar'">
    <!-- Modified semi-circle container -->
    <div class="absolute -left-12 top-1/2 transform -translate-y-1/2">
      <div class="relative w-12 h-20 bg-white border-2 border-r-0 border-green-400 rounded-l-full flex items-center">
        <div class="absolute left-0 w-16 h-16 rounded-full bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center ml-2">
          <span class="text-white text-xl font-bold">i</span>
        </div>
      </div>
    </div>
    <div class="ml-4 text-left">
      <h2 class="text-2xl font-bold text-green-600 mb-4">{{ task.tittle }}</h2>
      <p class="text-gray-600 p-10 break-words text-md">{{ task.instructions }}</p>
    </div>
  </div>

  <!-- Tip Box -->
  <div class="relative rounded-2xl p-8 border-2 border-blue-400" v-show="task.content_details[0].info_type === 'tip'">
    <!-- Modified semi-circle container to match grammar box -->
    <div class="absolute -left-12 top-1/2 transform -translate-y-1/2">
      <div class="relative w-12 h-20 bg-white border-2 border-r-0 border-blue-400 rounded-l-full flex items-center">
        <div class="absolute left-0 w-16 h-16 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center ml-2">
          <span class="text-white text-xl font-bold">💡</span>
        </div>
      </div>
    </div>
    <div class="ml-4 text-left">
      <h2 class="text-2xl font-bold text-blue-600 mb-4">{{ task.tittle }}</h2>
      <p class="text-gray-600 p-10 break-words text-md">{{ task.instructions }}</p>
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
