import axiosInstance from "./axios.config";
import type { CategoriesTaskData } from '../interfaces/categoriestask.interfece';



export class ApiCategoriesTaskService {
    async createCategoriesTask(formData: CategoriesTaskData) {
        const response = await axiosInstance.post(`categoriestask`, {
            body: formData
        });
        return response;
    }

    // Obtener todas las tareas de categorías
    async getAllCategoriesTasks() {
        const response = axiosInstance.get(`categoriestask`);
        return response;
    }

    // Obtener una tarea por ID
    async getCategoriesTaskById(id: number) {
        const response = axiosInstance.get(`categoriestask/${id}`);
        return response;
    }

    // Actualizar una tarea
    async updateCategoriesTask(id: number, formData: CategoriesTaskData) {
        const response = axiosInstance.put(`categoriestask/${id}`, {
            body: formData
        });
        return response;
    }

    // Eliminar una tarea
    async deleteCategoriesTask(id: number) {
        const response = axiosInstance.delete(`categoriestask/${id}`);
        return response;
    }
}


