import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import { useTaskStore } from '~/stores/task.store';

export interface EditableTask {
  content_type: string;
  content_details: any;
  audio_transcription?: string;
  stats?: boolean;
}

interface AnswerOption {
  text: string;
  isCorrect: boolean;
}

export function useTaskInitializer() {
  const taskStore = useTaskStore();
  
  // Obtiene los datos de edición del store
  const editData = computed(() => ({
    content_details: taskStore.getTask("editData")?.content_details || {},
    content_type: taskStore.getTask("editData")?.content_type || '',
    audio_transcription: taskStore.getTask("editData")?.audio_transcription || '',
    stats: taskStore.getTask("editData")?.stats || false,
    id: taskStore.getTask("editData")?.id || null
  }));

  // Determina si estamos en modo edición
  const isEditMode = computed(() => Boolean(taskStore.getTask("editData")));

  const initializeMultipleChoice = (questions: Ref<any[]>, questionData: any[]) => {
    if (!questionData.length) return;
    
    questions.value = questionData.map(q => ({
      question: q.question || '',
      answers: q.answers?.map((a: AnswerOption) => ({
        text: a.text || '',
        isCorrect: a.isCorrect || false
      })) || [{ text: '', isCorrect: false }],
      typeTask: 'multiple_choice'
    }));
  };

  return {
    editData,
    isEditMode,
    initializeMultipleChoice
  };
}
