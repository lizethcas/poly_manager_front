<template>
  <div
    class="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex items-center justify-center p-4"
    v-if="isOpen"
  >
    <div
      class="bg-white pr-6 rounded-lg shadow-lg w-[95vw] h-[95vh] overflow-y-auto flex gap-4 relative"
      :class="{ 'overflow-y-hidden': isSidebarOpen }"
    >
      <!-- Menú Lateral en móvil (toggle) -->
      <div
        class="fixed md:hidden inset-y-0 left-0 w-64 bg-gray-100 p-4 rounded-r-lg shadow-md transform transition-transform duration-300 z-20"
        :class="{'-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen}"
      >
        <div class="flex justify-end items-center mb-4">
          
          <button
            class="bg-white p-2 rounded-md shadow"
            @click="isSidebarOpen = false"
          >
            <Icon name="material-symbols:close" size="24" />
          </button>
        </div>
        <!-- Contenido del menú -->
        <InteractiveTask
          :menuItems="menuItems"
          @select-task="handleTaskSelection"
        />
      </div>

      <!-- Main Content -->
      <div class="flex-1 mt-6 z-10 ">
        <!-- Modal Header -->
        <div
          class="fixed flex justify-between items-center border-b-[1px] w-[95vw] px-4 top-0 bg-white z-10"
        >
          <div class="flex items-center gap-2 m-2">
            <!-- Botón hamburguesa (solo visible en pantallas pequeñas) -->
            <button
              class="md:hidden bg-white p-2 rounded-md shadow"
              @click="isSidebarOpen = !isSidebarOpen"
            >
              <Icon
                :name="
                  isSidebarOpen
                    ? 'material-symbols:close'
                    : 'material-symbols:menu'
                "
                size="24"
              />
            </button>
          </div>
          <div class="flex-1 flex justify-center items-center">
            <Icon :name="icon" size="30" class="text-primary-color" />
            <h2 class="text-m font-bold text-primary-color">{{ title }}</h2>
          </div>
          <div class="flex items-center gap-2 m-2">
            <img
              src="../../assets/images/close.webp"
              alt="close create course"
              class="w-5 h-5 cursor-pointer"
              @click="$emit('close')"
            />
          </div>
        </div>
        <div class="flex gap-4">
          <div
            class="w-48 bg-gray-100 hidden md:block p-4 rounded-lg max-h-100vh overflow-y-auto sticky top-6"
          >
            <InteractiveTask
              :menuItems="menuItems"
              @select-task="handleTaskSelection"
            />
          </div>
          <div class="flex-1 px-3 md:px-0">
            <!-- Common Fields -->
            <div class="space-y-4 my-6">
              <MoleculeInput
                :title="'Title'"
                type="text"
                label="false"
                :placeholder="'Enter the heading'"
                class="text-md"
                v-model="formData.title"
              />
              <MoleculeInput
                :title="'Instructions'"
                type="text_area"
                :size="taskTitle === 'Info Box' ? 'xl' : 'lg'"
                class="text-md"
                v-model="formData.instructions"
                :placeholder="'Enter the task description'"
                label="false"
              />
            </div>

            <div class="pb-10">
              <component
                :is="getCurrentComponent(title)"
                :selectedTask="taskTitle"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useTaskStore } from "~/stores/task.store";
import { useGetComponent } from "~/composables/useGetComponent";
import InteractiveTask from "./InteractiveTask.vue";

const { getCurrentComponent } = useGetComponent();

const props = defineProps({
  isOpen: Boolean,
  title: String,
  modelValue: Object,
  icon: String,
  type: String,
  menuItems: Array,
  editData: {
    type: Object,
    default: () => null
  }
});

interface TaskMenuItem {
  name: string | undefined;
  type: string | undefined;
}

const taskTitle = ref("");
const taskStore = useTaskStore();
const formData = ref({
  title: "",
  instructions: "",
});
const isSidebarOpen = ref(false);

// Add watch for editData to populate form when editing
watch(() => props.editData, (newData) => {
  if (newData) {
    formData.value = {
      title: newData.tittle || "",
      instructions: newData.instructions || ""
    };
    if (newData.content_type) {
      taskTitle.value = newData.content_type;
    }
  }
}, { immediate: true });

// Observa los cambios en formData y registra en consola
watch(
  formData,
  (newValue) => {
    emit("update:modelValue", newValue);
    taskStore.addTask("instructions", newValue);
  },
  { deep: true }
);

const emit = defineEmits(["update:modelValue", "close"]);

// Maneja la selección de tareas
const handleTaskSelection = (task: TaskMenuItem) => {
  taskStore.addTask("taskTitle", task.name);
  taskStore.addTask("typeTask", task.type);
  taskTitle.value = task.name;
  isSidebarOpen.value = false; // Cierra el menú al seleccionar un ítem
};
</script>

<style scoped>
/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>