import { URL_API } from './api';

interface VideoModelData {
    title: string;
    instructions: string;
    video_file: File | null;
    script: string;
}

class ApiService {
    async createVideo(formData: VideoModelData) {
        const response = await $fetch(`${URL_API}/api/videos`, {
            method: 'POST',
            body: formData
        });
        return response;
    }

    // Obtener todos los videos
    async getAllVideos() {
        const response = await $fetch(`${URL_API}/api/videos`, {
            method: 'GET'
        });
        return response;
    }

    // Obtener un video por ID
    async getVideoById(id: number) {
        const response = await $fetch(`${URL_API}/api/videos/${id}`, {
            method: 'GET'
        });
        return response;
    }

    // Actualizar un video
    async updateVideo(id: number, formData: VideoModelData) {
        const response = await $fetch(`${URL_API}/api/videos/${id}`, {
            method: 'PUT',
            body: formData
        });
        return response;
    }

    // Eliminar un video
    async deleteVideo(id: number) {
        const response = await $fetch(`${URL_API}/api/videos/${id}`, {
            method: 'DELETE'
        });
        return response;
    }
}

export default new ApiService();
