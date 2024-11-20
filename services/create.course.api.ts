import type { FormDataModal } from '~/interfaces/modal.interface';
import { URL_API } from './api';
import type { CourseForm } from '~/interfaces/modal.interface';

export class ApiService {
    async createCourse(formData: FormData) {
        const response = await $fetch(`${URL_API}/courses/`, {
            method: 'POST',
            body: formData
        });
        console.log(response);
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
    async updateCourse(id: number, formData: Partial<CourseForm>) {
        const formDataToSend = new FormData();
        if (formData.cover) formDataToSend.append('img_cover', formData.cover);
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


