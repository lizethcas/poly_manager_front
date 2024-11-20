import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import type { CourseForm } from "~/interfaces/modal.interface";
import { toRaw } from "vue";
import { ApiService } from "~/services/create.course.api";

export const useCourseStore = defineStore("course", {
  state: () => ({
    courses: [] as CourseForm[],
    currentForm: {} as CourseForm,
    loading: false,
  }),

  actions: {
    saveCourse(courseData: CourseForm) {
      this.courses.push({
        ...courseData,
        id: uuidv4(),
      });
      console.log("Cursos:", toRaw(this.courses));
      console.log("Cursos:", JSON.parse(JSON.stringify(this.courses)));
    },

    updateCurrentForm(formData: Partial<CourseForm>) {
      this.currentForm = {
        ...this.currentForm,
        ...formData,
      };
    },

    async createCourse(courseData: CourseForm) {
      this.loading = true;
      try {
        const formData = new FormData();
        Object.entries(this.currentForm).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item, index) => formData.append(`${key}[${index}]`, item));
          } else {
            formData.append(key, value?.toString() ?? '');
          }
        });
        
        const apiService = new ApiService();
        await apiService.createCourse(formData);
      } catch (error) {
        console.error('Error creating course:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
