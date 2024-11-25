import axiosInstance from "./axios.config";
import type { FillInTheGapsData } from '../interfaces/models/fillinthegaps.interface';


export class ApiFillInTheGapsService {
    async createFillInTheGaps(formData: FillInTheGapsData) {
        const response = await axiosInstance.post(`fillinthegaps`, {
            body: formData
        });
        return response;
    }

    // Obtener todas las tareas de rellenar huecos
    async getAllFillInTheGaps() {
        const response = await axiosInstance.get(`fillinthegaps`);
        return response;
    }

    // Obtener una tarea por ID
    async getFillInTheGapsById(id: number) {
        const response = await axiosInstance.get(`fillinthegaps/${id}`);
        return response;
    }

    // Actualizar una tarea
    async updateFillInTheGaps(id: number, formData: FillInTheGapsData) {
        const response = await axiosInstance.put(`fillinthegaps/${id}`, {
            body: formData
        });
        return response;
    }

    // Eliminar una tarea
    async deleteFillInTheGaps(id: number) {
        const response = await axiosInstance.delete(`fillinthegaps/${id}`);
        return response;
    }
}

