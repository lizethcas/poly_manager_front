import { defineStore } from 'pinia';

interface TaskData {
    type: string;
    taskData: {
        instructions?: string;
        question?: string;
        answers?: any[];
        questions?: any[];
        items?: any[];
        categories?: any[];
        text_with_gaps?: string;
        keywords?: string[];
    };
    order?: number;
}

export const useTaskStore = defineStore('task', {
    state: () => ({
        tasks: [] as TaskData[]
    }),
    
    actions: {
        addTask(task: TaskData) {
            console.log('Añadiendo tarea al store:', task);
            this.tasks.push(task);
            console.log('Tasks actuales en store:', this.tasks);
        },
        
        getTasks() {
            return this.tasks;
        },
        
        clearTasks() {
            this.tasks = [];
        }
    }
}); 