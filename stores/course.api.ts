import { defineStore } from 'pinia'

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [],
    loading: false,
  }),
  actions: {
    async createCourse() {
      this.loading = true
      try {
        // Aquí iría tu lógica para obtener los cursos
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        this.loading = false
      }
    }
  }
}) 