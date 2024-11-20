import { URL_API } from './api';

interface OrderingTaskData {
    layout: number;
    instructions: string;
    items: Array<{text: string, order: number}>;
    order: number;
}

class ApiService {
    async createOrderingTask(formData: OrderingTaskData) {
        const response = await $fetch(`${URL_API}/api/orderingtask`, {
            method: 'POST',
            body: formData
        });
        return response;
    }

    // Obtener todas las tareas de ordenamiento
    async getAllOrderingTasks() {
        const response = await $fetch(`${URL_API}/api/orderingtask`, {
            method: 'GET'
        });
        return response;
    }

    // Obtener una tarea por ID 
    async getOrderingTaskById(id: number) {
        const response = await $fetch(`${URL_API}/api/orderingtask/${id}`, {
            method: 'GET'
        });
        return response;
    }

    // Actualizar una tarea
    async updateOrderingTask(id: number, formData: OrderingTaskData) {
        const response = await $fetch(`${URL_API}/api/orderingtask/${id}`, {
            method: 'PUT',
            body: formData
        });
        return response;
    }

    // Eliminar una tarea
    async deleteOrderingTask(id: number) {
        const response = await $fetch(`${URL_API}/api/orderingtask/${id}`, {
            method: 'DELETE'
        });
        return response;
    }
}

export default new ApiService();
