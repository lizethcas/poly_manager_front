<template>
  <div class="true-or-false-container">
    <h2>{{ content.tittle || 'True or False Question' }}</h2>
    <p><strong>Instructions:</strong> {{ content.instructions }}</p>
    
    <div v-if="content.content_details && content.content_details.questions">
      <div v-for="(question, qIndex) in content.content_details.questions" :key="qIndex" class="question-container">
        <p class="question-text"><strong>Question {{ qIndex + 1 }}:</strong> {{ question.statement }}</p>
        
        <div class="options-container">
          <div 
            v-for="option in ['True', 'False', 'Not stated']" 
            :key="option"
            class="option-button"
            :class="{
              'selected': userAnswers[qIndex] === option,
              'incorrect': isGraded && userAnswers[qIndex] === option && userAnswers[qIndex] !== question.stated,
              'correct': isGraded && userAnswers[qIndex] === option && userAnswers[qIndex] === question.stated
            }"
            @click="!isGraded && (userAnswers[qIndex] = option)"
          >
            {{ option === 'True' ? 'True' : option === 'False' ? 'False' : 'Not stated' }}
          </div>
        </div>
      </div>

      <button 
        @click="gradeAnswers" 
        class="grade-button"
        :disabled="isGraded"
      >
        Grade
      </button>

      <div v-if="isGraded" class="feedback">
        <p>Score: {{ score }} out of {{ content.content_details.questions.length }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps(['content']);

const userAnswers = ref(Array(props.content.content_details.questions.length).fill(''));
const isGraded = ref(false);
const score = ref(0);

const gradeAnswers = () => {
  // Validar que todas las preguntas tengan respuesta
  for (let i = 0; i < userAnswers.value.length; i++) {
    if (userAnswers.value[i] === '') {
      alert(`Por favor, selecciona una respuesta para la pregunta ${i + 1}.`);
      return;
    }
  }

  let totalScore = 0;
  props.content.content_details.questions.forEach((question, qIndex) => {
    if (userAnswers.value[qIndex] === question.stated) {
      totalScore++;
    }
  });

  score.value = totalScore;
  isGraded.value = true;
};
</script>

<style scoped>
.true-or-false-container {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.question-container {
  background-color: #F8F9FA;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.question-text {
  font-size: 1.1em;
  margin-bottom: 10px;
  font-weight: bold;
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

.options-container {
  display: flex;
  gap: 15px;
  justify-content: flex-start;
  margin-top: 1rem;
}

.option-button {
  background-color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 24px;
  cursor: pointer;
  text-align: center;
  min-width: 100px;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.option-button:hover {
  background-color: #f8f9fa;
}

.option-button.selected {
  color: #34CCFF;
  border: 1px solid #34CCFF;
}

.option-button.incorrect {
  color: #FF878A;
  border: 1px solid #FF878A;
}

.option-button.correct {
  color: #78CBB6;
  border: 1px solid #78CBB6;
}

.option-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
