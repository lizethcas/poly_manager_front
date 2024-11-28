import axiosInstance from './axios.config';
import type { CourseForm } from '~/interfaces/modal.interface';

export class ApiService {
    async createCourse(formData: FormData) {
        console.log(formData)
        try {
            const response = await axiosInstance.post('courses/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in createCourse:', error);
            throw error;
        }
    }

    // Obtener todos los cursos
    async getAllCourses() {
        try {
            const response = await axiosInstance.get('courses/');
            return response.data;
        } catch (error) {
            console.error('Error in getAllCourses:', error);
            throw error;
        }
    }

    // Obtener un curso por ID
    async getCourseById(id: number) {
        try {
            const response = await axiosInstance.get(`courses/${id}/classes`);
            return response.data;
        } catch (error) {
            console.error('Error in getCourseById:', error);
            throw error;
        }
    }

    // Actualizar un curso
    async updateCourse(id: number, formData: Partial<CourseForm>) {
        const formDataToSend = new FormData();
        if (formData.cover) formDataToSend.append('img_cover', formData.cover);
        if (formData.course_name) formDataToSend.append('course_name', formData.course_name);
        if (formData.description) formDataToSend.append('description', formData.description);
        if (formData.category) formDataToSend.append('category', formData.category);
        if (formData.level) formDataToSend.append('level', formData.level);
        if (formData.bullet_points) formDataToSend.append('bullet_points', JSON.stringify(formData.bullet_points));

        try {
            const response = await axiosInstance.put(`/api/courses/${id}`, formDataToSend);
            return response.data;
        } catch (error) {
            console.error('Error in updateCourse:', error);
            throw error;
        }
    }

    // Eliminar un curso
    async deleteCourse(id: number) {
        try {
            const response = await axiosInstance.delete(`/api/courses/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error in deleteCourse:', error);
            throw error;
        }
    }
}   


