import { defineStore } from 'pinia'
import ApiService from '../services/create.class.api'

interface ClassData {
    id?: number;
    lesson_name: string;
    description: string;
    course_id: number;
    img_cover: File | null;
    bullet_points: Array<{ text: string }>;
}

export const useClassStore = defineStore('class', {
    state: () => ({
        classes: [] as ClassData[],
        loading: false,
    }),
    actions: {
        async createClass(classData: ClassData) {
            this.loading = true
            try {
                const response = await ApiService.createClass({
                    lesson_name: classData.lesson_name,
                    description: classData.description,
                    course_id: classData.course_id,
                    img_cover: classData.img_cover,
                    bullet_points: classData.bullet_points
                }) as ClassData
                this.classes.push(response)
                return response
            } catch (error) {
                console.error('Error al crear la clase:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async getAllClasses() {
            this.loading = true
            try {
                const response = await ApiService.getAllClasses() as ClassData[]
                this.classes = response
                return response
            } catch (error) {
                console.error('Error al obtener las clases:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async getClassById(id: number) {
            this.loading = true
            try {
                const response = await ApiService.getClassById(id) as ClassData
                return response
            } catch (error) {
                console.error('Error al obtener la clase:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateClass(id: number, classData: ClassData) {
            this.loading = true
            try {
                const response = await ApiService.updateClass(id, classData) as ClassData
                const index = this.classes.findIndex(c => c.id === id)
                if (index !== -1) {
                    this.classes[index] = { ...response, id }
                }
                return response
            } catch (error) {
                console.error('Error al actualizar la clase:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async deleteClass(id: number) {
            this.loading = true
            try {
                await ApiService.deleteClass(id)
                this.classes = this.classes.filter(c => c.id !== id)
            } catch (error) {
                console.error('Error al eliminar la clase:', error)
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})
