import { defineStore } from 'pinia'
import ApiService from '../services/create.course.api'

interface CourseData {
    id?: number;
    img_cover: File | null;
    course_name: string;
    description: string;
    category: string;
    level: string;
    bullet_points: Array<{ text: string }>;
}

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [] as CourseData[],
    loading: false,
    error: null as string | null,
    currentCourse: null as CourseData | null,
  }),
  actions: {
    async createCourse(courseData: CourseData) {
      this.loading = true
      this.error = null
      
      try {
        const formData = new FormData()
        formData.append('img_cover', courseData.img_cover as File)
        formData.append('course_name', courseData.course_name)
        formData.append('description', courseData.description)
        formData.append('category', courseData.category)
        formData.append('level', courseData.level)
        formData.append('bullet_points', JSON.stringify(courseData.bullet_points))
        
        const response = await ApiService.createCourse(formData) as CourseData
        this.courses.push(response)
        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido al crear el curso'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCourses() {
      this.loading = true
      this.error = null
      
      try {
        const response = await ApiService.getAllCourses() as CourseData[]
        this.courses = response
        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al obtener los cursos'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCourse(courseId: number, courseData: Partial<CourseData>) {
      this.loading = true
      this.error = null
      
      try {
        const response = await ApiService.updateCourse(courseId, courseData)
        const index = this.courses.findIndex(course => course.id === courseId)
        if (index !== -1) {
          this.courses[index] = response as CourseData
        }
        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al actualizar el curso'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCourse(courseId: number) {
      this.loading = true
      this.error = null
      
      try {
        await ApiService.deleteCourse(courseId)
        this.courses = this.courses.filter(course => course.id !== courseId)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al eliminar el curso'
        throw error
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    getCourseById: (state) => {
      return (courseId: number) => state.courses.find(course => course.id === courseId)
    },
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    getError: (state) => state.error
  }
}) 