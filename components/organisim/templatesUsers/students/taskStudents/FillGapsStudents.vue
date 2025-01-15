<template>
  <div class="fill-gaps-container">
    <h2>{{ content.tittle || 'Fill in the Gaps Exercise' }}</h2>
    <p v-if="content.instructions"><strong>Instructions:</strong> {{ content.instructions }}</p>
    
    <div v-if="content.content_details && content.content_details.passages" class="exercise-container">
      <!-- Banco de palabras disponibles -->
      <div class="available-words">
        <div class="words-container">
          <span v-for="(word, index) in availableWords" 
                :key="index" 
                class="word-option"
                :class="{ 'used': isWordUsed(word) }"
                @click="handleWordClick(word)">
            {{ word }}
          </span>
        </div>
      </div>

      <!-- Texto con espacios para rellenar -->
      <div class="text-container">
        <div v-for="(passage, pIndex) in content.content_details.passages" :key="pIndex">
          <div class="numbered-sentences">
            <template v-for="(part, index) in splitText(passage.text)" :key="index">
              <span v-if="part.type === 'text'">{{ part.content }}</span>
              <input
                v-else
                v-model="userAnswers[part.number - 1]"
                type="text"
                class="gap-input"
                :class="{
                  'correct': isGraded && isCorrect(part.number - 1),
                  'incorrect': isGraded && !isCorrect(part.number - 1)
                }"
                :disabled="isGraded"
                :placeholder="'_____'"
                @click="handleInputClick(part.number - 1)"
              />
            </template>
          </div>
        </div>
      </div>

      <button 
        @click="gradeAnswers" 
        class="grade-button"
        :disabled="isGraded || !allAnswersFilled"
      >
        Grade
      </button>

      <div v-if="isGraded" class="feedback">
        <p>Score: {{ score }} out of {{ totalGaps }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps(['content']);

const userAnswers = ref([]);
const isGraded = ref(false);
const score = ref(0);
const selectedInputIndex = ref(null);

// Obtener todas las palabras disponibles del primer passage
const availableWords = computed(() => {
  if (!props.content?.content_details?.passages?.[0]?.keywords) return [];
  return props.content.content_details.passages[0].keywords;
});

// Calcular el número total de gaps
const totalGaps = computed(() => {
  if (!props.content?.content_details?.passages?.[0]?.text) return 0;
  const matches = props.content.content_details.passages[0].text.match(/__\d+__/g);
  return matches ? matches.length : 0;
});

// Inicializar userAnswers con el número correcto de espacios
userAnswers.value = Array(totalGaps.value).fill('');

// Verificar si una palabra ya ha sido usada
const isWordUsed = (word: string) => {
  return userAnswers.value.includes(word);
};

// Manejar clic en una palabra del banco
const handleWordClick = (word: string) => {
  if (selectedInputIndex.value !== null && !isGraded.value) {
    userAnswers.value[selectedInputIndex.value] = word;
    selectedInputIndex.value = null;
  }
};

// Manejar clic en un input
const handleInputClick = (index: number) => {
  if (!isGraded.value) {
    selectedInputIndex.value = index;
  }
};

// Dividir el texto en partes (texto y gaps)
const splitText = (text: string) => {
  const parts = [];
  const segments = text.split(/(__|__)/);
  
  let currentNumber = null;
  
  segments.forEach((segment) => {
    if (segment === '__') {
      if (currentNumber === null) {
        currentNumber = '';
      } else {
        const number = parseInt(currentNumber);
        parts.push({ type: 'gap', number: number });
        currentNumber = null;
      }
    } else if (currentNumber !== null) {
      currentNumber += segment;
    } else {
      if (segment) parts.push({ type: 'text', content: segment });
    }
  });
  
  return parts;
};

const isCorrect = (index: number) => {
  const keywords = props.content.content_details.passages[0].keywords;
  return userAnswers.value[index] === keywords[index];
};

const allAnswersFilled = computed(() => {
  return !userAnswers.value.includes('');
});

const gradeAnswers = () => {
  if (!allAnswersFilled.value) {
    alert('Por favor, completa todos los espacios.');
    return;
  }

  let totalScore = 0;
  const keywords = props.content.content_details.passages[0].keywords;
  
  userAnswers.value.forEach((answer, index) => {
    if (answer === keywords[index]) {
      totalScore++;
    }
  });

  score.value = totalScore;
  isGraded.value = true;
};
</script>

<style scoped>
.fill-gaps-container {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.available-words {
  background-color: #F1F5FB;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.words-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.word-option {
  background-color: white;
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.word-option:hover {
  background-color: #e9ecef;
}

.word-option.used {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  line-height: 2;
}

.numbered-sentences {
  margin-bottom: 15px;
}

.gap-input {
  width: 120px;
  padding: 4px 8px;
  margin: 0 4px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}

.gap-input.correct {
  border-color: #78CBB6;
  background-color: #e6f7f3;
}

.gap-input.incorrect {
  border-color: #FF878A;
  background-color: #ffe6e6;
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