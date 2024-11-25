import axiosInstance from "./axios.config";
import type { TrueOrFalseData } from "../interfaces/models/trueorfalsetask.interface";



export class ApiTrueOrFalseService {
    async createTrueOrFalse(formData: TrueOrFalseData) {
        const response = await axiosInstance.post(`trueorfalse`, {
            body: formData
        });
        return response;
    }

    // Obtener todas las preguntas de verdadero/falso
    async getAllTrueOrFalse() {
        const response = await axiosInstance.get(`trueorfalse`);
        return response;
    }

    // Obtener una pregunta por ID
    async getTrueOrFalseById(id: number) {
        const response = await axiosInstance.get(`trueorfalse/${id}`);
        return response;
    }

    // Actualizar una pregunta
    async updateTrueOrFalse(id: number, formData: TrueOrFalseData) {
        const response = await axiosInstance.put(`trueorfalse/${id}`, {
            body: formData
        });
        return response;
    }

    // Eliminar una pregunta
    async deleteTrueOrFalse(id: number) {
        const response = await axiosInstance.delete(`trueorfalse/${id}`);
        return response;
    }
}

