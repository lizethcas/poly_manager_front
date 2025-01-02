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
  >
    <!-- Dots Menu -->
    <button class="absolute left-4 top-1/2 -translate-y-1/2 cursor-grab">
      <Icon
        name="material-symbols:drag-indicator"
        size="24"
        class="text-gray-400"
      />
    </button>

    <!-- Main Content with Left Padding for Dots -->
    <div class="pl-8">
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
              <button class="action-btn text-red-500">
                <Icon name="material-symbols:delete-outline" size="14" />
                <span class="text-xs">delete</span>
              </button>
            </div>
          </template>
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

const route = useRoute();
const taskStore = useTaskStore();
const courseId = route.params.courseId as string;
// Define props
const props = defineProps<{
  classes: ClassData[];
}>();

// Add computed property for filtered classes
const filteredClasses = computed(() => {
  taskStore.addTask("classes", props.classes.length);

  return props.classes.filter((classItem) => classItem.course_id == courseId);
});

const classesRef = ref(props.classes);

const { getCoverUrl } = useGetCover();
const routeCourseId = useRoute().params.courseId as string;
const { onDragOver, onDrop, onDragStart } = useDragAnDrop(classesRef);

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
</script>

<style scoped>
.action-btn {
  @apply flex items-center flex-wrap hover:bg-gray-100 rounded-lg transition-colors;
}
</style>
