<template>
    <div class="space-y-6">
        <!-- Título -->
        <div>
            <label class="block text-sm font-medium text-gray-700">Título</label>
            <input 
                type="text" 
                v-model="localFormData.title"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
        </div>

        <!-- Instrucciones -->
        <div>
            <label class="block text-sm font-medium text-gray-700">Instrucciones</label>
            <textarea 
                v-model="localFormData.instructions"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            ></textarea>
        </div>

        <!-- Archivos -->
        <div class="space-y-4">
            <!-- Imagen de portada -->
            <div>
                <InputFile
                    fileType="image"
                    label="Imagen de portada"
                    @file-selected="(file) => handleFileUpload('image', file)"
                />
            </div>

            <!-- Audio -->
            <div>
                <InputFile
                    fileType="audio"
                    label="Audio"
                    @file-selected="(file) => handleFileUpload('audio', file)"
                />
            </div>

            <!-- Script de audio -->
            <div v-if="localFormData.audio">
                <label class="block text-sm font-medium text-gray-700">Script de audio</label>
                <textarea 
                    v-model="localFormData.audioScript"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                ></textarea>
            </div>
        </div>

        <!-- Tipos de tareas -->
        <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Seleccionar tipo de tarea</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button 
                    v-for="taskType in taskTypes" 
                    :key="taskType.type"
                    @click="$emit('select-task', taskType.type)"
                    class="p-4 border rounded-lg hover:bg-gray-50 text-left"
                >
                    <h4 class="font-medium text-gray-900">{{ taskType.name }}</h4>
                    <p class="text-sm text-gray-500">{{ taskType.description }}</p>
                </button>
            </div>
        </div>

        <!-- Lista de tareas agregadas -->
        <div v-if="tasks.length > 0">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Tareas agregadas</h3>
            <div class="space-y-4">
                <div 
                    v-for="(task, index) in tasks" 
                    :key="index"
                    class="p-4 border rounded-lg bg-white shadow-sm"
                >
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="font-medium text-lg text-gray-900">{{ getTaskTypeName(task.type) }}</h4>
                        <button 
                            @click="$emit('remove-task', index)"
                            class="text-red-500 hover:text-red-700"
                        >
                            Eliminar
                        </button>
                    </div>

                    <div class="space-y-4">
                        <!-- Instrucciones comunes para todas las tareas -->
                        <div class="text-sm text-gray-600">
                            <p class="font-medium mb-1">Instrucciones:</p>
                            <p class="ml-4">{{ task.taskData.instructions }}</p>
                        </div>

                        <!-- Contenido específico por tipo de tarea -->
                        <div class="ml-4">
                            <!-- Multiple Choice -->
                            <template v-if="task.type === 'multipleChoice'">
                                <p class="font-medium text-gray-900">Pregunta:</p>
                                <p class="mb-2">{{ task.taskData.question }}</p>
                                <p class="font-medium text-gray-900">Respuestas:</p>
                                <ul class="list-disc ml-6">
                                    <li v-for="(answer, idx) in task.taskData.answers" :key="idx" 
                                        :class="answer.is_correct ? 'text-green-600' : 'text-gray-600'"
                                    >
                                        {{ answer.text }}
                                        <span v-if="answer.is_correct" class="ml-2">(Correcta)</span>
                                    </li>
                                </ul>
                            </template>

                            <!-- True/False -->
                            <template v-if="task.type === 'trueFalse'">
                                <p class="font-medium text-gray-900">Afirmaciones:</p>
                                <ul class="list-disc ml-6">
                                    <li v-for="(q, idx) in task.taskData.questions" :key="idx">
                                        {{ q.statement }}
                                        <span :class="q.state === '1' ? 'text-green-600' : 'text-red-600'" class="ml-2">
                                            ({{ q.state === '1' ? 'Verdadero' : 'Falso' }})
                                        </span>
                                    </li>
                                </ul>
                            </template>

                            <!-- Ordering -->
                            <template v-if="task.type === 'ordering'">
                                <p class="font-medium text-gray-900">Elementos a ordenar:</p>
                                <ul class="list-decimal ml-6">
                                    <li v-for="item in [...task.taskData.items].sort((a, b) => a.order - b.order)" 
                                        :key="item.id" 
                                        class="mb-1"
                                    >
                                        {{ item.description }}
                                        <span class="text-gray-500">(Posición: {{ item.order }})</span>
                                    </li>
                                </ul>
                            </template>

                            <!-- Categories -->
                            <template v-if="task.type === 'categories'">
                                <p class="font-medium text-gray-900">Categorías:</p>
                                <div v-for="(category, catIndex) in task.taskData.categories" :key="catIndex" class="ml-4 mb-2">
                                    <p class="font-medium">{{ category.name }}:</p>
                                    <ul class="list-disc ml-6">
                                        <li v-for="(item, itemIndex) in category.items" :key="itemIndex">
                                            {{ item.text }}
                                        </li>
                                    </ul>
                                </div>
                            </template>

                            <!-- Fill Gaps -->
                            <template v-if="task.type === 'fillGaps'">
                                <p class="font-medium text-gray-900">Texto:</p>
                                <p class="mb-2">{{ task.taskData.text_with_gaps }}</p>
                                <p class="font-medium text-gray-900">Palabras clave:</p>
                                <ul class="list-disc ml-6">
                                    <li v-for="(keyword, kIndex) in task.taskData.keywords" :key="kIndex">
                                        {{ keyword }}
                                    </li>
                                </ul>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button 
            @click="saveLayoutTemporarily"
            class="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
            Guardar Layout
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import InputFile from '../InputFile.vue';
import { useLayoutStore } from '@/stores/layout.store';
import { useTaskStore } from '~/stores/taskStorec';

