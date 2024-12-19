<template>
  <!-- <div
    class="flex flex-col items-center justify-center p-4"
    v-if="infoResponseApi.isLoading"
  >
    <p class="mt-2 text-lg text-gray-700">Guardando...</p>
  </div> -->

  <!-- Iteramos sobre las preguntas -->

  <TextAreaTask
    v-if="typeTask === 'text_area'"
    :value="value"
    :data="description"
    @update:value="handleUpdateValue"
    @update:extraValue="handleExtraInput"
  />

  <div
    v-else
    v-for="(question, qIndex) in questions"
    :key="qIndex"
    class="border-b border-gray-500 pb-4"
    :draggable="true"
    @dragstart="onDragStart($event, qIndex)"
    @dragover="onDragOver"
    @drop="onDrop($event, qIndex)"
  >
    <div class="mt-4">
      <h3 class="text-tarawera-700 font-bold">
        {{ titleTask }} {{ qIndex + 1 }}
      </h3>
      <div>
        <div
          class="flex items-center gap-2 p-2"
          v-if="typeTask !== 'true_false' && typeTask !== 'ordering'"
        >
          <Icon
            name="mingcute:dots-fill"
            size="24"
            class="text-gray-500 cursor-grab"
          />
          <UInput
            v-model="question.question"
            type="text"
            size="xs"
            placeholder="Enter your question"
            class="w-full mt-1"
          />

          <div
            class="bg-gray-200 rounded-md p-1 flex items-center justify-center"
          >
            <Icon
              name="material-symbols:close"
              size="18"
              class="text-gray-500 cursor-pointer"
              @click="removeQuestion(qIndex)"
            />
          </div>
        </div>
      </div>

      <!-- Renderiza las opciones de cada pregunta -->
      <div class="flex justify-end w-full">
        <div class="w-[95%] items-end">
          <!-- Componente InputTask renderiza las opciones -->
          <InputTask
            v-for="(option, oIndex) in question.answers"
            :key="`${qIndex}-${oIndex}`"
            :qIndex="qIndex"
            :oIndex="oIndex"
            :isCorrect="option.isCorrect"
            :type="getType(typeTask)"
            :answer="option.text"
            :removeOption="(qIndex, oIndex) => removeOption(qIndex, oIndex)"
            @update:isCorrect="
              (val) => updateOptionIsCorrect(qIndex, oIndex, val)
            "
            @update:answer="(val) => updateOptionAnswer(qIndex, oIndex, val)"
            placeholder="Enter your answer"
          />

          <button
            v-if="typeTask !== 'true_false'"
            class="bg-fuscous-gray-100 text-fuscous-gray-600 text-xs rounded-md flex items-center gap-2 px-2 py-1 mt-2"
            @click="addOption(qIndex)"
          >
            <Icon
              name="icon-park-solid:add"
              size="14"
              class="bg-fuscous-gray-500"
            />
            Add option
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Este botón se encarga de agregar una nueva pregunta -->
  <UTooltip
    v-if="typeTask !== 'text_area'"
    :text="isActive ? '' : 'all questions and answers are required'"
    :ui="{
      container:
        ' text-fuscous-gray-600 text-xs rounded-md flex items-center gap-2 px-2 py-1 mt-2',
    }"
  >
    <button
      v-if="titleTask"
      :class="{
        'bg-fuscous-gray-100  text-fuscous-gray-600 text-xs rounded-md flex items-center gap-2 px-2 py-1 mt-2': true,
        'bg-fuscous-gray-100 text-fuscous-gray-600': isActive,
        'bg-fuscous-gray-100 text-fuscous-gray-200 cursor-not-allowed':
          !isActive,
      }"
      @click="addQuestion"
      :disabled="!isActive"
    >
      <Icon
        :disabled="!isActive"
        name="icon-park-solid:add"
        size="14"
        class="bg-fuscous-gray-500"
      />Add question
    </button>
  </UTooltip>

  <div class="flex items-center gap-2 py-4 text-sm">
    <p>Include the stats</p>
    <AtomosToggle v-model="data.stats" />
  </div>
  <MoleculeActionButtons
    @handleSave="handleSave()"
    @handleCancel="handleCancel"
    :isActive="infoResponseApi.isActive"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
/* Components */
import InputTask from "../molecule/InputTask.vue";
import TextAreaTask from "../molecule/TextAreaTask.vue";
/* Composables */
import { useRemove } from "~/composables/useRemove";
import { useDragAnDrop } from "~/composables/useDragAndDrop";
import { useTaskStore } from "~/stores/task.store";
import { useClassContentMutation } from "~/composables/useClassContentMutation";
import { useGetTypeTask } from "~/composables/useGetTypeTask";
/* Interfaces */
import type {
  Question,
  MultipleTasksProps,
} from "~/interfaces/components/props.components.interface";

