<template>
  <div class="word-bank-container">
    <h2>{{ content.tittle || 'Word Bank Exercise' }}</h2>
    <p v-if="content.instructions"><strong>Instructions:</strong> {{ content.instructions }}</p>
    
    <div v-if="content.content_details && content.content_details.word_bank" class="exercise-container">
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

      <!-- Texto con inputs -->
      <div class="text-container">
        <template v-for="(part, index) in textParts" :key="index">
          <template v-if="part.type === 'text'">{{ part.content }}</template>
          <input
            v-else
            v-model="userAnswers[part.position - 1]"
            type="text"
            class="word-input"
            :class="{
              'correct': isGraded && isCorrect(part.position - 1),
              'incorrect': isGraded && !isCorrect(part.position - 1)
            }"
            :disabled="isGraded"
            :placeholder="''"
            @click="handleInputClick(part.position - 1)"
          />
        </template>
      </div>

      <button 
        @click="gradeAnswers" 
        class="grade-button"
        :disabled="isGraded"
      >
        Grade
      </button>

      <div v-if="isGraded" class="feedback">
        <p>Score: {{ score }} out of {{ keywords.length }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps(['content']);

const userAnswers = ref(Array(props.content.content_details.word_bank[0].keywords.length).fill(''));
const isGraded = ref(false);
const score = ref(0);
const selectedInputIndex = ref(null);

// Obtener keywords y texto del contenido
const keywords = computed(() => props.content.content_details.word_bank[0].keywords || []);
const text = computed(() => props.content.content_details.word_bank[0].text || '');
const extraWords = computed(() => props.content.content_details.word_bank[0].extraWords || []);

// Obtener palabras disponibles combinando keywords y palabras extra
const availableWords = computed(() => {
  const keywordWords = keywords.value.map(k => k.word);
  return [...keywordWords, ...extraWords.value];
});

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

// Dividir el texto en partes (texto normal e inputs)
const textParts = computed(() => {
  const parts = [];
  const textSegments = text.value.split(/__(\d+)__/);
  
  textSegments.forEach((segment, index) => {
    if (index % 2 === 0) {
      // Texto normal
      parts.push({ type: 'text', content: segment });
    } else {
      // Espacio para input
      parts.push({ type: 'input', position: parseInt(segment) });
    }
  });
  
  return parts;
});

const isCorrect = (index: number) => {
  const keyword = keywords.value.find(k => k.position === index + 1);
  return keyword && userAnswers.value[index].toLowerCase() === keyword.word.toLowerCase();
};

const gradeAnswers = () => {
  // Validar que todas las respuestas estén completas
  if (userAnswers.value.includes('')) {
    alert('Por favor, completa todas las respuestas.');
    return;
  }

  let totalScore = 0;
  keywords.value.forEach((keyword, index) => {
    if (userAnswers.value[index].toLowerCase() === keyword.word.toLowerCase()) {
      totalScore++;
    }
  });

  score.value = totalScore;
  isGraded.value = true;
};
</script>

<style scoped>
.word-bank-container {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.exercise-container {
  margin-top: 20px;
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

.word-input {
  width: 120px;
  padding: 4px 8px;
  margin: 0 4px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  cursor: pointer;
}

.word-input:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13,110,253,.25);
}

.word-input.correct {
  border-color: #78CBB6;
  background-color: #e6f7f3;
}

.word-input.incorrect {
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