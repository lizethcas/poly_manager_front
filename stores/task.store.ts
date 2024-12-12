export const useTaskStore = defineStore("task", {
    state: () => ({
      tasks: {} as Record<string, any>, // Puedes mantener los datos simples
    }),
    actions: {
      addTask(key: string, value: any) {
        this.tasks[key] = value; // Agrega o actualiza el valor directamente
      },
      getTask(key: string): any | undefined {
        return this.tasks[key];
      },
    },
  });