// Definir los eventos que emitirá el componente
const emit = defineEmits(["update:value", "save-task"]);
const { typeTask, titleTask, description } = defineProps<MultipleTasksProps>();
const taskStore = useTaskStore();
const route = useRoute();
const taskInstructions = computed(() => taskStore.getTask("instructions"));
const files = computed(() => taskStore.getTask("files"));
const select = computed(() => taskStore.getTask("select"));
const taskTitle = computed(() => taskStore.getTask('taskTitle'));
const value = ref("");
const isActive = ref(false);
const newWordBank = ref("");
const { getType } = useGetTypeTask();

const { mutation, isLoading, isSuccess, isError } = useClassContentMutation();

// Update infoResponseApi ref to use the mutation states
const infoResponseApi = ref({
  isActive: false,
  isLoading: computed(() => isLoading.value),
  isSuccess: computed(() => isSuccess.value),
  isError: computed(() => isError.value),
  error: null,
  data: null,
});

interface Passage {
  text: string;
  keywords: string[];
  help_text: boolean;
}

interface category {
  question: string;
  text_items: { text: string }[];
}

interface Ordering {
  text: string;
  indice: number;
}

interface WordBank {
  text: string;
  keywords: KeyWordBank[];
  extraWords: string[];
}

interface KeyWordBank {
  word: string;
  position: number;
}

const questions = ref<Question[]>([
  {
    question: "",
    statement: "",
    stated: "True",
    text: "",
    indice: 0,
    answers: [
      {
        text: "",
        isCorrect: false,
      },
    ],
    typeTask: titleTask,
  },
]);

const { removeOption, removeQuestion } = useRemove(questions);
const { onDragStart, onDragOver, onDrop } = useDragAnDrop(questions);

// Modify the data structure
interface Multimedia {
  media_type: string;
  file: File | null;
}

const data = ref({
  class_id: route.params.classId,
  content_type: taskTitle.value,
  tittle: "",
  instructions: "",
  stats: false,
  content_details: {
    questions: [] as Question[],
    passages: [] as Passage[],
    categories: [] as category[],
    ordering: [] as Ordering[],
    word_bank: [] as WordBank[],
  },
  multimedia: [] as Multimedia[],
});

watch(
  select,
  (newValue) => {
    console.log("select", newValue);
  },
  { deep: true }
);

// Update the watch for questions
watch(
  questions,
  (newValue) => {
    isActive.value = hasQuestionsWithAnswers();
    infoResponseApi.value.isActive = hasQuestionsWithAnswers();
    if (typeTask === "ordering") {
      data.value.content_details.ordering = newValue.map((q, index) => ({
        text: q.question,
        indice: index + 1,
      }));
    }

    if (typeTask === "category") {
      data.value.content_details.categories = newValue.map((q) => ({
        question: q.text,
        text_items: q.answers.map((a) => ({ text: a.text })),
      }));
    }

    if (typeTask === "true_false") {
      data.value.content_details.questions = newValue.map((q) => ({
        statement: q.statement || q.answers[0]?.text || "",
        stated: q.stated || q.answers[0]?.isCorrect || "",
      }));
    } else {
      data.value.content_details.questions = newValue.map((q) => ({
        question: q.question,
        answers: q.answers.map((a) => ({
          text: a.text,
          isCorrect: a.isCorrect,
        })),
      }));
    }
  },
  { deep: true }
);

// Update the watchers
watch(
  files,
  (newValue) => {
    data.value.multimedia = [];

    if (newValue.image) {
      data.value.multimedia.push({
        media_type: "image",
        file: newValue.image,
      });
    }

    if (newValue.audio) {
      data.value.multimedia.push({
        media_type: "audio",
        file: newValue.audio,
      });
    }
  },
  { deep: true }
);

watch(
  taskInstructions,
  (newValue) => {
    if (newValue) {
      Object.assign(data.value, {
        tittle: newValue.title || "",
        instructions: newValue.instructions || "",
      });
    }
  },
  { deep: true }
);

watch(
  data,
  (newValue) => {
    console.log("newValue", newValue);
  },
  { deep: true }
);

watch(
  () => typeTask,
  (newValue) => {
    console.log("typeTask changed:", newValue);
  },
  { immediate: true }
);

// Este método se encarga de agregar una nueva opción a una pregunta
const addOption = (questionIndex: number) => {
  questions.value[questionIndex].answers.push({
    text: "",
    isCorrect: false,
  });
};

const handleExtraInput = (value: string) => {
  // Split the input string by '/' and trim each word
  const extraWords = value.split('/').map(word => word.trim()).filter(word => word);
  newWordBank.value = extraWords.join('/');
  // Update the word bank data structure with the new extra words
  if (data.value.content_details.word_bank.length > 0) {
    data.value.content_details.word_bank[0].extraWords = extraWords;
  }
};

