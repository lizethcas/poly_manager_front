import { useTaskStore } from '~/stores/taskStore';
const taskStore = useTaskStore();

const saveTask = async (taskData: any) => {
    try {
        console.log('[DEBUG] Tarea antes de guardar:', taskData);
        
        const task = {
            type: 'trueFalse', // o el tipo que corresponda
            taskData: {
                instructions: taskData.instructions,
                questions: taskData.questions,
                // ... otros campos según el tipo
            }
        };
        
        console.log('[DEBUG] Tarea formateada:', task);
        await taskStore.addTemporalTask(task);
        console.log('[DEBUG] Tarea guardada en store');
        
        // Verificar el estado del store
        console.log('[DEBUG] Estado actual del store:', taskStore.tasks);
        
    } catch (error) {
        console.error('[DEBUG] Error al guardar tarea:', error);
    }
}; 