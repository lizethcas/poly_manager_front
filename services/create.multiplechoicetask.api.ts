import axiosInstance from "./axios.config";
import type { MultipleChoiceData } from "../interfaces/multiplechoice.interface";




export class ApiMultipleChoiceService {
    async createMultipleChoice(formData: MultipleChoiceData) {
        const response = await axiosInstance.post(`multiplechoice`, {
            body: formData
        });
        return response;
    }

    // Obtener todas las preguntas de opción múltiple
    async getAllMultipleChoice() {
        const response = await axiosInstance.get(`multiplechoice`);
        return response;
    }

    // Obtener una pregunta por ID
    async getMultipleChoiceById(id: number) {
        const response = await axiosInstance.get(`multiplechoice/${id}`);
        return response;
    }

    // Actualizar una pregunta
    async updateMultipleChoice(id: number, formData: MultipleChoiceData) {
        const response = await axiosInstance.put(`multiplechoice/${id}`, {
            body: formData
        });
        return response;
    }

    // Eliminar una pregunta
    async deleteMultipleChoice(id: number) {
        const response = await axiosInstance.delete(`multiplechoice/${id}`);
        return response;
    }
}

