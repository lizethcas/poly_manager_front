<template>
  <p v-if="!classes" class="text-title-color">No hay clases</p>
  <main
    v-if="filteredClasses.length > 0"
    v-for="(classItem, index) in filteredClasses"
    :key="classItem.id"
    draggable="true"
    @dragstart="onDragStart($event, index)"
    @dragover="onDragOver($event)"
    @drop="onDrop($event, index)"
    class="mt-4"
  >
    <div class="relative flex items-center">
      <!-- Dots Menu -->
      <button
        v-if="showDragIcon"
        class="h-full px-4 cursor-grab flex items-center"
      >
        <Icon
          name="material-symbols:drag-indicator"
          size="24"
          class="text-gray-400"
        />
      </button>

      <!-- Main Content -->
      <div class="flex-1">
        <div
          class="flex flex-col sm:flex-row items-start gap-4 bg-[#f5f5f5] rounded-md p-4"
        >
          <!-- Image -->
          <div class="w-full sm:w-20 h-20 flex-shrink-0">
            <img
              v-if="classItem.cover"
              :src="getCoverUrl(classItem.cover)"
              alt=""
              class="rounded-lg object-cover w-full h-full"
            />
            <div v-else class="w-full h-full bg-gray-100 rounded-lg"></div>
          </div>

          <!-- Content Section -->
          <div class="flex-1">
            <!-- Header with Title and Counter -->
            <div class="flex flex-col justify-between h-20 pb-2">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-medium text-gray-900 text-xs sm:text-base">
                  Lesson {{ index }}. {{ classItem.name }}
                </h3>

                <div
                  class="text-sm px-2 py-1 bg-gray-100 rounded-full flex items-center gap-2"
                >
                  <Icon name="bi:collection-fill" size="14" />
                  {{ index }}/{{ props.classes.length }}
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-2 relative">
                <!-- Always visible buttons -->
                <button
                  class="bg-blue-500 text-white p-1 rounded-full flex items-center gap-1"
                  @click="
                    navigateTo(
                      routes.routesAdmin.class(routeCourseId, classItem.id)
                    )
                  "
                >
                  <Icon name="material-symbols:edit-outline" size="14" />
                  <span class="text-xs">edit</span>
                </button>
                <button
                  class="bg-blue-500 text-white p-1 rounded-full flex items-center gap-1"
                  @click="openEditClass(classItem)"
                >
                  <Icon name="material-symbols:visibility-outline" size="14" />
                  <span class="text-xs">Settings</span>
                </button>

                <!-- Dropdown for additional buttons -->
                <div class="relative">
                  <button
                    class="bg-gray-200 text-gray-600 p-1 rounded-full flex items-center gap-1"
                    @click="toggleDropdown(classItem.id)"
                  >
                    <Icon name="material-symbols:more-vert" size="14" />
                  </button>
                  <div
                    v-if="dropdownOpen === classItem.id"
                    class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                  >
                    <button
                      class="flex items-center w-full text-left px-4 py-2 gap-1 border-t border-gray-200"
                      @click="openModalHandler(classItem.id)"
                    >
                      <Icon
                        name="material-symbols:visibility-outline"
                        size="14"
                      />
                      <span class="text-xs">preview</span>
                    </button>
                    <div
                      class="flex items-center gap-4 px-4 py-2 cursor-pointer border-t border-gray-200"
                      @click.stop="togglePublish(classItem)"
                    >
                      <div
                        v-if="classItem.publish"
                        class="bg-emerald-100 text-emerald-700 text-xs px-2 rounded-full flex items-center gap-1"
                      >
                        <IconMolecule
                          :name="IconType.eye"
                          :size="16"
                          :color="'text-emerald-700'"
                        />
                        <span class="leading-none">published</span>
                      </div>
                      <div
                        v-if="!classItem.publish"
                        class="text-xs px-2 rounded-full flex items-center gap-1 bg-white border border-fuscous-gray-600"
                      >
                        <IconMolecule
                          :name="IconType.eyeOff"
                          :size="16"
                          :color="'text-fuscous-gray-600'"
                        />
                        <span class="leading-none">hidden</span>
                      </div>
                    </div>
                    <button
                      class="flex items-center w-full text-left px-4 py-2 gap-1 border-t border-gray-200"
                      @click="handleDelete(classItem.id)"
                    >
                      <Icon name="material-symbols:delete-outline" size="14" />
                      <span class="text-xs">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <div
    v-if="isOpen"
    class="fixed flex justify-center items-center inset-0 bg-gray-600 bg-opacity-50 z-50"
  >
    <div class="w-full max-w-5xl mx-auto">
      <AddCourseModal
        :title="createClass.title"
        @closeModal="closeModal"
        :showExtraElements="false"
        @handleSave="handleSave"
        :initialData="selectedClass"
        :actionType="'edit'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useGetCover } from "~/composables/useGetcover";
