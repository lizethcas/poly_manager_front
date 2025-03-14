<template>
  <div v-if="classTasks" class="bg-white rounded-xl p-3 md:p-8" v-bind="$attrs">

    
    <div v-for="(task, index) in classTasks.data" :key="index"
    >

    <template v-if="task.content_type === 'video'">
      <div class="mt-4 relative px-2 sm:px-4 w-full">
        <div class="flex flex-wrap items-center gap-2 w-full mb-2">
          <p class="bg-tarawera-100 text-primary-color px-2 py-1 rounded-md text-sm">
            {{ getTaskNumber(index) }}
          </p>
          <!-- <h3 class="text-md sm:text-lg font-semibold break-words">
            {{ capitalizeFirstLetter(task.tittle) }}
          </h3> -->
        </div>
        
        <!-- Contenedor responsivo para videos -->
        <!-- <div class="video-container w-full relative">
          <div class="w-full h-full">
            <slot :task="task" :index="index" />
          </div>
        </div> -->
      </div>
    </template>
      <div class="mt-4 relative px-2 sm:px-4">
        <div
          class="pr-2 sm:pr-4"
          v-if="
            task.tittle !== '' &&
            task.content_type !== 'video' &&
            task.content_type !== 'info_box' &&
            (route.path.includes('/student') ? currentTaskIndex >= index : true)
          "
        >
          <div>
            <!-- Header más responsive -->
            <div class="flex flex-wrap items-center gap-2 w-full">
              <p
                class="bg-tarawera-100 text-primary-color px-2 py-1 rounded-md text-sm"
              >
                {{ getTaskNumber(index) }}
              </p>
              <h3 class="text-md sm:text-lg font-semibold break-words">
                {{ capitalizeFirstLetter(task.tittle) }}
              </h3>
            </div>
            <p class="text-sm sm:text-md my-2 sm:my-4 font-medium">
              {{ task.instructions }}
            </p>
          </div>
        </div>

        <!-- Barra de acciones responsiva -->
        <!-- Barra de acciones responsiva -->
        <div
          class="flex items-center justify-between w-full mt-2 sm:justify-start sm:gap-2"
        >
          <UDropdown
            v-if="route.path.includes('/admin')"
            :items="items(task)"
            :popper="{ placement: 'bottom-start' }"
            class="cursor-pointer rounded-lg"
          >
            <IconMolecule
              v-if="!isStudent"
              :name="IconType.menuTasks"
              :size="18"
              :color="'text-tarawera-700'"
            />
          </UDropdown>
          <div class="flex-grow">
            <slot :task="task" :index="index" />
          </div>
        </div>
      </div>

      <!-- Separador visual para móviles -->
      <div class="border-b border-gray-100 my-4 mx-2 sm:hidden"></div>
    </div>

    <ListScenarios v-if="route.path.includes('/admin')" />
    <ScenarioListStudent v-if="route.path.includes('/student')" />
  </div>

  <div v-else class="p-4 text-center text-gray-500">
    <p>Aun no hay contenido para esta clase</p>
  </div>

  <!-- Alerta de confirmación responsiva -->
  <UAlert
    v-if="showDeleteAlert"
    class="w-full max-w-sm sm:max-w-xl mx-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    :actions="[
      {
        variant: 'solid',
        color: 'red',
        label: 'Delete',
        click: () => confirmDelete(),
      },
      {
        variant: 'outline',
        color: 'gray',
        label: 'Cancel',
        click: () => (showDeleteAlert = false),
      },
    ]"
    title="Delete Task"
    description="Are you sure you want to delete this task? This action cannot be undone."
  />

  <!-- Modal responsiva -->
  <BaseTaskModal
    v-if="isModalOpen"
    :is-open="isModalOpen"
    :title="modalTitle"
    :icon="modalIcon"
    :edit-data="taskStore.getTask('editData')"
    @close="closeModal"
    :menuItems="getDataMenu(modalTitle)"
    class="max-h-[90vh] overflow-y-auto"
  />
</template>

<script setup lang="ts">
/**
 * @component TaskList
 * @description A component that displays a list of educational tasks/blocks in a class.
 * It handles both student and admin/teacher views with different functionalities.
 *
 * Key Features:
 * - Displays numbered tasks with titles and instructions
 * - Provides edit and delete functionality for tasks (admin view)
 * - Supports different content types (video, info_box, text_block, etc.)
 * - Integrates with scenario lists for both students and admins
 * - Includes a dropdown menu for task actions
 * - Shows confirmation alerts for deletions
 *
 * Props:
 * @prop {number} currentTaskIndex - Optional. Used in student view to control which tasks are visible
 *
 * Components Used:
 * - ListScenarios: Admin view for scenario management
 * - ScenarioListStudent: Student view for scenarios
 * - IconMolecule: Icon component for UI elements
 * - BaseTaskModal: Modal for task editing
 * - UDropdown: Dropdown menu component
 * - UAlert: Alert component for confirmations
 *
 * Key Methods:
 * @method getTaskNumber - Generates the task numbering (e.g., "1.1", "1.2")
 * @method handleEditTask - Manages task editing and modal display
 * @method handleDeleteTask - Initiates task deletion process
 * @method confirmDelete - Executes task deletion
 * @method closeModal - Closes the edit modal
 *
 * States:
 * - showDeleteAlert: Controls deletion confirmation dialog
 * - isModalOpen: Controls edit modal visibility
 * - modalTitle: Sets the title for the edit modal
 * - modalIcon: Sets the icon for the edit modal
 *
 * Content Types Supported:
 * - info_box
 * - video
 * - image
 * - audio
 * - text_block
 * - knowledge check (default)
 * - layout block (for content with audio or image)
 */
