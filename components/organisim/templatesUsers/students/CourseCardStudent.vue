<template>
  <p v-if="!courses" class="text-title-color">no hay cursos</p>
  <div
    v-if="courses"
    v-for="(course, index) in filteredCourses"
    :key="course.id"
    class="w-full flex bg-white border rounded-xl cursor-pointer mt-2 hover:scale-105 transition-all duration-300 p-2"
  >
    <!-- Move "My Current Course" to the top -->
    <div class="flex flex-col w-full p-1" v-show="course.publish">
      <div class="flex justify-between" v-show="route.path.includes('/course')">
        <!--      <h2 class="text-fuscous-gray-600 font-bold text-lg mb-2 w-contain">
          My Current Course:
        </h2> -->
        <div class="flex items-center gap-2 text-sm">
          <p class="text-fuscous-gray-600">Unhide finished classes</p>
          <AtomosToggle />
        </div>
      </div>
      <div class="flex">
        <!-- Course Image -->
        <div class="rounded-xl">
        
          <img
            v-if="course.cover"
            :src="getCoverUrl(course.cover)"
            alt="Course cover"
            class="rounded-xl object-cover w-20 h-20"
            @error="handleImageError"
          />
          <div v-else class="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center">
            <span class="text-gray-400">No image</span>
          </div>
        </div>

        <!-- Course Info -->
        <div class="flex flex-col ml-4 flex-grow justify-between">
          <div class="items-center gap-2">
            <h3 class="text-fuscous-gray-600 font-bold text-base md:text-lg">
              {{ course.name }}
            </h3>
          </div>
          <div class="mb-2">
            <p class="text-gray-600 text-sm">
              {{ getDisplayedDescription(course.description, course.id.toString()) }}
              <button
                v-if="
                  course.description &&
                  course.description.length > MAX_DESCRIPTION_LENGTH
                "
                @click="toggleDescription(course.id.toString())"
                class="text-blue-500 hover:text-blue-700 ml-1"
              >
                {{
                  truncatedDescriptions[course.id] ? "Show less" : "Show more"
                }}
              </button>
            </p>
          </div>
          <button v-if="route.path.includes('/courses')"
            @click="showCourseDescription(course, index)"
            class="text-blue-500 hover:text-blue-700 text-left text-sm"
          >
            View course details
          </button>
          <nuxt-link v-else :to="`/student-${route.params.id}/classes`" >
            <button class="text-blue-500 hover:text-blue-700 text-left text-sm">
              View course details
            </button>



          </nuxt-link>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col justify-between"
          v-show="!route.path.includes('/course-students')"
        >
          <div class="flex items-center gap-2">
            <span
              :class="[
                getLevelColor(course.level, true),
                'text-xs font-semibold px-2 py-1 rounded-full text-fuscous-gray-950',
              ]"
            >
              {{ course.level.split(".")[0] }}
            </span>
            <!-- Course Type -->
            <span
              :class="[
                getLevelColor(course.level, true),
                'text-xs font-semibold px-2 py-1 rounded-full text-fuscous-gray-950',
              ]"
              >{{ course.category }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <ClassDescription
    v-if="isDescriptionVisible "
    :course="selectedCourse"
    :is-open="isDescriptionVisible"
    @close="isDescriptionVisible = false"
    :name="selectedCourse.name"
    :description="selectedCourse.description"
    :bullet-points="selectedCourse.bullet_points"
    :cover="selectedCourse.cover"
    :course-id="selectedCourse.id"
    :id="selectedCourse.id"
    text-button="Enroll"
    @handleClick="handleClick"
  />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import type { Course } from "~/interfaces/course.interface";
import { useGetCover } from "~/composables/useGetcover";
import { useGetColor } from "~/composables/useGetColor";
import { computed } from "vue";
import ClassDescription from "~/components/organisim/templatesUsers/students/ClassDescription.vue"; // Adjust the path according to your project structure
import { useEnrollMutation } from "~/composables/useEnrollMutation";
import { useToast } from "vue-toastification";

const route = useRoute();

const { getCoverUrl } = useGetCover();
const { getLevelColor } = useGetColor();
const selectedCourse = ref({});
const isDescriptionVisible = ref(false);
const toast = useToast();

const props = defineProps<{
  courses: Course[];
}>();

const filteredCourses = computed(() => {
  return props.courses.filter((course) => course.publish === true);
});

console.log(filteredCourses.value);

const MAX_DESCRIPTION_LENGTH = 100;

const truncatedDescriptions = ref<{ [key: string]: boolean }>({});
const getDisplayedDescription = (description: string, classId: string) => {
  if (!description) return "";
  if (
    description.length <= MAX_DESCRIPTION_LENGTH ||
    truncatedDescriptions.value[classId]
  ) {
    return description;
  }
  return description.slice(0, MAX_DESCRIPTION_LENGTH) + "...";
};

const toggleDescription = (classId: string) => {
  truncatedDescriptions.value[classId] = !truncatedDescriptions.value[classId];
};

const showCourseDescription = (course: Course, index: number) => {

  selectedCourse.value = {
    ...course,
    unit: index,
  };
  isDescriptionVisible.value = true;
};

const enrollMutation = useEnrollMutation();

const handleClick = async (courseId: number) => {
  if (!courseId) {
    toast.error("Invalid course ID");
    return;
  }
  try {
    await enrollMutation.mutateAsync(courseId.toString());
    isDescriptionVisible.value = false; // Close modal after successful enrollment
  } catch (error) {
    // Error handling is managed by the mutation
    console.error("Enrollment failed:", error);
  }
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  console.error('Image failed to load:', target.src);
  // Optionally set a fallback image
  // target.src = '/path/to/fallback-image.png';
};
</script>