import type { ClassData } from "~/interfaces/models/class.interface..model";
import { useClassesQuery } from "~/composables/useClassesQuery";
import AddCourseModal from "./AddCourseModal.vue";
import { IconType } from "~/data/iconsType";
import { createClass } from "~/data/cardModal";
import { routes } from "~/data/routes";
import { useNotify } from "~/composables/useNotify";
import { useModal } from "~/composables/useModal";
import { useRoute } from "nuxt/app";
import { useClassMutation } from "~/composables/useClassMutation";
import IconMolecule from "~/components/atomos/Icon.vue";

const { success, error } = useNotify();
const { isOpen, openModal, closeModal } = useModal();
const route = useRoute();
const courseId = route.params.courseId as string;

// Define props
const props = defineProps<{
  classes: ClassData[];
  showDragIcon?: boolean;
}>();
const selectedClass = ref<ClassData | null>(null);
// Add computed property for filtered classes
const filteredClasses = computed(() => {
  if (!props.classes) return [];
  return props.classes.filter((classItem) => {
    return (
      classItem &&
      classItem.course_id &&
      classItem.course_id.toString() === courseId
    );
  });
});

const classesRef = ref(props.classes);

const { getCoverUrl } = useGetCover();
const routeCourseId = useRoute().params.courseId as string;
const { onDragOver, onDrop, onDragStart } = useDragAnDrop(classesRef);

const { deleteClass, isDeletingClass } = useClassesQuery(courseId);

const { updateClassMutation } = useClassMutation();

const openModalHandler = (classId: number) => {
  navigateTo(routes.routesStudent.class(routeCourseId, classId));
};

const handleDelete = async (classId: number) => {
  if (confirm("Are you sure you want to delete this class?")) {
    try {
      await deleteClass(classId);
      success("Class deleted successfully");
    } catch (err) {
      console.error("Error deleting class:", err);
      error("Error deleting class");
    }
  }
};

const openEditClass = (classItem: ClassData) => {
  console.log(classItem);
  selectedClass.value = {
    ...classItem,
    name: classItem.name,
    description: classItem.description,
    bullet_points: classItem.bullet_points,
    cover: classItem.cover,
    publish: classItem.publish,
  };

  openModal();
};

const handleSave = async (formData: any) => {
  if (!selectedClass.value?.id) return;

  const formDataToSend = new FormData();

  // Add non-file fields to FormData
  Object.entries(formData.formData).forEach(([key, value]) => {
    if (key === "cover") return;

    if (value !== undefined && value !== null && value !== "") {
      formDataToSend.append(key, value as string);
    }
  });

  // Handle cover file
  if (formData.formData.cover instanceof File) {
    formDataToSend.append("cover", formData.formData.cover);
  }

  // Add bullet points if they exist
  if (formData.bulletPoints?.length > 0) {
    formDataToSend.append(
      "bullet_points",
      JSON.stringify(formData.bulletPoints)
    );
  }

  try {
    await updateClassMutation.mutateAsync({
      id: selectedClass.value.id,
      formData: formDataToSend,
    });
    success("Class updated successfully");
    closeModal();
  } catch (err) {
    console.error("Error updating class:", err);
    error("Error updating class");
  }
};

// Add emit definition in script setup
const emit = defineEmits(['update:classes']);

// Update the togglePublish function
const togglePublish = async (classItem: ClassData) => {
  const formData = new FormData();
  const newPublishState = !classItem.publish;
  formData.append("publish", newPublishState.toString());

  try {
    await updateClassMutation.mutateAsync({
      id: classItem.id,
      formData: formData,
    });
    
    // Update the classes array immutably
    const updatedClasses = props.classes.map(item => 
      item.id === classItem.id 
        ? { ...item, publish: newPublishState }
        : item
    );
    
    emit('update:classes', updatedClasses);
    success("Class status updated successfully");
  } catch (err) {
    console.error("Error updating class status:", err);
    error("Error updating class status");
  }
};

const dropdownOpen = ref<number | null>(null);

const toggleDropdown = (classId: number) => {
  dropdownOpen.value = dropdownOpen.value === classId ? null : classId;
};
</script>