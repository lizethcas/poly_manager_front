import { defineStore } from 'pinia';
import ApiService from '../services/create.videomodel.api';

interface VideoModel {
    id?: number;
    title: string;
    instructions: string;
    video_file: File | null;
    script: string;
    created_at?: string;
    updated_at?: string;
}

export const useVideoStore = defineStore('video', {
    state: () => ({
        videos: [] as VideoModel[],
        currentVideo: null as VideoModel | null,
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async fetchVideos() {
            try {
                this.loading = true;
                const response = await ApiService.getAllVideos();
                this.videos = response as VideoModel[];
            } catch (error) {
                this.error = 'Error al cargar los videos';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async createVideo(videoData: VideoModel) {
            try {
                this.loading = true;
                const response = await ApiService.createVideo(videoData);
                this.videos.push(response as VideoModel);
                return response;
            } catch (error) {
                this.error = 'Error al crear el video';
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getVideoById(id: number) {
            try {
                this.loading = true;
                const response = await ApiService.getVideoById(id);
                this.currentVideo = response as VideoModel;
                return response;
            } catch (error) {
                this.error = 'Error al obtener el video';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async updateVideo(id: number, videoData: VideoModel) {
            try {
                this.loading = true;
                const response = await ApiService.updateVideo(id, videoData);
                const index = this.videos.findIndex(video => video.id === id);
                if (index !== -1) {
                    this.videos[index] = response as VideoModel;
                }
                return response;
            } catch (error) {
                this.error = 'Error al actualizar el video';
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteVideo(id: number) {
            try {
                this.loading = true;
                await ApiService.deleteVideo(id);
                this.videos = this.videos.filter(video => video.id !== id);
            } catch (error) {
                this.error = 'Error al eliminar el video';
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});