const handleUpdateValue = (newValue: string) => {
  value.value = newValue;
  isActive.value = newValue.trim() !== "";
  infoResponseApi.value.isActive = newValue.trim() !== "";

  if (taskTitle.value == "word_bank") {
    // Extract words in brackets and their positions
    const matches = newValue.match(/\[(.*?)\]/g);
    let processedText = newValue;
    const keywords: KeyWordBank[] = [];

    if (matches) {
      matches.forEach((match, index) => {
        // Remove brackets and get the word
        const word = match.slice(1, -1).trim();
        // Add to keywords array with position
        keywords.push({
          word: word,
          position: index + 1
        });
        // Replace bracket content with placeholder
        processedText = processedText.replace(match, `__${index + 1}__`);
      });
    }

    // Update the word bank in content details
    data.value.content_details.word_bank = [{
      text: processedText,
      keywords: keywords,
      extraWords: newWordBank.value ? newWordBank.value.split(',').map(word => word.trim()) : []
    }];
  }

  if (taskTitle.value == "fill_gaps") {
    // Split the text by newlines to handle each question
    const lines = newValue.split("\n");
    const passages = lines.map((line, index) => {
      // Extract content within square brackets
      const matches = line.match(/\[(.*?)\]/g);
      let processedText = line;
      const keywords: string[] = [];

      if (matches) {
        matches.forEach((match, matchIndex) => {
          // Remove brackets and extract options
          const options = match.slice(1, -1).split("/");
          // Clean up options and add to keywords
          options.forEach((opt) => {
            const cleanOption = opt.replace("*", "").trim();
            if (cleanOption) keywords.push(cleanOption);
          });
          // Replace bracket content with placeholder
          processedText = processedText.replace(match, `__${matchIndex + 1}__`);
        });
      }

      return {
        text: processedText,
        keywords: keywords,
        help_text: false,
      };
    });

    data.value.content_details.passages = passages;
  }
};

// Este método se encarga de agregar una nueva pregunta

const addQuestion = () => {
  questions.value.push({
    question: "",
    answers: [
      {
        text: "",
        isCorrect: "",
      },
    ],

    typeTask: typeTask,
  });
};

// Este método se encarga de actualizar la respuesta de una opción
const updateOptionAnswer = (
  questionIndex: number,
  optionIndex: number,
  value: string
) => {
  if (typeTask === "ordering") {
    console.log(value);
    questions.value[questionIndex].text = value;
  } else if (typeTask === "true_false") {
    questions.value[questionIndex].statement = value;
  } else {
    questions.value[questionIndex].answers[optionIndex].text = value;
  }
};

// Este método se encarga de actualizar si una opción es correcta o no
const updateOptionIsCorrect = (
  questionIndex: number,
  optionIndex: number,
  value: string | boolean
) => {
  if (typeTask === "true_false") {
    questions.value[questionIndex].stated = value as string;
  } else {
    questions.value[questionIndex].answers[optionIndex].isCorrect =
      value as boolean;
  }
};

// Nueva función para evaluar si el formulario tiene información
const hasQuestionsWithAnswers = () => {
  return questions.value.every((question) => {
    if (typeTask === "true_false") {
      console.log("aqui");
      // For true_false, only check if statement exists
      return question.statement?.trim() !== "";
    }
    if (typeTask === "ordering") {
      return question.text?.trim() !== "";
    }
    // For other types, keep existing validation
    if (question.question.trim() === "") return false;
    return question.answers.every((answer) => answer.text.trim() !== "");
  });
};

const handleSave = () => {
  try {
    const formData = new FormData();

    // Handle multimedia files
    if (data.value.multimedia.length > 0) {
      data.value.multimedia.forEach((media, index) => {
        if (media.file instanceof File) {
          formData.append(`multimedia`, media.file);
        }
      });
    }

    // Prepare content_details based on content type
    let contentDetails;
    if (data.value.content_type === "fill_gaps") {
      contentDetails = { passages: data.value.content_details.passages };
    } else if (data.value.content_type === "word_bank") {
      contentDetails = { word_bank: data.value.content_details.word_bank };
    } else {
      contentDetails = { questions: data.value.content_details.questions };
    }

    // Append all data
    formData.append("class_id", String(data.value.class_id));
    formData.append("content_type", data.value.content_type);
    formData.append("tittle", data.value.tittle);
    formData.append("instructions", data.value.instructions);
    formData.append("content_details", JSON.stringify(contentDetails));
    formData.append("stats", String(data.value.stats));

    // Debug log
    console.log("Sending data:", {
      class_id: data.value.class_id,
      content_type: data.value.content_type,
      tittle: data.value.tittle,
      instructions: data.value.instructions,
      content_details: contentDetails,
      stats: data.value.stats,
    });

    mutation.mutate(formData);
  } catch (error) {
    console.error("Error preparing data:", error);
    throw error;
  }
};
const handleCancel = () => {
  taskStore.addTask("modal", { modal: false });
};
</script>
