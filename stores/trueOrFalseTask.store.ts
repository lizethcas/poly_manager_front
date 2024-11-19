import { defineStore } from 'pinia';
import ApiService from '../services/create.trueorfalsetask.api';

interface TrueOrFalseTask {
    id?: number;
    layout: number;
    instructions: string;
    questions: {
        questions: Array<{
            statement: string;
            state: 1 | 2 | 3;
        }>;
    };
    order: number;
}

export const useTrueOrFalseStore = defineStore('trueOrFalseStore', {
    state: () => ({
        tasks: [] as TrueOrFalseTask[],
        currentTask: null as TrueOrFalseTask | null,
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async createTask(taskData: TrueOrFalseTask) {
            try {
                this.loading = true;
                const response = await ApiService.createTrueOrFalse(taskData);
                this.tasks.push(response as TrueOrFalseTask);
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
                const response = await ApiService.getAllTrueOrFalse();
                this.tasks = response as TrueOrFalseTask[];
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
                const response = await ApiService.getTrueOrFalseById(id);
                this.currentTask = response as TrueOrFalseTask;
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateTask(id: number, taskData: TrueOrFalseTask) {
            try {
                this.loading = true;
                const response = await ApiService.updateTrueOrFalse(id, taskData);
                const index = this.tasks.findIndex(task => task.id === id);
                if (index !== -1) {
                    this.tasks[index] = response as TrueOrFalseTask;
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
                await ApiService.deleteTrueOrFalse(id);
                this.tasks = this.tasks.filter(task => task.id !== id);
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});
