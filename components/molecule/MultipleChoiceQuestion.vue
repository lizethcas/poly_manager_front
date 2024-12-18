<template>
  <div class="mt-4">
    <h4 class="font-bold">{{ question.question }}</h4>
    <div v-for="(answer, index) in question.answers || question.text_items" 
         :key="index"
         :class="{ 'flex justify-start': answer.isCorrect, 'bg-tarawera-200': answer.isCorrect }">
      <p>{{ answer.text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Answer {
  text: string;
  isCorrect: boolean;
}

interface QuestionProps {
  question: {
    question: string;
    answers: Answer[];
    text_items: Answer[];
  }
}

defineProps<QuestionProps>();
</script> 