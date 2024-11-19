import { URL_API } from './api';

interface ClassData {
    img_cover: File | null;
    lesson_name: string;
    description: string;
    course_id: number;
    bullet_points: Array<{ text: string }>;
}
class ApiService {
    async createClass(formData: ClassData) {
        const response = await $fetch(`${URL_API}/api/classes`, {
            method: 'POST',
            body: {
                img_cover: formData.img_cover,
                lesson_name: formData.lesson_name,
                description: formData.description,
                course: formData.course_id,
                bullet_points: formData.bullet_points
            }
        });
        return response;
    }

    // Obtener todas las clases
    async getAllClasses() {
        const response = await $fetch(`${URL_API}/api/classes`, {
            method: 'GET'
        });
        return response;
    }

    // Obtener una clase por ID 
    async getClassById(id: number) {
        const response = await $fetch(`${URL_API}/api/classes/${id}`, {
            method: 'GET'
        });
        return response;
    }

    // Actualizar una clase
    async updateClass(id: number, formData: ClassData) {
        const response = await $fetch(`${URL_API}/api/classes/${id}`, {
            method: 'PUT',
            body: {
                img_cover: formData.img_cover,
                lesson_name: formData.lesson_name,
                description: formData.description,
                course: formData.course_id,
                bullet_points: formData.bullet_points
            }
        });
        return response;
    }

    // Eliminar una clase
    async deleteClass(id: number) {
        const response = await $fetch(`${URL_API}/api/classes/${id}`, {
            method: 'DELETE'
        });
        return response;
    }
}

export default new ApiService();
