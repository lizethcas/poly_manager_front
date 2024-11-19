import { defineStore } from 'pinia';
import ApiService from '../services/create.orderingtask.api';

interface OrderingTaskData {
    id?: number;
    layout: number;
    instructions: string;
    items: Array<{text: string, order: number}>;
    order: number;
}

export const useOrderingTaskStore = defineStore('orderingTask', {
    state: () => ({
        orderingTasks: [] as OrderingTaskData[],
        currentTask: null as OrderingTaskData | null,
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async createOrderingTask(taskData: OrderingTaskData) {
            try {
                this.loading = true;
                const response = await ApiService.createOrderingTask(taskData);
                this.orderingTasks.push(response as OrderingTaskData);
                return response;
            } catch (error) {
                this.error = 'Error al crear la tarea de ordenamiento';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchAllOrderingTasks() {
            try {
                this.loading = true;
                const response = await ApiService.getAllOrderingTasks();
                this.orderingTasks = response as OrderingTaskData[];
            } catch (error) {
                this.error = 'Error al obtener las tareas';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchOrderingTaskById(id: number) {
            try {
                this.loading = true;
                const response = await ApiService.getOrderingTaskById(id);
                this.currentTask = response as OrderingTaskData;
                return response;
            } catch (error) {
                this.error = 'Error al obtener la tarea';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateOrderingTask(id: number, taskData: OrderingTaskData) {
            try {
                this.loading = true;
                const response = await ApiService.updateOrderingTask(id, taskData);
                const index = this.orderingTasks.findIndex(task => task.id === id);
                if (index !== -1) {
                    this.orderingTasks[index] = response as OrderingTaskData;
                }
                return response;
            } catch (error) {
                this.error = 'Error al actualizar la tarea';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteOrderingTask(id: number) {
            try {
                this.loading = true;
                await ApiService.deleteOrderingTask(id);
                this.orderingTasks = this.orderingTasks.filter(task => task.id !== id);
            } catch (error) {
                this.error = 'Error al eliminar la tarea';
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});