const props = defineProps<{
    formData: {
        title: string;
        instructions: string;
        image: File | null;
        audio: File | null;
        audioScript: string;
    };
    tasks: any[];
}>();

const emit = defineEmits(['update:formData', 'select-task', 'remove-task', 'layout-saved']);

const localFormData = computed({
    get: () => props.formData,
    set: (value) => emit('update:formData', value)
});

const taskTypes = [
    {
        type: 'multipleChoice',
        name: 'Opción múltiple',
        description: 'Crear preguntas de opción múltiple'
    },
    {
        type: 'trueFalse',
        name: 'Verdadero/Falso',
        description: 'Crear afirmaciones verdadero/falso'
    },
    {
        type: 'ordering',
        name: 'Ordenamiento',
        description: 'Crear ejercicios de ordenamiento'
    },
    {
        type: 'categories',
        name: 'Categorías',
        description: 'Crear tareas de clasificación por categorías'
    },
    {
        type: 'fillGaps',
        name: 'Completar espacios',
        description: 'Crear texto con espacios para completar'
    }
];

const getTaskTypeName = (type: string) => {
    const taskType = taskTypes.find(t => t.type === type);
    return taskType ? taskType.name : type;
};

const handleFileUpload = (type: string, file: File) => {
    if (type === 'image') {
        localFormData.value.image = file;
    } else if (type === 'audio') {
        localFormData.value.audio = file;
    }
};

const layoutStore = useLayoutStore();
const taskStore = useTaskStore();

const saveLayoutTemporarily = () => {
    try {
        console.log('[LayoutForm] Guardando layout temporalmente');
        
        // Guardar las tareas en el taskStore
        if (props.tasks && props.tasks.length > 0) {
            console.log('[LayoutForm] Guardando tareas:', props.tasks);
            props.tasks.forEach(task => {
                taskStore.addTemporalTask(task);
            });
        }

        const layoutData = {
            title: localFormData.value.title,
            instructions: localFormData.value.instructions,
            tasks: taskStore.tasks,
            img_cover: localFormData.value.image,
            audio: localFormData.value.audio,
            audio_script: localFormData.value.audioScript
        };

        console.log('[LayoutForm] Layout data:', layoutData);
        const savedLayout = layoutStore.saveTemporaryLayout(layoutData);
        emit('layout-saved', savedLayout);
        
        // Limpiar el formulario
        localFormData.value = {
            title: '',
            instructions: '',
            image: null,
            audio: null,
            audioScript: ''
        };

    } catch (error) {
        console.error('[LayoutForm] Error al guardar:', error);
        throw error;
    }
};
</script> 