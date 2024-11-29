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
      this.courses.push(courseData);
      this.currentForm = {} as CourseForm;
    },

    setCourses(courses: CourseForm[]) {
      this.courses = courses;
      console.log(this.courses)
    },

    updateCurrentForm(updates: Partial<CourseForm>) {
      this.currentForm = {
        ...this.currentForm,
        ...updates,
      };
    },
  },
});
