import { URL_API } from './api';

interface CategoriesTaskData {
    layout: number;
    instructions: string;
    categories: Array<{
        name: string,
        items: Array<string>
    }>;
    order: number;
}

class ApiService {
    async createCategoriesTask(formData: CategoriesTaskData) {
        const response = await $fetch(`${URL_API}/api/categoriestask`, {
            method: 'POST',
            body: formData
        });
        return response;
    }

    // Obtener todas las tareas de categorías
    async getAllCategoriesTasks() {
        const response = await $fetch(`${URL_API}/api/categoriestask`, {
            method: 'GET'
        });
        return response;
    }

    // Obtener una tarea por ID
    async getCategoriesTaskById(id: number) {
        const response = await $fetch(`${URL_API}/api/categoriestask/${id}`, {
            method: 'GET'
        });
        return response;
    }

    // Actualizar una tarea
    async updateCategoriesTask(id: number, formData: CategoriesTaskData) {
        const response = await $fetch(`${URL_API}/api/categoriestask/${id}`, {
            method: 'PUT',
            body: formData
        });
        return response;
    }

    // Eliminar una tarea
    async deleteCategoriesTask(id: number) {
        const response = await $fetch(`${URL_API}/api/categoriestask/${id}`, {
            method: 'DELETE'
        });
        return response;
    }
}

export default new ApiService();
