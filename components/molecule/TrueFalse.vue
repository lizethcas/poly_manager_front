<template>
    <div class="mt-4">
      <h4 class="font-bold mb-3">{{ question.statement }}</h4>
      <div class="flex gap-4">
        <p class="px-4 py-2 rounded-md" 
           :class="{ 'bg-tarawera-200': question.stated === 'True' }">True</p>
        <p class="px-4 py-2 rounded-md" 
           :class="{ 'bg-tarawera-200': question.stated === 'False' }">False</p>
        <p class="px-4 py-2 rounded-md" 
           :class="{ 'bg-tarawera-200': question.stated === 'Not stated' }">Not stated</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface QuestionProps {
    question: {
      statement: string;
      stated: 'True' | 'False' | 'Not stated';
    }
  }
  
  defineProps<QuestionProps>();
  </script>