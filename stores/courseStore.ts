import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import type { CourseForm } from '~/interfaces/modal.interface';
import { toRaw } from 'vue';


export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [] as CourseForm[],
    currentForm: {
      course_name: '',
      description: '',
      cover: null,
      bullet_points: [],
      category: '',
      level: '',
      courseId: uuidv4(),
    } as CourseForm
  }),

  actions: {
    saveCourse(courseData: CourseForm) {
      this.courses.push({
        ...courseData,
        courseId: uuidv4()
      });
      console.log('Cursos:', toRaw(this.courses));
      console.log('Cursos:', JSON.parse(JSON.stringify(this.courses)));
    },

    updateCurrentForm(formData: Partial<CourseForm>) {
      this.currentForm = {
        ...this.currentForm,
        ...formData
      };
    },

   
  }
}); 