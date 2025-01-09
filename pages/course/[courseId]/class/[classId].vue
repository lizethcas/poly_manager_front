<template>
  <div class="w-full">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center mt-4">
      <p>Loading tasks...</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="text-red-500 flex justify-center items-center mt-4"
    >
      <p>Error loading tasks: {{ error.message }}</p>
    </div>

    <!-- Tasks list -->
    <div
      v-else-if="classTasks && classTasks.data.length > 0"
      class="mt-4 text-fuscous-gray-950 max-w-4xl mx-auto"
    >
      <template v-for="(task, index) in classTasks.data" :key="task.id">
        <div
          v-if="task.content_type !== 'info_box'"
          :class="[
            task.content_type === 'video'
              ? 'cursor-pointer'
              : 'mt-3 cursor-pointer shadow-md shadow-fuscous-gray-300 rounded-lg p-4 my-4',
          ]"
          @click="handleShowEditNavigation(index)"
        >
          <div
            v-if="
              task.tittle !== '' &&
              task.content_type !== 'video' &&
              task.content_type !== 'info_box'
            "
          >
            <div class="flex justify-start gap-2 my-2">
              <p
                class="bg-tarawera-100 text-primary-color px-2 py-1 rounded-md"
              >
                {{ getTaskNumber(index) }}
                
              </p>
              <h3 class="text-lg font-semibold">
                {{ capitalizeFirstLetter(task.tittle) }}
              </h3>
            </div>
            <p class="text-sm font-semibold">{{ task.instructions }}</p>
          </div>
          <!-- Display content based on content_type -->
          <div class="text-sm text-fuscous-gray-700">
            <!-- Multiple Choice and True/False with Media -->
            <div
              v-if="
                [
                  'multiple_choice',
                  'category',
                  'true_false',
                  'fill_gaps',
                  'word_bank',
                  'category',
                ].includes(task.content_type) &&
                (task.image || task.audio)
              "
              class="flex gap-2"
            >
              <MoleculeMultipleTaskLayout
                v-if="task.image || task.audio"
                :data="task"
              >
                <component
                  :is="getQuestionComponent(task.content_type)"
                  v-for="(question, index) in getQuestions(task)"
                  :key="index"
                  :question="question"
                  :index="index"
                />
                <component
                  :is="getContentComponent(task.content_type)"
                  v-bind="getComponentProps(task, index)"
                />
              </MoleculeMultipleTaskLayout>
            </div>

            <!-- Standard Multiple Choice and True/False -->
            <div
              v-else-if="
                ['true_false', 'multiple_choice', 'category'].includes(
                  task.content_type
                )
              "
            >
              <component
                :is="getQuestionComponent(task.content_type)"
                v-for="(question, index) in task.content_details.questions"
                :key="index"
                :question="question"
                :index="index"
              />
            </div>

            <!-- Other content types -->
            <component
              v-else
              :is="getContentComponent(task.content_type)"
              v-bind="getComponentProps(task, index)"
            />
          </div>
        </div>
        <div
          v-if="task.content_type === 'info_box'"
          class="mt-16 cursor-pointer"
          @click="handleShowEditNavigation(index)"
        >
          <InfoBoxStudent :task="task" />
        </div>
        <!-- Insert EditClassNavigation after the selected task -->
        <transition
          name="slide-up"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
          v-bind:css="false"
        >
          <EditClassNavigation
            v-if="showEditNavigation && selectedTaskIndex === index && !isOpen"
            @open-modal="openModalHandler"
          />
        </transition>
      </template>
    </div>

    <!-- No tasks message -->
    <div
      v-else
      class="font-bold items-center text-center mt-4 text-fuscous-gray-950 text-md"
    >
      <div>
        <p>There are no activities created for this course yet.</p>
        <button
          @click="handleAddBlock"
          class="hover:underline hover:text-tarawera-700 text-fuscous-gray-950 px-4 py-2 rounded-md"
        >
          Add Block
        </button>
        <EditClassNavigation
          v-if="showEditNavigation && !isOpen"
          @open-modal="openModalHandler"
        />
      </div>
    </div>

    <div v-if="isOpen">
      <BaseTaskModal
        :is-open="isOpen"
        @close="closeModal"
        :title="currentModal.label"
        v-model="formData"
        class="max-h-[80vh] overflow-y-auto"
        :icon="currentModal.name"
        :menuItems="dataMenu(currentModal.label)"
      >
        <div class="pb-10">
          <component :is="getCurrentComponent()" :selectedTask="selectedTask" />
        </div>
      </BaseTaskModal>
    </div>

    <!-- Floating scroll buttons -->
    <div class="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
      <button 
        v-if="showUpButton"
        @click="scrollToPreviousSection"
        class="bg-primary-color text-white p-3 rounded-full shadow-lg hover:bg-tarawera-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      <button 
        v-if="showDownButton"
        @click="scrollToNextSection"
        class="bg-primary-color text-white p-3 rounded-full shadow-lg hover:bg-tarawera-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </div>

    <!-- Rest of your existing template code... -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useModal } from "~/composables/useModal";
