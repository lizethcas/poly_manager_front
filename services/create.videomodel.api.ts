import axiosInstance from "./axios.config";
import type { VideoModelData } from "../interfaces/videomodel.interface";



export class ApiVideoModelService {
    async createVideo(formData: VideoModelData) {
        const response = await axiosInstance.post(`videos`, {
            body: formData
        });
        return response;
    }

    // Obtener todos los videos
    async getAllVideos() {
        const response = await axiosInstance.get(`videos`);
        return response;
    }

    // Obtener un video por ID
    async getVideoById(id: number) {
        const response = await axiosInstance.get(`videos/${id}`);
        return response;
    }

    // Actualizar un video
    async updateVideo(id: number, formData: VideoModelData) {
        const response = await axiosInstance.put(`videos/${id}`, {
            body: formData
        });
        return response;
    }

    // Eliminar un video
    async deleteVideo(id: number) {
        const response = await axiosInstance.delete(`videos/${id}`);
        return response;
    }
}

