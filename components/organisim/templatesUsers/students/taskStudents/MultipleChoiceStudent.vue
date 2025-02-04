<template>
  <div class="multiple-choice-container">
   
    <div v-if="task.content_details && task.content_details.questions">
      <div v-for="(question, qIndex) in task.content_details.questions" :key="qIndex" class="question-container">
        <p class="text-lg font-semibold">
          {{ capitalizeFirstLetter(question.question) }}
        </p>
        
        <div v-for="(answer, aIndex) in question.answers" :key="aIndex">
          <label :class="getAnswerClasses(qIndex, aIndex)">
            <input 
              :type="getInputType(question.answers)"
              :name="`question-${qIndex}`"
              :value="answer.text"
              v-model="userAnswers[qIndex]"
              :disabled="isGraded"
              @change="handleAnswerChange(qIndex, answer.text)"
            />
            <span class="px-2">{{ answer.text }}</span>
          </label>
        </div>
      </div>

      <button 
        v-if="!isGraded && task.stats"
        @click="gradeAnswers" 
        class="bg-primary-color text-white px-4 py-2 rounded-md mt-4"
        :disabled="isGraded"
      >
        submit
      </button>

      <div v-if="isGraded" class="py-4">
        <p class="text-primary-color bg-tarawera-100 px-4 py-2 rounded-md">Puntuación: {{ score }} de {{ task.content_details.questions.length }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCapitalizerLetter } from "~/composables/useCapitalizerLetter";

const props = defineProps<{
  task: any;
}>();

const { capitalizeFirstLetter } = useCapitalizerLetter();
const userAnswers = ref(Array(props.task.content_details.questions.length).fill([]));
const isGraded = ref(false);
const score = ref(0);

const getInputType = (answers: any[]) => {
  const correctAnswers = answers.filter(answer => answer.isCorrect === true);
  return correctAnswers.length > 1 ? 'checkbox' : 'radio';
};

const getAnswerClasses = (qIndex: number, aIndex: number) => {
  const question = props.task.content_details.questions[qIndex];
  const answer = question.answers[aIndex];
  const baseClasses = {
    'answer-label': true,
    'radio': !getInputType(question.answers).includes('checkbox'),
    'checkbox': getInputType(question.answers).includes('checkbox'),
    'selected': isAnswerSelected(qIndex, answer.text),
  };

  if (isGraded.value) {
    baseClasses['correct'] = answer.isCorrect && isAnswerSelected(qIndex, answer.text);
    baseClasses['incorrect'] = !answer.isCorrect && isAnswerSelected(qIndex, answer.text);
  }

  return baseClasses;
};

const isAnswerSelected = (qIndex: number, answerText: string) => {
  const userAnswer = userAnswers.value[qIndex];
  return Array.isArray(userAnswer) 
    ? userAnswer.includes(answerText)
    : userAnswer === answerText;
};

const handleAnswerChange = (qIndex: number, answerText: string) => {
  console.log(`Pregunta ${qIndex + 1} - Opción seleccionada: ${answerText}`);
};

const gradeAnswers = () => {
  for (let i = 0; i < userAnswers.value.length; i++) {
    if (!userAnswers.value[i] || userAnswers.value[i].length === 0) {
      alert(`Por favor, selecciona al menos una respuesta para la pregunta ${i + 1}.`);
      return;
    }
  }

  let totalScore = 0;

  props.task.content_details.questions.forEach((question: any, qIndex: number) => {
    const userAnswer = userAnswers.value[qIndex];
    const correctAnswers = question.answers
      .filter((answer: any) => answer.isCorrect)
      .map((answer: any) => answer.text);

    if (getInputType(question.answers).includes('checkbox')) {
      const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      if (arraysEqual(userAnswerArray.sort(), correctAnswers.sort())) {
        totalScore++;
      }
    } else {
      if (correctAnswers.includes(userAnswer)) {
        totalScore++;
      }
    }
  });

  score.value = totalScore;
  isGraded.value = true;
};

const arraysEqual = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
};
</script>

<style scoped>
/* Add your styles here */
</style>
