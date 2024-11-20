import { URL_API } from './api';

interface LayoutData {
    lesson: number;
    title: string;
    instructions: string;
    img_cover: File | null;
    audio: File | null;
    audio_script: string;
}

interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
}

class ApiService {
    async createLayout(formData: FormData): Promise<ApiResponse<LayoutData>> {
        const response = await $fetch<ApiResponse<LayoutData>>(`${URL_API}/api/layouts`, {
            method: 'POST',
            body: formData
        });
        return response;
    }

    // Obtener todos los layouts
    async getAllLayouts() {
        const response = await $fetch(`${URL_API}/api/layouts`, {
            method: 'GET'
        });
        return response;
    }

    // Obtener un layout por ID
    async getLayoutById(id: number) {
        const response = await $fetch(`${URL_API}/api/layouts/${id}`, {
            method: 'GET'
        });
        return response;
    }

    // Actualizar un layout
    async updateLayout(id: number, formData: LayoutData) {
        const response = await $fetch(`${URL_API}/api/layouts/${id}`, {
            method: 'PUT',
            body: formData
        });
        return response;
    }

    // Eliminar un layout
    async deleteLayout(id: number) {
        const response = await $fetch(`${URL_API}/api/layouts/${id}`, {
            method: 'DELETE'
        });
        return response;
    }
}

export default new ApiService();
