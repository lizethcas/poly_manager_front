import { URL_API } from './api';

interface TextBlockData {
    lesson: number;
    title: string;
    instructions: string;
    content: string;
}

class ApiService {
    async createTextBlock(formData: TextBlockData) {
        const response = await $fetch(`${URL_API}/api/textblocks`, {
            method: 'POST',
            body: formData
        });
        return response;
    }

    // Obtener todos los bloques de texto
    async getAllTextBlocks() {
        const response = await $fetch(`${URL_API}/api/textblocks`, {
            method: 'GET'
        });
        return response;
    }

    // Obtener un bloque de texto por ID
    async getTextBlockById(id: number) {
        const response = await $fetch(`${URL_API}/api/textblocks/${id}`, {
            method: 'GET'
        });
        return response;
    }

    // Actualizar un bloque de texto
    async updateTextBlock(id: number, formData: TextBlockData) {
        const response = await $fetch(`${URL_API}/api/textblocks/${id}`, {
            method: 'PUT',
            body: formData
        });
        return response;
    }

    // Eliminar un bloque de texto
    async deleteTextBlock(id: number) {
        const response = await $fetch(`${URL_API}/api/textblocks/${id}`, {
            method: 'DELETE'
        });
        return response;
    }
}

export default new ApiService();
