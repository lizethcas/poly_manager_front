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
              <p class="bg-tarawera-200 text-tarawera-800 px-2 py-1 rounded-md">
                {{ getTaskNumber(index) }}
              </p>
              <h3 class="text-lg font-bold">
                {{ capitalizeFirstLetter(task.tittle) }}
              </h3>
            </div>
            <p>{{ task.instructions }}</p>
          </div>
          <!-- Display content based on content_type -->
          <div class="text-sm text-fuscous-gray-700">
            <div
              class="flex gap-2"
              v-if="
                task.content_type === 'multiple_choice' ||
                task.content_type === 'category'
              "
            >
              <MoleculeMultipleChoiceQuestion :data="task" />
            </div>

            <div v-else-if="task.content_type === 'true_false'">
              <MoleculeMultipleTaskTrueFalse
                v-for="(question, index) in task.content_details.questions"
                :key="index"
                :question="question"
              />
            </div>

            <div v-else-if="task.content_type === 'fill_gaps'">
              <MoleculeMultipleTaskFill
                v-for="(passage, index) in task.content_details.passages"
                :key="index"
                :text="passage.text"
                :keywords="passage.keywords"
                :help_text="passage.help_text"
                class="my-4"
              />
            </div>

            <MoleculeMultipleTaskWordBank
              v-else-if="task.content_type === 'word_bank'"
              :data="task.content_details.word_bank"
            />

            <VideoTask
              v-else-if="task.content_type === 'video'"
              :task="task"
              :index="getTaskNumber(index)"
            />
            <AudioTask v-else-if="task.content_type === 'audio'" :task="task" />

            <div v-else-if="task.content_type === 'image'">
              <BankGallery :images="task.content_details.images" />
            </div>
          </div>
        </div>
        <div v-if="task.content_type === 'info_box'" class="mt-16 cursor-pointer" @click="handleShowEditNavigation(index)">
          <InfoBoxStudent :task="task"  />
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

    <!-- Rest of your existing template code... -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useModal } from "~/composables/useModal";
import EditClassNavigation from "~/components/organisim/EditClassNavigation.vue";
import BaseTaskModal from "~/components/organisim/BaseTaskModal.vue";
import AudioTask from "~/components/organisim/templatesUsers/students/taskStudents/Audio.vue";
import VideoTask from "~/components/organisim/templatesUsers/students/taskStudents/Video.vue";
import { useAnimation } from "~/composables/useAnimation";
import { useQueryClient, useQuery } from "@tanstack/vue-query";

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
import BankGallery from '~/components/organisim/templatesUsers/students/taskStudents/BankGallery.vue';

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
    console.log("Selected Task:", selectedTask.value);
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
    if (classTasks.value.data[i]?.tittle !== "") {
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
</script>
