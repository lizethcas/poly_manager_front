import { defineStore } from "pinia";
import type { CourseForm } from "~/interfaces/modal.interface";

export const useCourseStore = defineStore("course", {
  state: () => ({
    courses: [] as CourseForm[],
    currentForm: {} as CourseForm,
    loading: false,
  }),
  persist: {
    paths: ['currentForm'], // Solo persiste el estado de `currentForm`
  },
  actions: {
    saveCourse(courseData: CourseForm) {
      console.log('Saving course:', courseData);
      this.courses.push(courseData);
      this.currentForm = {} as CourseForm;
    },

    setCourses(courses: CourseForm[]) {
      console.log('Setting courses:', courses);
      this.courses = courses;
    },

    updateCurrentForm(updates: Partial<CourseForm>) {
      this.currentForm = {
        ...this.currentForm,
        ...updates
      };
    },

  
  },

});
