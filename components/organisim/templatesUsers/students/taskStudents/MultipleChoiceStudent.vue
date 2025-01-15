<template>
  <div class="multiple-choice-container">
    <h2>{{ content.tittle || 'Opciones:' }}</h2>
    <div v-if="content.content_details && content.content_details.questions">
      <div v-for="(question, qIndex) in content.content_details.questions" :key="qIndex" class="question-container">
        <p class="question-text"><strong>Pregunta {{ qIndex + 1 }}:</strong> {{ question.question }}</p>
        
        <div v-for="(answer, aIndex) in question.answers" :key="aIndex" class="answer-option">
          <label :class="getAnswerClasses(qIndex, aIndex)">
            <input 
              :type="isMultipleCorrect(question) ? 'checkbox' : 'radio'"
              :name="`question-${qIndex}`"
              :value="answer.text"
              v-model="userAnswers[qIndex]"
              :disabled="isGraded"
              @change="handleAnswerChange(qIndex, answer.text)"
            />
            <span class="answer-text">{{ answer.text }}</span>
          </label>
        </div>
      </div>

      <button 
        @click="gradeAnswers" 
        class="grade-button"
        :disabled="isGraded"
      >
        Calificar
      </button>

      <div v-if="isGraded" class="feedback">
        <p>Puntuación: {{ score }} de {{ content.content_details.questions.length }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps(['content']);

const userAnswers = ref(Array(props.content.content_details.questions.length).fill([]));
const isGraded = ref(false);
const score = ref(0);

const isMultipleCorrect = (question) => {
  return question.answers.filter(answer => answer.isCorrect).length > 1;
};

const getAnswerClasses = (qIndex, aIndex) => {
  const question = props.content.content_details.questions[qIndex];
  const answer = question.answers[aIndex];
  const baseClasses = {
    'answer-label': true,
    'radio': !isMultipleCorrect(question),
    'checkbox': isMultipleCorrect(question),
    'selected': isAnswerSelected(qIndex, answer.text),
  };

  if (isGraded.value) {
    baseClasses['correct'] = answer.isCorrect && isAnswerSelected(qIndex, answer.text);
    baseClasses['incorrect'] = !answer.isCorrect && isAnswerSelected(qIndex, answer.text);
  }

  return baseClasses;
};

const isAnswerSelected = (qIndex, answerText) => {
  const userAnswer = userAnswers.value[qIndex];
  return Array.isArray(userAnswer) 
    ? userAnswer.includes(answerText)
    : userAnswer === answerText;
};

const handleAnswerChange = (qIndex, answerText) => {
  console.log(`Pregunta ${qIndex + 1} - Opción seleccionada: ${answerText}`);
  console.log(`Estado actual de respuestas:`, userAnswers.value);
};

const gradeAnswers = () => {
  // Validar que al menos una respuesta esté seleccionada por pregunta
  for (let i = 0; i < userAnswers.value.length; i++) {
    if (userAnswers.value[i].length === 0) {
      alert(`Por favor, selecciona al menos una respuesta para la pregunta ${i + 1}.`);
      return; // Salir si no se cumple la validación
    }
  }

  let totalScore = 0;

  props.content.content_details.questions.forEach((question, qIndex) => {
    const userAnswer = userAnswers.value[qIndex];
    const correctAnswers = question.answers
      .filter(answer => answer.isCorrect)
      .map(answer => answer.text);

    if (isMultipleCorrect(question)) {
      // Para preguntas de selección múltiple
      const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      if (arraysEqual(userAnswerArray.sort(), correctAnswers.sort())) {
        totalScore++;
      }
    } else {
      // Para preguntas de selección única
      if (correctAnswers.includes(userAnswer)) {
        totalScore++;
      }
    }
  });

  score.value = totalScore;
  isGraded.value = true;
};

const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
};
</script>

<style scoped>
.multiple-choice-container {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.question-container {
  margin-bottom: 20px;
}

.question-text {
  font-size: 1.1em;
  margin-bottom: 10px;
}

.answer-option {
  margin: 10px 0;
}

.answer-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.answer-label:hover {
  background-color: transparent; /* Sin color de fondo al pasar el mouse */
}

.answer-label.selected {
  background-color: transparent; /* Sin color de fondo al seleccionar */
}

.answer-label.radio input[type="radio"],
.answer-label.checkbox input[type="checkbox"] {
  margin-right: 10px;
}

.answer-label.correct {
  background-color: #d4edda; /* Verde para respuestas correctas */
  color: #155724;
}

.answer-label.incorrect {
  background-color: #f8d7da; /* Rojo para respuestas incorrectas */
  color: #721c24;
}

.answer-text {
  margin-left: 10px;
}

.grade-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.grade-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.feedback {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  background-color: #e9ecef;
}
</style>
