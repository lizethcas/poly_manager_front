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
      <button class="h-full px-4 cursor-grab flex items-center">
        <Icon
          name="material-symbols:drag-indicator"
          size="24"
          class="text-gray-400"
        />
      </button>

      <!-- Main Content -->
      <div class="flex-1">
        <div class="flex items-start gap-4 bg-[#f5f5f5] rounded-md">
          <!-- Image -->
          <div class="w-20 h-20 flex-shrink-0">
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
            <template class="flex flex-col justify-between h-full">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-medium text-gray-900 text-xs sm:text-base">
                  Lesson {{ index }}. {{ classItem.class_name }}
                </h3>

                <div
                  class="text-sm px-2 py-1 bg-gray-100 rounded-full flex items-center gap-2"
                >
                  <Icon name="bi:collection-fill" size="14" />
                  {{ index + 1 }}/{{ props.classes.length }}
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-2">
                <button
                  class="action-btn"
                  @click="handlePreviewClick(classItem.id, Number(routeCourseId))"
                >
                  <Icon name="material-symbols:edit-outline" size="14" />
                  <span class="text-xs">edit</span>
                </button>
                <button class="action-btn" @click="openModalHandler">
                  <Icon name="material-symbols:visibility-outline" size="14" />
                  <span class="text-xs">preview</span>
                </button>
                <button class="action-btn">
                  <Icon name="lucide:eye-off" size="14" />
                  <span class="text-xs">hide</span>
                </button>
                <button
                  class="action-btn text-red-500"
                  @click="handleDelete(classItem.id)"
                >
                  <Icon name="material-symbols:delete-outline" size="14" />
                  <span class="text-xs">delete</span>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useGetCover } from "~/composables/useGetcover";
import { useTaskStore } from "~/stores/task.store";
import type { ClassData } from "~/interfaces/models/class.interface..model";
import { useClassesQuery } from "~/composables/useClassesQuery";
import { useToast } from "~/composables/useToast";

const route = useRoute();
const taskStore = useTaskStore();
const courseId = route.params.courseId as string;
// Define props
const props = defineProps<{
  classes: ClassData[];
}>();

// Move useToast to the top level
const { success, error: showError } = useToast();

// Add computed property for filtered classes
const filteredClasses = computed(() => {
  taskStore.addTask("classes", props.classes.length);

  return props.classes.filter((classItem) => classItem.course_id == courseId);
});

const classesRef = ref(props.classes);

const { getCoverUrl } = useGetCover();
const routeCourseId = useRoute().params.courseId as string;
const { onDragOver, onDrop, onDragStart } = useDragAnDrop(classesRef);

const { deleteClass, isDeletingClass } = useClassesQuery(courseId);

const openModalHandler = () => {
  console.log("open modal");
};

const handlePreviewClick = (
  classId: number | undefined,
  courseId: number | undefined
) => {
  if (classId && courseId) {
    navigateTo(`/course/${courseId}/class/${classId}`);
  } else {
    console.error("Class ID or Course ID is undefined");
  }
};

const handleDelete = async (classId: number) => {
  if (confirm("Are you sure you want to delete this class?")) {
    try {
      await deleteClass(classId);
      success("Class deleted successfully");
     
    } catch (error) {
      console.error("Error deleting class:", error);
      
      showError("Error deleting class");
    }
  }
};
</script>

<style scoped>
.action-btn {
  @apply flex items-center flex-wrap hover:bg-gray-100 rounded-lg transition-colors;
}
</style>
