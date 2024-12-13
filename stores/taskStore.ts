import { defineStore } from 'pinia';
interface Task {
  type: string;
  taskData: {
    instructions?: string;
    question?: string;
    answers?: any[];
    questions?: any[];
    items?: any[];
    categories?: any[];
    text_with_gaps?: string;
    keywords?: any[];
  };
  order?: number;
}

export const useTaskStore = defineStore('task', {
  state: () => ({
    temporalTasks: [] as Task[],
    currentLayoutId: null as number | null,
    error: null as string | null
  }),

  getters: {
    tasks: (state) => {
      console.log('[Store Getter] Obteniendo tareas:', state.temporalTasks);
      return state.temporalTasks;
    }
  },

  actions: {
    addTemporalTask(task: Task) {
      try {
        console.log('[DEBUG] Estado del store antes de añadir:', this.temporalTasks);
        console.log('[DEBUG] Tarea a añadir:', task);
        
        // Validar la tarea
        if (!task.type || !task.taskData) {
          console.error('[DEBUG] Tarea inválida:', task);
          throw new Error('Tarea inválida');
        }

        // Crear una copia profunda de la tarea
        const taskCopy = JSON.parse(JSON.stringify(task));
        this.temporalTasks.push(taskCopy);
        
        console.log('[DEBUG] Estado del store después de añadir:', this.temporalTasks);
        console.log('[DEBUG] Longitud del array de tareas:', this.temporalTasks.length);
      } catch (err) {
        console.error('[DEBUG] Error en addTemporalTask:', err);
        throw err;
      }
    },

    async saveTasksToLayout(layoutId: number) {
      try {
        console.log('[Store Action] Guardando tareas para layout:', layoutId);
        console.log('[Store Action] Tareas a guardar:', this.temporalTasks);

        if (!this.temporalTasks || this.temporalTasks.length === 0) {
          console.log('[Store Action] No hay tareas para guardar');
          return true;
        }

        const savedTasks = [];

        for (const task of this.temporalTasks) {
          console.log('[Store Action] Procesando tarea:', task);
          
          try {
            let savedTask;
            const baseTaskData = {
              layout: layoutId,
              instructions: task.taskData.instructions || ''
            };

            switch (task.type) {
              case 'trueFalse':
                savedTask = await TasksApiService.createTrueFalseTask(layoutId, {
                  ...baseTaskData,
                  questions: task.taskData.questions
                });
                console.log('[Store Action] Tarea true/false guardada:', savedTask);
                break;

              case 'multipleChoice':
                savedTask = await TasksApiService.createMultipleChoiceTask(layoutId, {
                  ...baseTaskData,
                  question: task.taskData.question,
                  answers: task.taskData.answers
                });
                console.log('[Store Action] Tarea multiple choice guardada:', savedTask);
                break;

              case 'ordering':
                savedTask = await TasksApiService.createOrderingTask(layoutId, {
                  ...baseTaskData,
                  items: task.taskData.items
                });
                console.log('[Store Action] Tarea ordering guardada:', savedTask);
                break;

              case 'categories':
                savedTask = await TasksApiService.createCategoriesTask(layoutId, {
                  ...baseTaskData,
                  categories: task.taskData.categories
                });
                console.log('[Store Action] Tarea categories guardada:', savedTask);
                break;

              case 'fillGaps':
                savedTask = await TasksApiService.createFillGapsTask(layoutId, {
                  ...baseTaskData,
                  text_with_gaps: task.taskData.text_with_gaps,
                  keywords: task.taskData.keywords
                });
                console.log('[Store Action] Tarea fill gaps guardada:', savedTask);
                break;

              default:
                console.warn('[Store Action] Tipo de tarea no reconocido:', task.type);
            }

            if (savedTask) {
              savedTasks.push(savedTask);
            }

          } catch (taskError) {
            console.error('[Store Action] Error al guardar tarea:', task.type, taskError);
            throw new Error(`Error al guardar tarea ${task.type}: ${taskError.message}`);
          }
        }

        console.log('[Store Action] Todas las tareas guardadas:', savedTasks);
        this.temporalTasks = [];
        return true;

      } catch (err) {
        console.error('[Store Action] Error al guardar tareas:', err);
        this.error = err instanceof Error ? err.message : 'Error al guardar tareas';
        throw err;
      }
    },

    clearTasks() {
      console.log('[Store Action] Limpiando tareas');
      this.temporalTasks = [];
      this.error = null;
    }
  }
}); 