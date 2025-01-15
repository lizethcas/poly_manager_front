<template>
  <div class="category-container">
    <h2>{{ content.tittle || 'Category Exercise' }}</h2>
    <p v-if="content.instructions"><strong>Instructions:</strong> {{ content.instructions }}</p>

    <div v-if="content.content_details?.categories" class="exercise-container">
      <!-- Banco de elementos para arrastrar -->
      <div class="items-bank">
        <div
          v-for="item in allItems"
          :key="item"
          class="draggable-item"
          :class="{ 'used': isItemUsed(item) }"
          draggable="true"
          @dragstart="dragStart($event, item)"
        >
          {{ item }}
        </div>
      </div>

      <!-- Contenedores de categorías -->
      <div class="categories-container">
        <div
          v-for="(category, index) in content.content_details.categories"
          :key="index"
          class="category-box"
        >
          <h3>{{ category.categoria }}</h3>
          <div
            class="category-dropzone"
            :class="{
              'empty-error': isGraded && shouldHaveItems(index) && !userAnswers[index]?.length
            }"
            @dragover.prevent
            @drop="handleDrop($event, index)"
          >
            <div
              v-for="(item, itemIndex) in userAnswers[index]"
              :key="itemIndex"
              class="dropped-item"
              :class="{
                'correct': isGraded && isItemCorrectInCategory(item, index),
                'incorrect': isGraded && !isItemCorrectInCategory(item, index)
              }"
            >
              {{ item }}
            </div>
            <div v-if="!userAnswers[index]?.length" class="placeholder-text">
              Drag items here
            </div>
          </div>
        </div>
      </div>

      <button 
        @click="gradeAnswers" 
        class="grade-button"
        :disabled="isGraded || !canGrade"
      >
        Grade
      </button>

      <div v-if="isGraded" class="feedback">
        <p>Score: {{ countCorrectItems().correctCount }} out of {{ countCorrectItems().totalItems }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps(['content']);

const userAnswers = ref(Array(props.content?.content_details?.categories?.length).fill([]));
const isGraded = ref(false);
const score = ref(0);

// Obtener todos los items disponibles
const allItems = computed(() => {
  if (!props.content?.content_details?.categories) return [];
  return props.content.content_details.categories.reduce((acc, category) => {
    return [...acc, ...category.text_items];
  }, []);
});

// Verificar si un item ya ha sido usado
const isItemUsed = (item: string) => {
  return userAnswers.value.some(category => category.includes(item));
};

// Manejar el inicio del arrastre
const dragStart = (event: DragEvent, item: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', item);
  }
};

// Manejar el drop del elemento
const handleDrop = (event: DragEvent, categoryIndex: number) => {
  if (isGraded.value) return;
  
  const item = event.dataTransfer?.getData('text/plain');
  if (!item) return;

  // Remover el item de su categoría anterior si existe
  userAnswers.value = userAnswers.value.map(category => 
    category.filter(i => i !== item)
  );

  // Agregar el item a la nueva categoría
  userAnswers.value[categoryIndex] = [...(userAnswers.value[categoryIndex] || []), item];
};

// Verificar si una categoría debería tener elementos
const shouldHaveItems = (categoryIndex: number) => {
  return props.content.content_details.categories[categoryIndex].text_items.length > 0;
};

// Verificar si un elemento está correctamente ubicado en una categoría
const isItemCorrectInCategory = (item: string, categoryIndex: number) => {
  return props.content.content_details.categories[categoryIndex].text_items.includes(item);
};

// Calcular el puntaje total
const totalCategories = computed(() => {
  return props.content.content_details.categories.length;
});

// Verificar si se puede calificar
const canGrade = computed(() => {
  return allItems.value.every(item => isItemUsed(item));
});

// Agregar función para contar elementos correctos
const countCorrectItems = () => {
  let correctCount = 0;
  let totalItems = allItems.value.length; // Total de elementos que deben ser categorizados

  props.content.content_details.categories.forEach((category, categoryIndex) => {
    const userItems = userAnswers.value[categoryIndex] || [];
    userItems.forEach(item => {
      if (isItemCorrectInCategory(item, categoryIndex)) {
        correctCount++;
      }
    });
  });

  return { correctCount, totalItems };
};

// Calificar las respuestas
const gradeAnswers = () => {
  if (!canGrade.value) {
    alert('Please categorize all items before grading.');
    return;
  }

  const { correctCount, totalItems } = countCorrectItems();
  score.value = correctCount;
  isGraded.value = true;
};
</script>

<style scoped>
.category-container {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.items-bank {
  background-color: #F1F5FB;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.draggable-item {
  background-color: white;
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: move;
  user-select: none;
}

.draggable-item.used {
  opacity: 0.5;
}

.categories-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.category-box {
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
}

.category-box h3 {
  margin: 0 0 10px 0;
  color: #495057;
}

.category-dropzone {
  min-height: 120px;
  border: 2px dashed #ced4da;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-dropzone.correct {
  border-color: #78CBB6;
  background-color: #e6f7f3;
}

.category-dropzone.incorrect {
  border-color: #FF878A;
  background-color: #ffe6e6;
}

.dropped-item {
  background-color: #f8f9fa;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.dropped-item.correct {
  border-color: #78CBB6;
  background-color: #e6f7f3;
}

.dropped-item.incorrect {
  border-color: #FF878A;
  background-color: #ffe6e6;
}

.placeholder-text {
  color: #6c757d;
  text-align: center;
  padding: 20px;
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

.category-dropzone.empty-error {
  border-color: #FF878A;
  background-color: #ffe6e6;
}
</style>