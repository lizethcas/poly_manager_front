import { defineStore } from 'pinia';
import TasksApiService from '~/services/tasks.api';

export const useTaskStore = defineStore('task', {
  state: () => ({
    temporalTasks: [],
    currentLayout: null
  }),

  actions: {
    addTemporalTask(task) {
      this.temporalTasks.push(task);
    },

    removeTemporalTask(index) {
      this.temporalTasks.splice(index, 1);
    },

    async saveClassToDatabase() {
      try {
        for (const task of this.temporalTasks) {
          await TasksApiService.createTask(task.layoutId, task, task.type);
        }
        this.temporalTasks = [];
        return true;
      } catch (error) {
        console.error('Error saving class:', error);
        return false;
      }
    }
  }
}); 