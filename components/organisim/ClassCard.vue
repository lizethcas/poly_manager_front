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
                  <Icon :name="IconType.collection" size="14" />
                  {{ index }}/{{ props.classes.length }}
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-2 relative">
                <!-- Always visible buttons -->
                <IconButton
                  :icon="IconType.edit"
                  :label="'edit'"
                  :customClass="'bg-blue-500 text-white'"
                  :color="'text-white'"
                  :handleClick="
                    () =>
                      navigateTo(
                        routes.routesAdmin.class(
                          routeCourseId,
                          classItem.id.toString()
                        )
                      )
                  "
                />

                <IconButton
                  :icon="IconType.settings"
                  :label="'Settings'"
                  :customClass="'bg-blue-500 text-white rounded-full'"
                  :color="'text-white'"
                  :handleClick="() => openEditClass(classItem)"
                />

                <!-- Dropdown for additional buttons -->
                <div class="relative">
                  <IconButton
                    :icon="IconType.menuMore"
                    :customClass="'bg-gray-200 text-fuscous-gray-600 text-center items-end  rounded-full px-2 py-1'"
                    :handleClick="() => toggleDropdown(classItem.id)"
                  />
                  <div
                    v-if="dropdownOpen === classItem.id"
                    class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                  >
                    <IconButton
                      :icon="IconType.eye"
                      :label="'preview'"
                      :customClass="'bg-none rounded-full text-fuscous-gray-600'"
                      :color="'text-fuscous-gray-600 '"
                      :handleClick="() => openModalHandler(classItem.id)"
                    />

                    <div
                      class="flex items-center gap-4 py-2 cursor-pointer border-gray-200"
                      @click.stop="(event) => togglePublish(classItem, event)"
                    >
                      <IconButton
                        v-show="classItem.publish"
                        :icon="IconType.eye"
                        :label="'published'"
                        :customClass="'bg-emerald-100 text-emerald-700 rounded-full'"
                        :color="'text-emerald-700 '"
                      />

                      <IconButton
                        v-show="!classItem.publish"
                        :icon="IconType.eyeOff"
                        :label="'hidden'"
                        :customClass="'bg-white text-fuscous-gray-600 rounded-full'"
                        :color="'text-fuscous-gray-600'"
                      />
                    </div>
                    <IconButton
                      :icon="IconType.trash"
                      :label="'delete'"
                      :customClass="'bg-none rounded-full text-fuscous-gray-600'"
                      :color="'text-fuscous-gray-600'"
                      :handleClick="() => handleDelete(classItem.id)"
                    />
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
import { useCustomModal } from "~/composables/useModal";
import { useRoute } from "nuxt/app";
import { useClassMutation } from "~/composables/useClassMutation";
import IconButton from "~/components/molecule/IconButton.vue";

const { isOpen, openModal, closeModal } = useCustomModal();
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
  navigateTo(routes.routesStudent.class(routeCourseId, classId.toString()));
};

const handleDelete = async (classId: number | undefined) => {
  if (!classId) return;

  if (confirm("Are you sure you want to delete this class?")) {
    try {
      await deleteClass(classId);
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
  console.log(formData);
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
    if (typeof selectedClass.value.id !== "number") return;

    await updateClassMutation.mutateAsync({
      id: selectedClass.value.id,
      formData: formDataToSend,
    });

    closeModal();
  } catch (err) {
    console.error("Error updating class:", err);
    error("Error updating class");
  }
};

// Add emit definition in script setup
const emit = defineEmits(["update:classes"]);

// Update the togglePublish function

const togglePublish = async (classItem: ClassData, event: Event) => {
  event.stopPropagation();
  const item = props.classes?.find((c) => c.id === classItem.id);
  if (!item) return;

  const formData = new FormData();
  const newPublishStatus = !item.publish;
  formData.append("publish", newPublishStatus.toString());

  try {
    await updateClassMutation.mutateAsync({
      id: classItem.id as number,
      formData: formData,
    });

    // Close dropdown after successful update
    dropdownOpen.value = null;
  } catch (error) {
    console.error("Error updating publish status:", error);
  }
};

const dropdownOpen = ref<number | null>(null);

const toggleDropdown = (classId: number) => {
  dropdownOpen.value = dropdownOpen.value === classId ? null : classId;
};
</script>
