<template>

  <draggable
    v-model="unassignedItems"
    tag="ul"
    group="categories"
    :item-key="(item) => item.text"
    animation="300"
    class="flex flex-wrap gap-2 justify-center bg-gray-200  rounded-md"
  >
    <template #item="{ element: item }">
      <li class="bg-white border-2 border-gray-300 px-2 rounded-md my-2 w-fit cursor-grab">
        {{ item.text }}
      </li>
    </template>
  </draggable>

  <div class="w-full  mt-4">
    <div class="w-full grid gap-4" 
         :style="{
           gridTemplateColumns: `repeat(${questions.length}, minmax(0, 1fr))`
         }"
    >
      <div
        v-for="question in questions"
        :key="question.question"
        class="border-2 border-gray-300 p-4 rounded-md text-center h-60"
      >
        <h2 class="text-m font-bold mb-4">{{ question.question }}</h2>

        <draggable
          v-model="question.answers"
          tag="ul"
          group="categories"
          :item-key="(item) => item.text"
          animation="300"
          class="flex flex-wrap gap-2 justify-center"
        >
          <template #item="{ element: item }">
            <li class="bg-gray-200 px-2 py-1 rounded-md my-2 w-fit cursor-grab">
              {{ item.text }}
            </li>
          </template>
        </draggable>
      </div>
    </div>
  </div>

  <div class="mt-4 text-center">
    <button
      @click="checkResults"
      class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
    >
      Validar Respuestas
    </button>
    <p v-if="isValid !== null" :class="{'text-green-500': isValid, 'text-red-500': !isValid}" class="mt-4">
      {{ isValid ? '¡Todas las respuestas son correctas!' : 'Algunas respuestas son incorrectas. Revisa nuevamente.' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import draggable from "vuedraggable";

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

interface Question {
  question: string;
  answers: Answer[];
}

interface Answer {
  text: string;
  isCorrect: string;
}

const questions = ref<Question[]>([]);
const unassignedItems = ref<Answer[]>([]);
const isValid = ref<boolean | null>(null);

onMounted(() => {
  // Inicializar las preguntas
  questions.value = props.task.content_details.questions.map((q: any) => ({
    question: q.question,
    answers: [],
  }));

  // Extraer y barajar respuestas sin asignar
  const allItems: Answer[] = props.task.content_details.questions.flatMap((q: any) =>
    q.answers.map((a: any) => ({
      text: a.text,
      isCorrect: q.question, // Vincular al nombre de la pregunta correcta
    }))
  );

  unassignedItems.value = shuffleArray([...allItems]); // Crear copia segura y barajar
});

const shuffleArray = (array: Answer[]): Answer[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const checkResults = () => {
  isValid.value = questions.value.every((category) =>
    category.answers.every((item) => item.isCorrect === category.question)
  );
};
</script>
<style scoped>
.grid-container {
  width: 100%;
}

@media (min-width: 640px) {
  template {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
}
</style>