import EditClassNavigation from "~/components/organisim/EditClassNavigation.vue";
import BaseTaskModal from "~/components/organisim/BaseTaskModal.vue";
import AudioTask from "~/components/organisim/templatesUsers/students/taskStudents/Audio.vue";
import VideoTask from "~/components/organisim/templatesUsers/students/taskStudents/Video.vue";
import { useAnimation } from "~/composables/useAnimation";
import { useQueryClient, useQuery } from "@tanstack/vue-query";
import MoleculeMultipleTaskLayout from "~/layouts/MultipleTakLayout.vue";
import MoleculeMultipleTaskWordBank from "~/components/molecule/multipleTask/WordBank.vue";
import MoleculeMultipleTaskTrueFalse from "~/components/molecule/multipleTask/TrueFalse.vue";
import MoleculeMultipleChoiceQuestion from "~/components/molecule/multipleTask/MultipleChoiceQuestion.vue";
import { useRoute } from "vue-router";
import { useCapitalizerLetter } from "~/composables/useCapitalizerLetter";
import { useDataMenu } from "~/composables/useDataMenu";
import { useClassContents } from "~/composables/useClassContents";

import VideoBlock from "~/components/organisim/VideoBlock.vue";
import TextBlock from "~/components/organisim/blocks/TextBlock.vue";

import MultimediaBlock from "~/components/organisim/blocks/MultimediaBlock.vue";
import OrganisimLayoutBlock from "~/components/organisim/blocks/LayoutBlock.vue";
import KnowledgeCheckBlock from "~/components/organisim/KnowledgeCheckBlock.vue";
import { useTaskStore } from "~/stores/task.store";
import MoleculeMultipleTaskFill from "~/components/molecule/multipleTask/Fill.vue";
import TextBlockModules from "~/components/organisim/TextBlockModules.vue";
import GalleryLayout from "~/components/organisim/blocks/GalleryLayout.vue";
import InfoBoxStudent from "~/components/organisim/templatesUsers/students/taskStudents/InfoBoxStudent.vue";
import BankGallery from "~/components/organisim/templatesUsers/students/taskStudents/BankGallery.vue";
import TextBlockStudent from '~/components/organisim/templatesUsers/students/taskStudents/TextBlockStudent.vue';

const taskStore = useTaskStore();
const route = useRoute();
const { capitalizeFirstLetter } = useCapitalizerLetter();
const { isOpen, closeModal, openModal } = useModal();
const { beforeEnter, enter, leave } = useAnimation();
const currentModal = ref({ label: "", name: "" });
const formData = ref({ title: "", instructions: "" });
const showEditNavigation = ref(false);
const selectedTaskIndex = ref(-1);
const selectedTask = ref(null);
const queryClient = useQueryClient();
const { getDataMenu } = useDataMenu();

const classId = route.params.classId;
const closeModalHandler = computed(() => taskStore.getTask("modal"));

watch(closeModalHandler, () => {
  closeModal();
});

const openModalHandler = (label: string, name: string) => {
  currentModal.value = { label, name };

  openModal(); // Asegúrate de abrir el modal
};
const dataMenu = (label: string) => getDataMenu(label);
// Replace the existing query with the composable
const {
  classContents: classTasks,
  isLoading,
  error,
} = useClassContents(classId);

// Update the watch to use the new variable name
watch(classTasks, (newTasks) => {
  if (newTasks?.data) {
    closeModal();
    showEditNavigation.value = false;

    const currentData = [...newTasks.data];

    const insertionIndex = taskStore.insertionIndex;
    if (insertionIndex !== -1) {
      queryClient.setQueryData(["class-contents", classId], {
        ...newTasks,
        data: currentData,
      });

      taskStore.setInsertionIndex(-1);
    }
  }
});

