<template>
  <draggable
    v-model="unassignedItems"
    tag="ul"
    group="categories"
    :item-key="(item) => item.text"
    animation="300"
    class="flex flex-wrap gap-4 justify-center bg-gray-100 p-6 rounded-lg border border-gray-300 shadow-sm"
  >
    <template #item="{ element: item }">
      <li class="bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm cursor-grab">
        {{ item.text }}
      </li>
    </template>
  </draggable>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
    <div
      v-for="question in questions"
      :key="question.question"
      class="border border-gray-300 p-6 rounded-lg shadow-md text-center bg-white"
    >
      <h2 class="text-lg font-semibold mb-4 text-gray-700">{{ question.question }}</h2>

      <draggable
        v-model="question.answers"
        tag="ul"
        group="categories"
        :item-key="(item) => item.text"
        animation="300"
        class="flex flex-wrap gap-4 justify-center bg-gray-50 p-4 rounded-md min-h-[120px]"
      >
        <template #item="{ element: item }">
          <li class="bg-gray-200 px-4 py-2 rounded-md shadow-sm cursor-grab">
            {{ item.text }}
          </li>
        </template>
      </draggable>
    </div>
  </div>

  <div class="mt-6 text-center">
    <button
      @click="checkResults"
      class="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600"
    >
      Validar Respuestas
    </button>
    <p v-if="isValid !== null" :class="{'text-green-600': isValid, 'text-red-600': !isValid}" class="mt-4 text-lg">
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
