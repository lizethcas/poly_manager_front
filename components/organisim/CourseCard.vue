<template>
  <p v-if="coursesData?.length === 0" class="text-title-color">
    there are no courses yet
  </p>
  <div
    v-if="coursesData && coursesData.length > 0"
    v-for="course in coursesData.slice().reverse()"
    :key="course.id"
    class="w-full flex flex-col md:flex-row gap-2 bg-white border rounded-md cursor-pointer mt-4 md:hover:scale-105 transition-all duration-300 p-4"
  >
    <!-- Course Image -->
    <div class="rounded-md self-center md:self-auto">
      <img
        v-if="course.cover"
        :src="getCoverUrl(course.cover)"
        alt=""
        class="rounded-md object-cover h-20 w-20 md:h-24 md:w-24"
      />
    </div>

    <!-- Course Info -->
    <div class="flex flex-col md:mt-0 md:ml-4 flex-grow justify-between">
      <div class="flex items-center gap-2">
        <h2
          class="text-fuscous-gray-600 font-bold text-base md:text-lg w-contain"
        >
          {{ course.name }}
        </h2>
      </div>

      <div class="flex md:items-center md:gap-4 mt-1 flex-wrap">
        <IconButton
          v-show="course.publish"
          :icon="IconType.eye"
          :label="'published'"
          :customClass="'bg-emerald-100 text-emerald-700 rounded-full'"
          :color="'text-emerald-700'"
          @click.stop="publishCourse(course.id)"
        />
        <IconButton
          v-show="!course.publish"
          :icon="IconType.eyeOff"
          :label="'hidden'"
          :customClass="'bg-white text-fuscous-gray-600 rounded-full'"
          :color="'text-fuscous-gray-600'"
          @click.stop="publishCourse(course.id)"
        />

        <div
          class="flex items-center gap-1 md:gap-2 text-gray-600 text-xs flex-wrap"
        >
          <IconButton
            :icon="IconType.students"
            :label="`${
              studentClassesMap[course.id]?.students?.data?.total_students || 0
            } students`"
            :customClass="'bg-white text-fuscous-gray-600 rounded-full'"
            :color="'text-fuscous-gray-600'"
            @click="handleStudents(course.id)"
          />
          <IconButton
            :icon="IconType.collection"
            :label="`${classes} ${classes === 1 ? 'lesson' : 'lessons'}`"
            :customClass="'bg-white text-fuscous-gray-600 rounded-full'"
            :color="'text-fuscous-gray-600'"
          />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col justify-between text-center mt-2 md:mt-0">
      <div class="flex items-center gap-2">
        <span
          :class="[
            getLevelColor(course.level, true),
            'text-xs font-semibold px-2 py-1 rounded-full text-fuscous-gray-950',
          ]"
        >
          {{ course.level.split(".")[0] }}
        </span>
        <span
          :class="[
            getLevelColor(course.level, true),
            'text-xs font-semibold px-2 py-1 rounded-full text-fuscous-gray-950',
          ]"
        >
          {{ course.category }}
        </span>
      </div>
      <div class="text-xs flex flex-row justify-start gap-2 py-1 mt-5">
        <IconButton
          :icon="IconType.eye"
          :label="'preview'"
          :customClass="'bg-blue-500 text-white rounded-full'"
          :color="'text-white'"
          @click="navigateToCourse(course.id)"
        />

        <IconButton
          :icon="IconType.edit"
          :label="'edit'"
          :customClass="'bg-blue-500 text-white rounded-full'"
          :color="'text-white'"
          @click="openEditModal(course)"
        />
      </div>
    </div>
  </div>

  <!-- Modal students-->
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center"
    v-if="isStudentModalOpen"
  >
    <div class="w-full max-w-5xl mx-auto">
      <StudentList
        :students="students"
        @close="isStudentModalOpen = false"
      
      />
    </div>
  </div>

  <!-- Modal edit course-->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center"
  >
    <div class="w-full max-w-5xl mx-auto">
      <AddCourseModal
        :title="createCourse.title"
        @closeModal="closeModal"
        :showExtraElements="true"
        @handleSave="handleCourseAction"
        :initialData="selectedCourse"
        :actionType="'edit'"
        :deleteAction="true"
        @handleDelete="handleDelete"
      />
    </div>
  </div>
  <div
    v-if="confirmDelete"
    class="fixed flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full z-50 bg-gray-600 bg-opacity-90 h-screen"
  >
    <UAlert
      class="w-full max-w-xl mx-auto"
      :actions="[
        {
          variant: 'solid',
          color: 'red',
          label: 'Delete',
          click: () => confirmDeleteCourse(),
        },
        {
          variant: 'outline',
          color: 'gray',
          label: 'Cancel',
          click: () => (confirmDelete = false),
        },
      ]"
      title="Delete Course"
      description="Are you sure you want to delete this course? This action cannot be undone."
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { createCourse } from "~/data/cardModal";
import IconButton from "~/components/molecule/IconButton.vue";
import StudentList from "./templatesUsers/teachers/StudentList.vue";
import AddCourseModal from "./AddCourseModal.vue";
import IconMolecule from "~/components/atomos/Icon.vue";
import { useGetColor } from "~/composables/useGetColor";
import { useGetCover } from "~/composables/useGetcover";
import { useTaskStore } from "~/stores/task.store";
import { IconType } from "~/data/iconsType";
import { routes } from "~/data/routes";
import { useModal } from "~/composables/useModal";
import { useCourseMutation } from "~/composables/useCourseMutation";
import { useStudentClasses } from "~/composables/useStudentClasses";

interface Course {
  id: number;
  name: string;
  description: string;
  category: string;
  level: string;
  cover?: string;
  students?: number;
  publish?: boolean;
}

interface Props {
  coursesData?: Course[];
}
const props = defineProps<Props>();
const { isOpen, openModal, closeModal } = useModal();
const { getLevelColor } = useGetColor();
const { getCoverUrl } = useGetCover();
const taskStore = useTaskStore();
const classes = taskStore.getTask("classes");
const activeDropdown = ref<number | null>(null);
const selectedCourse = ref<Course | null>(null);
const confirmDelete = ref(false);
const isStudentModalOpen = ref(false);

const students = ref([]);
const currentCourseId = ref<number | null>(null);

const emit = defineEmits<{
  (e: "openModal"): void;
}>();

const { getTotalStudents } = useStudentClasses();
const { updateCourseMutation, deleteCourseMutation } = useCourseMutation();
const { coursesData } = props;
const studentClassesMap = ref<
  Record<number, { students: { data: { total_students: number } } }>
>({});

// Replace the watchEffect with proper setup-time queries
if (coursesData) {
  coursesData.forEach(async (course) => {
    const students = await getTotalStudents(course.id.toString());
    studentClassesMap.value[course.id] = { students };
  });
}


const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const handleStudents = async (courseId: number) => {
  currentCourseId.value = courseId;
  const courseStudents =
    studentClassesMap.value[courseId]?.students?.data?.students || [];
  // Formatear las fechas de los estudiantes
  students.value = courseStudents.map(student => ({
    ...student,
    created_at: formatDate(student.created_at),
  }));
  isStudentModalOpen.value = true;
};

/* onMounted(() => {
  document.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".relative")) {
      activeDropdown.value = null;
    }
  });
}); */

const navigateToCourse = (courseId: number) => {
  const course = props.coursesData?.find((c) => c.id === courseId);
  if (course) {
    navigateTo(routes.routesAdmin.classes(courseId.toString()));
  } else {
    console.error("Curso no encontrado");
  }
};

const handleCourseAction = async (formData: any) => {
  if (!selectedCourse.value?.id) return;

  const formDataToSend = new FormData();

  Object.entries(formData.formData).forEach(([key, value]) => {
    if (key === "cover") return;

    if (value !== undefined && value !== null && value !== "") {
      formDataToSend.append(key, value as string);
    }
  });

  if (formData.formData.cover instanceof File) {
    formDataToSend.append("cover", formData.formData.cover);
  }

  if (formData.bulletPoints?.length > 0) {
    formDataToSend.append(
      "bullet_points",
      JSON.stringify(formData.bulletPoints)
    );
  }

  formDataToSend.append("stats", formData.formData.stats);

  await updateCourseMutation.mutateAsync({
    id: selectedCourse.value.id,
    formData: formDataToSend,
  });

  closeModal();
};

const openEditModal = (course: Course) => {
  selectedCourse.value = {
    ...course,
    name: course.name,
    description: course.description,
    category: course.category,
    level: course.level,
    cover: course.cover,
  };

  openModal();
};

const handleDelete = async () => {
  if (!selectedCourse.value?.id) return;
  confirmDelete.value = true;
};

const confirmDeleteCourse = async () => {
  if (!selectedCourse.value?.id) return;
  try {
    await deleteCourseMutation.mutateAsync(selectedCourse.value.id);
    confirmDelete.value = false;

    closeModal();
  } catch (error) {
    console.error("Error deleting course:", error);
  }
};

const publishCourse = async (courseId: number) => {
  const course = props.coursesData?.find((c) => c.id === courseId);
  if (!course) return;

  const formData = new FormData();
  formData.append("publish", (!course.publish).toString());

  try {
    await updateCourseMutation.mutateAsync({
      id: courseId,
      formData: formData,
    });
  } catch (error) {
    console.error("Error updating publish status:", error);
  }
};
</script>

<style scoped>
.action-btn {
  @apply flex items-center justify-center px-4 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold transition duration-300;
}

.action-btn:hover {
  @apply bg-blue-600;
}

.category-span {
  @apply px-2 py-1 rounded-full text-xs font-semibold;
}
</style>
