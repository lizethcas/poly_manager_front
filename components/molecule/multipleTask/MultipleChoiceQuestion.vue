<template>
  <div class=" w-full mt-4 border-r-2 border-l-2 border-t-2 border-b-2 border-tarawera-200 rounded-[10px] p-2" >
    <h4 class="font-bold">{{ question.question }}</h4>
    <div v-for="(answer, index) in question.answers || question.text_items" 
         :key="index"
         :class="{ 'flex justify-start': answer.isCorrect, 'bg-tarawera-200': answer.isCorrect }"
         class="rounded-[10px]">
      <p class="m-1">{{ answer.text }}</p>
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