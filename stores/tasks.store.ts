import { defineStore } from "pinia";
import type { Question } from "~/interfaces/components/props.components.interface";

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    questions: [] as Question[],
  }),

  actions: {
    saveTask(value: object) {
      // Si 'value' es un solo objeto, asegúrate de envolverlo en un array
      const tasksToSave = Array.isArray(value) ? value : [value];
      this.questions = [...this.questions, ...(tasksToSave as Question[])]; 
    },

    updateTasks(value: string) {
      this.questions = JSON.parse(value) as Question[];
      console.log("updateTasks", toRaw(this.questions));
    },
  },
});
