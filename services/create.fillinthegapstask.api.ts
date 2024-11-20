import { URL_API } from './api';

interface FillInTheGapsData {
    layout: number;
    instructions: string;
    text: string;
    gaps: Array<{
        word: string,
        position: number
    }>;
    order: number;
}

class ApiService {
    async createFillInTheGaps(formData: FillInTheGapsData) {
        const response = await $fetch(`${URL_API}/api/fillinthegaps`, {
            method: 'POST',
            body: formData
        });
        return response;
    }

    // Obtener todas las tareas de rellenar huecos
    async getAllFillInTheGaps() {
        const response = await $fetch(`${URL_API}/api/fillinthegaps`, {
            method: 'GET'
        });
        return response;
    }

    // Obtener una tarea por ID
    async getFillInTheGapsById(id: number) {
        const response = await $fetch(`${URL_API}/api/fillinthegaps/${id}`, {
            method: 'GET'
        });
        return response;
    }

    // Actualizar una tarea
    async updateFillInTheGaps(id: number, formData: FillInTheGapsData) {
        const response = await $fetch(`${URL_API}/api/fillinthegaps/${id}`, {
            method: 'PUT',
            body: formData
        });
        return response;
    }

    // Eliminar una tarea
    async deleteFillInTheGaps(id: number) {
        const response = await $fetch(`${URL_API}/api/fillinthegaps/${id}`, {
            method: 'DELETE'
        });
        return response;
    }
}

export default new ApiService();
