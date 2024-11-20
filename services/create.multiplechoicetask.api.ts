import { URL_API } from './api';

interface MultipleChoiceData {
    layout: number;
    instructions: string;
    question: string;
    answers: Array<{text: string, is_correct: boolean}>;
    order: number;
}

class ApiService {
    async createMultipleChoice(formData: MultipleChoiceData) {
        const response = await $fetch(`${URL_API}/api/multiplechoice`, {
            method: 'POST',
            body: formData
        });
        return response;
    }

    // Obtener todas las preguntas de opción múltiple
    async getAllMultipleChoice() {
        const response = await $fetch(`${URL_API}/api/multiplechoice`, {
            method: 'GET'
        });
        return response;
    }

    // Obtener una pregunta por ID
    async getMultipleChoiceById(id: number) {
        const response = await $fetch(`${URL_API}/api/multiplechoice/${id}`, {
            method: 'GET'
        });
        return response;
    }

    // Actualizar una pregunta
    async updateMultipleChoice(id: number, formData: MultipleChoiceData) {
        const response = await $fetch(`${URL_API}/api/multiplechoice/${id}`, {
            method: 'PUT',
            body: formData
        });
        return response;
    }

    // Eliminar una pregunta
    async deleteMultipleChoice(id: number) {
        const response = await $fetch(`${URL_API}/api/multiplechoice/${id}`, {
            method: 'DELETE'
        });
        return response;
    }
}

export default new ApiService();
