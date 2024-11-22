import { defineStore } from "pinia";
import type { CourseForm } from "~/interfaces/modal.interface";

export const useCourseStore = defineStore("course", {
  state: () => ({
    courses: [] as CourseForm[],
    currentForm: {} as CourseForm,
    loading: false,
  }),
  persist: true,
  actions: {
    saveCourse(courseData: CourseForm) {
      this.currentForm = {
        ...courseData,
      };
      
    },

    setCourses(courses: CourseForm[]) {
      this.courses = courses;
    },

    updateCurrentForm(course: CourseForm) {
      this.currentForm = course;
    },
  },
});
