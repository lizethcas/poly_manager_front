import axiosInstance from "./axios.config";
import type { OrderingTaskData } from "../interfaces/orderingtask.interface";

class ApiOrderingTaskService {
    async createOrderingTask(formData: OrderingTaskData) {
        const response = await axiosInstance.post(`orderingtask`, {
            body: formData
        });
        return response;
    }

    // Obtener todas las tareas de ordenamiento
    async getAllOrderingTasks() {
        const response = await axiosInstance.get(`orderingtask`);
        return response;
    }

    // Obtener una tarea por ID 
    async getOrderingTaskById(id: number) {
        const response = await axiosInstance.get(`orderingtask/${id}`);
        return response;
    }

    // Actualizar una tarea
    async updateOrderingTask(id: number, formData: OrderingTaskData) {
        const response = await axiosInstance.put(`orderingtask/${id}`, {
            body: formData
        });
        return response;
    }

    // Eliminar una tarea
    async deleteOrderingTask(id: number) {
        const response = await axiosInstance.delete(`orderingtask/${id}`);
        return response;
    }
}

export default new ApiOrderingTaskService();