defineOptions({
  inheritAttrs: false, // Prevent the warning
});

import { useCapitalizerLetter } from "~/composables/useCapitalizerLetter";
import ListScenarios from "~/components/organisim/templatesUsers/teachers/ListScenarios.vue";
import ScenarioListStudent from "~/components/organisim/templatesUsers/students/taskStudents/ScenarioListStudent.vue";
import { useClassContents } from "~/composables/useClassContents";
import { useRoute } from "vue-router";
import IconMolecule from "~/components/atomos/Icon.vue";
import { IconType } from "~/data/iconsType";
import { useClassContentMutation } from "~/composables/useClassContentMutation";
import BaseTaskModal from "~/components/organisim/BaseTaskModal.vue";
import { useDataMenu } from "~/composables/useDataMenu";
import { useTaskStore } from "~/stores/task.store";

const route = useRoute();
const {
  classContents: classTasks,
  isLoading,
  error,
} = useClassContents(route.params.classId as string);
const { delete: deleteContentMutation } = useClassContentMutation();
const isStudent = route.path.includes('/student');

const { capitalizeFirstLetter } = useCapitalizerLetter();
const getTaskNumber = (currentIndex: number) => {
  if (!classTasks.value?.data) return "";

  let mainNumber = 1;
  let subNumber = 0;

  for (let i = 0; i <= currentIndex; i++) {
    if (
      classTasks.value.data[i]?.tittle !== "" &&
      classTasks.value.data[i]?.content_type !== "info_box"
    ) {
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

const handleEditTask = (task: any) => {
  console.log(task);
  isModalOpen.value = true;

  // First check specific content types
  switch (task.content_type) {
    case "info_box":
      modalTitle.value = "Info block";
      break;
    case "video":
      modalTitle.value = "Video Layout";
      break;
    case "image":
      modalTitle.value = "Gallery Layout";
      break;
    case "audio":
      modalTitle.value = "Multimedia block";
      break;
    case "text_block":
      modalTitle.value = "Text block";
      break;
    default:
      if (task.audio || task.image) {
        modalTitle.value = "Layout block";
        // Update the files data structure with boolean icon value
        taskStore.addTask("files", {
          audio: task.audio,
          image: task.image,
          modelValue: task.image || null,
          icon: true, // Changed from "true" to true
        });
      } else {
        modalTitle.value = "Knowledge check";
      }
  }

  modalIcon.value = "i-heroicons-pencil-square-20-solid";
  taskStore.addTask("editData", task);
};

const showDeleteAlert = ref(false);
const taskToDelete = ref(null);

const handleDeleteTask = (task: any) => {
  showDeleteAlert.value = true;
  taskToDelete.value = task;
};

const confirmDelete = () => {
  if (taskToDelete.value) {
    deleteContentMutation.mutate(taskToDelete.value.id);
    showDeleteAlert.value = false;
    taskToDelete.value = null;
  }
};
// Add currentTaskIndex to props
defineProps<{
  currentTaskIndex?: number;
}>();

const items = computed(() => (task: any) => [
  [
    {
      label: "Edit block",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => handleEditTask(task),
    },
  ],
  [
    {
      label: "Delete block",
      icon: "i-heroicons-trash-20-solid",
      click: () => handleDeleteTask(task),
    },
  ],
]);

const taskStore = useTaskStore();
const { getDataMenu } = useDataMenu();
const isModalOpen = ref(false);
const modalTitle = ref("");
const modalIcon = ref("");

watch(
  () => taskStore.getTask("modal"),
  (newValue) => {
    isModalOpen.value = newValue?.modal ?? false;
  },
  { immediate: true }
);

const closeModal = () => {
  isModalOpen.value = false;
};
</script>


<style scoped>
/* Estilos adicionales para responsividad */
@media (max-width: 640px) {
  /* Mejora del comportamiento touch en móviles */
  .cursor-pointer {
    cursor: default;
    -webkit-tap-highlight-color: transparent;
  }

  /* Aumentar área de toque para elementos interactivos */
  button,
  [role="button"],
  .cursor-pointer {
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Estilos para videos en móvil */
  .video-container {
    aspect-ratio: 16/9;
    margin-bottom: 1rem;
  }
  
  /* Asegurar que los videos ocupan toda la anchura disponible */
  .video-container :deep(video),
  .video-container :deep(iframe),
  .video-container :deep(.video-js) {
    width: 100% !important;
    height: 100% !important;
    max-height: none !important;
  }
}

/* Estilos para videos en todas las pantallas */
.video-container {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.video-container :deep(video),
.video-container :deep(iframe),
.video-container :deep(.video-js) {
  width: 100%;
  border-radius: 0.5rem;
}
</style>
