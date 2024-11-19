import { defineStore } from 'pinia';
import ApiService from '../services/create.fillinthegapstask.api';

interface FillInTheGapsState {
    tasks: Array<any>;
    currentTask: any;
    loading: boolean;
    error: string | null;
}

export const useFillInTheGapsStore = defineStore('fillInTheGaps', {
    state: (): FillInTheGapsState => ({
        tasks: [],
        currentTask: null,
        loading: false,
        error: null
    }),

    actions: {
        async createTask(taskData: any) {
            try {
                this.loading = true;
                const response = await ApiService.createFillInTheGaps(taskData);
                this.tasks.push(response);
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchAllTasks() {
            try {
                this.loading = true;
                const response = await ApiService.getAllFillInTheGaps();
                this.tasks = response as any[];
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchTaskById(id: number) {
            try {
                this.loading = true;
                const response = await ApiService.getFillInTheGapsById(id);
                this.currentTask = response as any;
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateTask(id: number, taskData: any) {
            try {
                this.loading = true;
                const response = await ApiService.updateFillInTheGaps(id, taskData);
                const index = this.tasks.findIndex(task => task.id === id);
                if (index !== -1) {
                    this.tasks[index] = response as any;
                }
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteTask(id: number) {
            try {
                this.loading = true;
                await ApiService.deleteFillInTheGaps(id);
                this.tasks = this.tasks.filter(task => task.id !== id);
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});
