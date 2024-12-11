import { defineStore } from "pinia";
import type { CourseForm } from "~/interfaces/modal.interface";
import { ApiService } from "~/services/create.course.api";

export const useCourseStore = defineStore("course", {
  state: () => ({
    courses: [] as CourseForm[],
    currentForm: {} as CourseForm,
    loading: false,
  }),
  persist: true,
  actions: {
    saveCourse(courseData: CourseForm) {
      this.currentForm = {} as CourseForm;
    },

    async setCourses() {
     
      try {
        const apiService = new ApiService();
        const fetchedCourses = await apiService.getAllCourses();
        if (Array.isArray(fetchedCourses)) {
          this.courses = fetchedCourses;
          console.log(this.courses.slice().reverse());
        } else {
          console.warn("Received invalid courses data");
          this.courses = [];
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        this.courses = [];
      }
    },

    updateCurrentForm(updates: Partial<CourseForm>) {
      this.currentForm = {
        ...this.currentForm,
        ...updates,
      };
    },
  },
});
