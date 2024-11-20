import type { FormDataModal } from '~/interfaces/modal.interface';
import { URL_API } from './api';

interface CourseData {
    img_cover: File | null;
    course_name: string;
    description: string;
    category: string;
    level: string;
    bullet_points: Array<{ text: string }>;}

class ApiService {
    async createCourse(formData: FormData) {
        const response = await $fetch(`${URL_API}/api/courses`, {
            method: 'POST',
            body: formData
        });
        return response;
    }

    // Obtener todos los cursos
    async getAllCourses() {
        const response = await $fetch(`${URL_API}/api/courses`, {
            method: 'GET'
        });
        return response;
    }

    // Obtener un curso por ID
    async getCourseById(id: number) {
        const response = await $fetch(`${URL_API}/api/courses/${id}`, {
            method: 'GET'
        });
        return response;
    }

    // Actualizar un curso
    async updateCourse(id: number, formData: Partial<CourseData>) {
        const formDataToSend = new FormData();
        if (formData.img_cover) formDataToSend.append('img_cover', formData.img_cover);
        if (formData.course_name) formDataToSend.append('course_name', formData.course_name);
        if (formData.description) formDataToSend.append('description', formData.description);
        if (formData.category) formDataToSend.append('category', formData.category);
        if (formData.level) formDataToSend.append('level', formData.level);
        if (formData.bullet_points) formDataToSend.append('bullet_points', JSON.stringify(formData.bullet_points));

        const response = await $fetch(`${URL_API}/api/courses/${id}`, {
            method: 'PUT',
            body: formDataToSend
        });
        return response;
    }

    // Eliminar un curso
    async deleteCourse(id: number) {
        const response = await $fetch(`${URL_API}/api/courses/${id}`, {
            method: 'DELETE'
        });
        return response;
    }
}   

export default new ApiService();
