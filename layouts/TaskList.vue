<template>
  <!--   <ListScenarios /> -->
  <div v-if="classTasks" class="bg-white rounded-xl pb-4" v-bind="$attrs">
    <div v-for="(task, index) in classTasks.data">
      <div class="mt-4 relative px-4">
        <div
          class="pr-4"
          v-if="
            task.tittle !== '' &&
            task.content_type !== 'video' &&
            task.content_type !== 'info_box' &&
            (route.path.includes('/student') ? currentTaskIndex >= index : true)
          "
        >
          <div>
            <div class="flex justify-start gap-2 w-full">
              <p
                class="bg-tarawera-100 text-primary-color px-2 py-1 rounded-md"
              >
                {{ getTaskNumber(index) }}
              </p>
              <h3 class="text-lg font-semibold">
                {{ capitalizeFirstLetter(task.tittle) }}
              </h3>
            </div>
            <p class="text-md my-4 font-medium">
              {{ task.instructions }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <UDropdown
            :items="items(task)"
            :popper="{ placement: 'bottom-start' }"
            class="cursor-pointer rounded-lg"
          >
            <IconMolecule
              :name="IconType.menuTasks"
              :size="18"
              :color="'text-tarawera-700'"
            />
          </UDropdown>
          <slot :task="task" :index="index" />
        </div>
      </div>
    </div>

    <ListScenarios v-if="route.path.includes('/admin')" />
    <ScenarioListStudent v-if="route.path.includes('/student')" />
  </div>
  <div v-else>
    <pre>Aun no hay contenido para esta clase</pre>
  </div>
  <UAlert
    v-if="showDeleteAlert"
    class="w-full max-w-xl mx-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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

  <BaseTaskModal
    v-if="isModalOpen"
    :is-open="isModalOpen"
    :title="modalTitle"
    :icon="modalIcon"
    @close="closeModal"
    :menuItems="getDataMenu(modalTitle)"
  />
</template>
<script setup lang="ts">
defineOptions({
  inheritAttrs: false // Prevent the warning
})

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
  isModalOpen.value = true;
  if (task.audio !== null || task.video !== null) {
    modalTitle.value = "Layout block";
  } else if (task.content_type !== "info_box") {
    modalTitle.value = "Knowledge check";
  }
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
      modalTitle.value = task.content_type;
  }

  modalIcon.value = "i-heroicons-pencil-square-20-solid";
  // Store the task data for editing
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
