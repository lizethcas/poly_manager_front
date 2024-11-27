import axiosInstance from "./axios.config";
import type { LayoutData } from '../interfaces/layout.interface';


interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
}

export class ApiLayoutService {
    async createLayout(formData: FormData): Promise<ApiResponse<LayoutData>> {
        const response = await axiosInstance.post(`layouts`, {
            body: formData
        });
        return response;
    }

    // Obtener todos los layouts
    async getAllLayouts() {
        const response = await axiosInstance.get(`layouts`);
        return response;
    }

    // Obtener un layout por ID
    async getLayoutById(id: number) {
        const response = await axiosInstance.get(`layouts/${id}`);
        return response;
    }

    // Actualizar un layout
    async updateLayout(id: number, formData: LayoutData) {
        const response = await axiosInstance.put(`layouts/${id}`, {
            body: formData
        });
        return response;
    }

    // Eliminar un layout
    async deleteLayout(id: number) {
        const response = await axiosInstance.delete(`layouts/${id}`);
        return response;
    }

    async createMultipleChoiceTask(taskData: any): Promise<ApiResponse<any>> {
        const response = await axiosInstance.post('multiple-choice/', taskData);
        return response;
    }

    async createTrueFalseTask(taskData: any): Promise<ApiResponse<any>> {
        const response = await axiosInstance.post('true-false/', taskData);
        return response;
    }

    async createOrderingTask(taskData: any): Promise<ApiResponse<any>> {
        const response = await axiosInstance.post('ordering/', taskData);
        return response;
    }

    async createCategoriesTask(taskData: any): Promise<ApiResponse<any>> {
        const response = await axiosInstance.post('categories/', taskData);
        return response;
    }

    async createFillGapsTask(taskData: any): Promise<ApiResponse<any>> {
        const response = await axiosInstance.post('fill-gaps/', taskData);
        return response;
    }
}


