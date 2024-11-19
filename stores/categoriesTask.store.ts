import { defineStore } from 'pinia';
import ApiService from '../services/create.categoriestask.api';

interface CategoriesTaskData {
    id?: number;
    layout: number;
    instructions: string;
    categories: Array<{
        name: string,
        items: Array<string>
    }>;
    order: number;
}

export const useCategoriesTaskStore = defineStore('categoriesTask', {
    state: () => ({
        categoriesTasks: [] as CategoriesTaskData[],
        currentTask: null as CategoriesTaskData | null,
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async createCategoriesTask(formData: CategoriesTaskData) {
            try {
                this.loading = true;
                const response = await ApiService.createCategoriesTask(formData);
                this.categoriesTasks.push(response as CategoriesTaskData);
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getAllCategoriesTasks() {
            try {
                this.loading = true;
                const response = await ApiService.getAllCategoriesTasks();
                this.categoriesTasks = response as CategoriesTaskData[];
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getCategoriesTaskById(id: number) {
            try {
                this.loading = true;
                const response = await ApiService.getCategoriesTaskById(id);
                this.currentTask = response as CategoriesTaskData;
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateCategoriesTask(id: number, formData: CategoriesTaskData) {
            try {
                this.loading = true;
                const response = await ApiService.updateCategoriesTask(id, formData);
                const index = this.categoriesTasks.findIndex(task => task.id === id);
                if (index !== -1) {
                    this.categoriesTasks[index] = response as CategoriesTaskData;
                }
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteCategoriesTask(id: number) {
            try {
                this.loading = true;
                await ApiService.deleteCategoriesTask(id);
                this.categoriesTasks = this.categoriesTasks.filter(task => task.id !== id);
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});