const getCurrentComponent = () => {
  switch (currentModal.value.label) {
    case "Layout block":
      return OrganisimLayoutBlock;
    case "Video layout":
      return VideoBlock;
    case "Text block":
      return TextBlock;
    case "Info block":
      return TextBlockModules;
    case "Multimedia block":
      return MultimediaBlock;
    case "Knowledge check":
      return KnowledgeCheckBlock;
    case "Gallery layout":
      return GalleryLayout;
    default:
      return null; // Devolver null si no hay coincidencia
  }
};

const handleShowEditNavigation = (index: number) => {
  selectedTaskIndex.value = index;
  if (classTasks.value?.data) {
    selectedTask.value = classTasks.value.data[index];
  }
  showEditNavigation.value = true;
  taskStore.setInsertionIndex(index);
};

const handleAddBlock = () => {
  selectedTaskIndex.value = -1; // Reset the selected task index
  showEditNavigation.value = true;
};

const getTaskNumber = (currentIndex: number) => {
  if (!classTasks.value?.data) return "";

  let mainNumber = 1;
  let subNumber = 0;

  for (let i = 0; i <= currentIndex; i++) {
    if (classTasks.value.data[i]?.tittle !== "" && classTasks.value.data[i]?.content_type !== 'info_box') {
      subNumber++;
      if (i === currentIndex) {
       
   
        return `${mainNumber}.${subNumber}`;
      }
    }
  }

  if (!classTasks.value.data[currentIndex]?.tittle) {
    return "";
  }

  return `${mainNumber}.${subNumber}`;
};

// Component mapping
const contentComponents = {
  fill_gaps: MoleculeMultipleTaskFill,
  word_bank: MoleculeMultipleTaskWordBank,
  video: VideoTask,
  audio: AudioTask,
  image: BankGallery,
  text_block: TextBlockStudent,
} as const;

const questionComponents = {
  multiple_choice: MoleculeMultipleChoiceQuestion,
  true_false: MoleculeMultipleTaskTrueFalse,
  fill_gaps: MoleculeMultipleTaskFill,
  category: MoleculeMultipleChoiceQuestion,
} as const;

// Helper functions
const getQuestionComponent = (contentType: string) => {
  const component =
    questionComponents[contentType as keyof typeof questionComponents];
  if (!component) {
    console.warn(`No component found for content type: ${contentType}`);
  }
  return component;
};

const getContentComponent = (contentType: string) => {
  return contentComponents[contentType as keyof typeof contentComponents];
};

const getQuestions = (task: any) => {
  return task.content_details.questions || task.categories;
};

const getComponentProps = (task: any, index: number) => {
  const props = {
    fill_gaps: (task: any) => ({
      passages: task.content_details.passages,
      class: "my-4",
    }),
    word_bank: (task: any) => ({
      data: task.content_details.word_bank,
    }),
    video: (task: any, index: number) => ({
      task,
      index: getTaskNumber(index),
    }),
    audio: (task: any) => ({
      task,
    }),
    image: (task: any) => ({
      images: task.content_details.images,
    }),
    text_block: (task: any) => ({
      taskData: task.content_details.text_block,
    }),
  };

  const propGetter = props[task.content_type as keyof typeof props];
  return propGetter ? propGetter(task, index) : {};
};

// Modified scroll function with viewport height tracking
const currentScrollPosition = ref(0);

const showUpButton = ref(false);
const showDownButton = ref(true);

// Update scroll position tracking
onMounted(() => {
  window.addEventListener('scroll', updateScrollButtons);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollButtons);
});

const updateScrollButtons = () => {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // Show up button if not at top
  showUpButton.value = scrollPosition > 200;

  // Show down button if not at bottom
  showDownButton.value = scrollPosition + windowHeight < documentHeight - 100;
};

const scrollToPreviousSection = () => {
  const viewportHeight = window.innerHeight;
  currentScrollPosition.value = Math.max(0, currentScrollPosition.value - viewportHeight);

  window.scrollTo({
    top: currentScrollPosition.value,
    behavior: 'smooth'
  });
};

const scrollToNextSection = () => {
  const viewportHeight = window.innerHeight;
  const maxScroll = document.documentElement.scrollHeight - viewportHeight;
  currentScrollPosition.value = Math.min(maxScroll, currentScrollPosition.value + viewportHeight);

  window.scrollTo({
    top: currentScrollPosition.value,
    behavior: 'smooth'
  });
};
</script>
