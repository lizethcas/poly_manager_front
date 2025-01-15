<template>
  <div class="matching-container">
    <h2>{{ content.tittle || 'Matching Exercise' }}</h2>
    <p v-if="content.instructions"><strong>Instructions:</strong> {{ content.instructions }}</p>

    <div v-if="content.content_details?.pairs" class="exercise-container">
      <div class="matching-columns" :class="{ 'graded': isGraded }">
        <div class="column left-column" :class="{ 'animate-grade': isGraded }">
          <!-- Columna izquierda -->
          <div
            v-for="(option, index) in leftOptions"
            :key="'left-' + index"
            class="option-item"
            :class="{
              'matched': isMatched('left', index),
              'correct': isGraded && isCorrectMatch('left', index),
              'incorrect': isGraded && isIncorrectMatch('left', index)
            }"
          >
            {{ option }}
          </div>
        </div>

        <div class="column right-column" :class="{ 'animate-grade': isGraded }">
          <!-- Columna derecha -->
          <div
            v-for="(option, index) in rightOptions"
            :key="'right-' + index"
            class="option-item"
            :class="{
              'selected': selectedRight === index,
              'matched': isMatched('right', index),
              'correct': isGraded && isCorrectMatch('right', index),
              'incorrect': isGraded && isIncorrectMatch('right', index)
            }"
            draggable="true"
            @dragstart="dragStart($event, index)"
            @dragover.prevent
            @drop="handleDrop($event, index)"
          >
            {{ option }}
          </div>
        </div>
      </div>

      <button 
        @click="gradeAnswers" 
        class="grade-button"
        :disabled="isGraded || !allMatched"
      >
        Grade
      </button>

      <div v-if="isGraded" class="feedback">
        <p>Score: {{ score }} out of {{ content.content_details.pairs.length }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps(['content']);

const matches = ref<Array<{left: number, right: number}>>([]);
const isGraded = ref(false);
const score = ref(0);

// Agregar una nueva ref para rastrear si se ha realizado algún intercambio
const hasInteracted = ref(false);

// Mezclar las opciones
const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Obtener y mezclar las opciones
const leftOptions = computed(() => {
  return shuffleArray(props.content.content_details.pairs.map(pair => pair.left));
});

const rightOptions = ref(shuffleArray(props.content.content_details.pairs.map(pair => pair.right)));

// Verificar si una opción ya está emparejada
const isMatched = (side: 'left' | 'right', index: number) => {
  return matches.value.some(match => match[side] === index);
};

// Verificar si un par es correcto
const isCorrectMatch = (side: 'left' | 'right', index: number) => {
  const match = matches.value.find(m => m[side] === index);
  if (!match) return false;

  const leftText = leftOptions.value[match.left];
  const rightText = rightOptions.value[match.right];
  
  return props.content.content_details.pairs.some(
    pair => pair.left === leftText && pair.right === rightText
  );
};

// Verificar si un par es incorrecto
const isIncorrectMatch = (side: 'left' | 'right', index: number) => {
  return isMatched(side, index) && !isCorrectMatch(side, index);
};

// Calificar las respuestas
const gradeAnswers = () => {
  if (!allMatched.value) {
    alert('Please match all items before grading.');
    return;
  }

  let correctCount = 0;
  matches.value.forEach(match => {
    const leftText = leftOptions.value[match.left];
    const rightText = rightOptions.value[match.right];
    
    if (props.content.content_details.pairs.some(
      pair => pair.left === leftText && pair.right === rightText
    )) {
      correctCount++;
    }
  });

  score.value = correctCount;
  
  // Agregar un pequeño retraso antes de mostrar las animaciones
  setTimeout(() => {
    isGraded.value = true;
  }, 100);

  // Reproducir un sonido de éxito o error (opcional)
  const audio = new Audio(correctCount === matches.value.length ? '/success.mp3' : '/error.mp3');
  audio.play().catch(() => {}); // Manejar el error silenciosamente si el navegador bloquea el audio
};

// Obtener el índice del par para el color
const getPairIndex = (side: 'left' | 'right', index: number) => {
  const match = matches.value.findIndex(m => m[side] === index);
  return match !== -1 ? (match % 6) + 1 : 0; // 6 colores diferentes
};

// Calcular el estilo de la línea conectora
const getConnectorStyle = (side: 'left', index: number) => {
  const match = matches.value.find(m => m[side] === index);
  if (!match) return {};

  const leftElement = document.querySelector(`[data-index="left-${match.left}"]`);
  const rightElement = document.querySelector(`[data-index="right-${match.right}"]`);
  
  if (!leftElement || !rightElement) return {};

  const leftRect = leftElement.getBoundingClientRect();
  const rightRect = rightElement.getBoundingClientRect();

  return {
    width: `${rightRect.left - leftRect.right}px`,
    top: `${(leftRect.height / 2)}px`
  };
};

// Función para eliminar un par
const removePair = (index: number) => {
  matches.value.splice(index, 1);
};

// Agregar estas nuevas funciones para el drag and drop
const dragStart = (event: DragEvent, index: number) => {
  if (isGraded.value) return;
  event.dataTransfer?.setData('text/plain', index.toString());
};

const handleDrop = (event: DragEvent, dropIndex: number) => {
  if (isGraded.value) return;
  const dragIndex = parseInt(event.dataTransfer?.getData('text/plain') || '');
  if (isNaN(dragIndex)) return;

  // Marcar que ha habido interacción
  hasInteracted.value = true;

  // Intercambiar las opciones
  const newOptions = [...rightOptions.value];
  [newOptions[dragIndex], newOptions[dropIndex]] = [newOptions[dropIndex], newOptions[dragIndex]];
  rightOptions.value = newOptions;

  // Crear automáticamente los matches después del primer movimiento
  matches.value = leftOptions.value.map((_, index) => ({
    left: index,
    right: index
  }));
};

// Verificar si todos los elementos están emparejados
const allMatched = computed(() => {
  return hasInteracted.value;
});
</script>

<style scoped>
.matching-container {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.matching-columns {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin: 20px 0;
  transition: all 2s ease;
}

.matching-columns.graded {
  gap: 80px;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.left-column.animate-grade {
  transform: translateX(1%);
}

.right-column.animate-grade {
  transform: translateX(-1%);
}

.option-item {
  position: relative;
  background-color: white;
  padding: 10px 15px;
  border: 1px solid #a9c9e9;
  border-radius: 8px;
  margin-bottom: 10px;
}

.left-column .option-item {
  border-right: none;
}

.right-column .option-item {
  border-left: none;
}

.left-column .option-item::after {
  content: '';
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 24px;
  background-color: white;
  border: 1px solid #a9c9e9;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  border-left: none;
}

.right-column .option-item::after {
  content: '';
  position: absolute;
  left: -1px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 24px;
  background-color: #f9f9f9;
  border: 1px solid #a9c9e9;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  border-left: none;
}

.option-item:hover {
  background-color: #f8f9fa;
  transform: scale(1.02); /* Efecto sutil al hover */
}

.option-item.selected {
  border-color: #34CCFF;
  background-color: #e6f7ff;
  z-index: 2;
}

.option-item.matched {
  background-color: transparent;
}

.option-item.correct {
  border-color: #78CBB6;
  background-color: #e6f7f3;
  transform: scale(1.05);
}

.left-column .option-item.correct {
  transform: translateX(7%);
}

.right-column .option-item.correct {
  transform: translateX(-7%);
}

.option-item.incorrect {
  border-color: #FF878A;
  background-color: #ffe6e6;
}

.left-column .option-item.incorrect {
  transform: translateX(-20px);
  animation: shakeLeft 0.5s ease;
}

.right-column .option-item.incorrect {
  transform: translateX(20px);
  animation: shakeRight 0.5s ease;
}

@keyframes shakeLeft {
  0%, 100% { transform: translateX(-20px); }
  25% { transform: translateX(-25px); }
  75% { transform: translateX(-15px); }
}

@keyframes shakeRight {
  0%, 100% { transform: translateX(20px); }
  25% { transform: translateX(25px); }
  75% { transform: translateX(15px); }
}

.option-item + .option-item {
  margin-top: 10px;
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

/* Colores para los pares */
.pair-color-1 { border-color: #3743af; color: #3743af; }
.pair-color-2 { border-color: #4ECDC4; color: #4ECDC4; }
.pair-color-3 { border-color: #45B7D1; color: #45B7D1; }
.pair-color-4 { border-color: #96CEB4; color: #96CEB4; }
.pair-color-5 { border-color: #D4A5A5; color: #D4A5A5; }
.pair-color-6 { border-color: #9B59B6; color: #9B59B6; }

.connector-line {
  position: absolute;
  height: 2px;
  right: -20px;
  transform: translateY(-50%);
  z-index: 1;
}

/* Colores para las líneas de conexión */
.connector-line.pair-color-1 { background-color: #3743af; }
.connector-line.pair-color-2 { background-color: #4ECDC4; }
.connector-line.pair-color-3 { background-color: #45B7D1; }
.connector-line.pair-color-4 { background-color: #96CEB4; }
.connector-line.pair-color-5 { background-color: #D4A5A5; }
.connector-line.pair-color-6 { background-color: #9B59B6; }

.pairs-summary {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: white;
}

.pairs-summary h3 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 1.1em;
}

.pairs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.pair-item {
  padding: 12px;
  border-radius: 6px;
  border: 1px solid;
  transition: all 0.3s ease;
}

.pair-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.pair-arrow {
  color: inherit;
  font-weight: bold;
}

.pair-left, .pair-right {
  flex: 1;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  text-align: center;
}

.no-pairs {
  grid-column: 1 / -1;
  text-align: center;
  padding: 20px;
  color: #6c757d;
  font-style: italic;
  background-color: #f8f9fa;
  border-radius: 4px;
}

/* Ajustar los colores existentes para que coincidan en ambas secciones */
.pair-color-1 { 
  border-color: #3743af; 
  color: #3743af;
  background-color: rgba(255, 107, 107, 0.1);
}
.pair-color-2 { 
  border-color: #4ECDC4; 
  color: #4ECDC4;
  background-color: rgba(78, 205, 196, 0.1);
}
.pair-color-3 { 
  border-color: #45B7D1; 
  color: #45B7D1;
  background-color: rgba(69, 183, 209, 0.1);
}
.pair-color-4 { 
  border-color: #96CEB4; 
  color: #96CEB4;
  background-color: rgba(150, 206, 180, 0.1);
}
.pair-color-5 { 
  border-color: #D4A5A5; 
  color: #D4A5A5;
  background-color: rgba(212, 165, 165, 0.1);
}
.pair-color-6 { 
  border-color: #9B59B6; 
  color: #9B59B6;
  background-color: rgba(155, 89, 182, 0.1);
}

.remove-button {
  background: none;
  border: none;
  color: #FF0000;
  cursor: pointer;
  font-size: 1.2em;
}
</style>