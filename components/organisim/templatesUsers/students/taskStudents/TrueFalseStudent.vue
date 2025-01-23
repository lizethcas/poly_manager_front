<template>
  <div class="bg-gray-100 p-2 sm:p-4 rounded-lg">
    <div
      v-for="(question, index) in task.content_details.questions"
      :key="index"
      class="mb-4"
    >
    <h2 class="text-sm sm:text-md font-medium text-gray-700 mb-2 ">
        <span class="font-bold">Question {{ index + 1 }}:</span>
        {{ question.statement }}
      </h2>
      <div class="flex flex-col sm:flex-row gap-2 bg-gray-50 p-2  rounded-lg">
        <button
          @click="selectAnswer(index, 'True')"
          :class="[
            'px-4 sm:px-6 py-1.5 rounded-full border transition-colors w-full sm:w-auto',
            answers[index] === 'True'
              ? answers[index] === question.stated
                ? 'bg-green-50 border-green-300 text-green-500'
                : 'bg-red-50 border-red-300 text-red-500'
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50',
          ]"
        >
          True
        </button>
        <button
          @click="selectAnswer(index, 'False')"
          :class="[
            'px-4 sm:px-6 py-1.5 rounded-full border transition-colors w-full sm:w-auto',
            answers[index] === 'False'
              ? 'False' === question.stated
                ? 'bg-green-50 border-green-300 text-green-500'
                : 'bg-red-50 border-red-300 text-red-500'
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50',
          ]"
        >
          False
        </button>
        <button
          @click="selectAnswer(index, 'Not stated')"
          :class="[
            'px-4 sm:px-6 py-1.5 rounded-full border transition-colors w-full sm:w-auto',
            answers[index] === 'Not stated'
              ? 'Not stated' === question.stated
                ? 'bg-green-50 border-green-300 text-green-500'
                : 'bg-red-50 border-red-300 text-red-500'
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50',
          ]"
        >
          Not Stated
        </button>
      </div>
    </div>

    <!-- Add Score display -->
    <div class="mt-4 text-right" role="status" aria-live="polite">
      Score: {{ score }}/{{ totalQuestions }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Question {
  statement: string;
  stated: string;
}

interface Task {
  id: number;
  tittle: string;
  instructions: string;
  content_details: {
    questions: Question[];
  };
}

const props = defineProps<{
  task: Task;
}>();

const answers = ref<string[]>([]);
const score = ref(0);
const totalQuestions = computed(() => props.task.content_details.questions.length);
const emit = defineEmits(["answer-selected", "score-updated"]);

const selectAnswer = (questionIndex: number, answer: string) => {
  answers.value[questionIndex] = answer;
  const isCorrect =
    answer === props.task.content_details.questions[questionIndex].stated;

  // Update score after each answer
  updateScore();

  // Emit both events
  emit("answer-selected", {
    questionIndex,
    answer,
    isCorrect,
    totalAnswered: answers.value.filter(a => a).length,
  });
  
  emit("score-updated", {
    score: score.value,
    total: totalQuestions.value,
    completed: answers.value.filter(a => a).length === totalQuestions.value
  });
};

const updateScore = () => {
  score.value = props.task.content_details.questions.reduce((total, question, index) => {
    if (!answers.value[index]) return total; // Skip unanswered questions
    return total + (answers.value[index] === question.stated ? 1 : 0);
  }, 0);
};
</script>
