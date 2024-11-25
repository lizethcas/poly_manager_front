import axiosInstance from "./axios.config";
import type { TextBlockData } from "../interfaces/models/textblockmodel.interface";

export class ApiTextBlockService {
    async createTextBlock(formData: TextBlockData) {
        const response = await axiosInstance.post(`textblocks`, {
            body: formData
        });
        return response;
    }

    // Obtener todos los bloques de texto
    async getAllTextBlocks() {
        const response = await axiosInstance.get(`textblocks`);
        return response;
    }

    // Obtener un bloque de texto por ID
    async getTextBlockById(id: number) {
        const response = await axiosInstance.get(`textblocks/${id}`);
        return response;
    }

    // Actualizar un bloque de texto
    async updateTextBlock(id: number, formData: TextBlockData) {
        const response = await axiosInstance.put(`textblocks/${id}`, {
            body: formData
        });
        return response;
    }

    // Eliminar un bloque de texto
    async deleteTextBlock(id: number) {
        const response = await axiosInstance.delete(`textblocks/${id}`);
        return response;
    }
}
