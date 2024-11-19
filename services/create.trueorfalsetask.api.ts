import { URL_API } from './api';

interface TrueOrFalseData {
    layout: number;
    instructions: string;
    questions: {
        questions: Array<{
            statement: string;
            state: 1 | 2 | 3;
        }>;
    };
    order: number;
}

class ApiService {
    async createTrueOrFalse(formData: TrueOrFalseData) {
        const response = await $fetch(`${URL_API}/api/trueorfalse`, {
            method: 'POST',
            body: formData
        });
        return response;
    }

    // Obtener todas las preguntas de verdadero/falso
    async getAllTrueOrFalse() {
        const response = await $fetch(`${URL_API}/api/trueorfalse`, {
            method: 'GET'
        });
        return response;
    }

    // Obtener una pregunta por ID
    async getTrueOrFalseById(id: number) {
        const response = await $fetch(`${URL_API}/api/trueorfalse/${id}`, {
            method: 'GET'
        });
        return response;
    }

    // Actualizar una pregunta
    async updateTrueOrFalse(id: number, formData: TrueOrFalseData) {
        const response = await $fetch(`${URL_API}/api/trueorfalse/${id}`, {
            method: 'PUT',
            body: formData
        });
        return response;
    }

    // Eliminar una pregunta
    async deleteTrueOrFalse(id: number) {
        const response = await $fetch(`${URL_API}/api/trueorfalse/${id}`, {
            method: 'DELETE'
        });
        return response;
    }
}

export default new ApiService();
