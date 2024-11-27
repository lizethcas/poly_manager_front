<template>
    <div>
        <ClassNavigation 
            @handle-modal="handleModal"
            @save-class="submitForm"
        />

        <!-- Nueva sección informativa -->
        <div class="mt-6 px-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-3">
                Contenido de la clase
            </h2>
            <p class="text-gray-600 mb-4">
                En esta sección se mostrarán los elementos creados para la clase:
                imágenes, videos y tareas.
            </p>
            
            <!-- Lista de layouts temporales -->
            <div v-if="temporaryLayouts.length > 0" class="space-y-4">
                <div v-for="layout in temporaryLayouts" :key="layout.id" class="bg-white p-4 rounded-lg shadow">
                    <h3 class="font-medium text-lg">{{ layout.title }}</h3>
                    <p class="text-gray-600 mt-2">{{ layout.instructions }}</p>
                    
                    <!-- Lista de tareas del layout -->
                    <div v-if="layout.tasks?.length" class="mt-4">
                        <h4 class="font-medium text-sm text-gray-700">Tareas incluidas:</h4>
                        <ul class="ml-4 mt-2 list-disc">
                            <li v-for="(task, index) in layout.tasks" :key="index" class="text-gray-600">
                                {{ getTaskTypeName(task.type) }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Mensaje cuando no hay contenido -->
            <div v-else class="text-gray-500 italic">
                No hay contenido creado aún. Utiliza los botones superiores para comenzar a crear.
            </div>

            <button>guarda</button>
        </div>

        <TaskList 
            :tasks="savedTasks"
            @delete-task="removeTask"
        />

        <!-- Modal Principal -->
        <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 overflow-y-auto">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
                <!-- Cabecera Modal -->
                <ModalHeader 
                    :title="modalTitle"
                    @close="isChildModalOpen ? closeChildModal() : closeModal()"
                />

                <!-- Contenido Modal -->
                <template v-if="currentModal === 'layoutTask' && !isChildModalOpen">
                    <LayoutTaskForm 
                        v-model:form-data="formData"
                        :tasks="formData.tasks"
                        @select-task="selectTaskType"
                        @remove-task="removeTask"
                        @layout-saved="onLayoutSaved"
                    />
                </template>

                <!-- Modal Hijo para Tareas Específicas -->
                <template v-if="isChildModalOpen">
                    <ImageTask 
                        v-if="currentModal === 'image'"
                        v-model:task-data="tempTaskData"
                        @save="saveTask"
                        @cancel="closeChildModal"
                    />
                    
                    <VideoTask 
                        v-if="currentModal === 'video'"
                        v-model:task-data="tempTaskData"
                        @save="saveTask"
                        @cancel="closeChildModal"
                    />

                    <MultipleChoiceTask 
                        v-if="currentModal === 'multipleChoice'"
                        v-model:task-data="tempTaskData"
                        @save="saveTask"
                        @cancel="closeChildModal"
                    />

                    <TrueFalseTask 
                        v-if="currentModal === 'trueFalse'"
                        v-model:task-data="tempTaskData"
                        @save="saveTask"
                        @cancel="closeChildModal"
                    />

                    <OrderingTask 
                        v-if="currentModal === 'ordering'"
                        v-model:task-data="tempTaskData"
                        @save="saveTask"
                        @cancel="closeChildModal"
                    />

                    <CategoriesTask 
                        v-if="currentModal === 'categories'"
                        v-model:task-data="tempTaskData"
                        @save="saveTask"
                        @cancel="closeChildModal"
                    />

                    <FillGapsTask 
                        v-if="currentModal === 'fillGaps'"
                        v-model:task-data="tempTaskData"
                        @save="saveTask"
                        @cancel="closeChildModal"
                    />
                </template>
            </div>
        </div>

        <!-- Mostrar errores -->
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">{{ error }}</span>
        </div>

        <!-- Mostrar loading -->
        <div v-if="isLoading" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useModal } from '@/composables/useModal';
import TasksApiService from '@/services/tasks.api';
import { useLayoutStore } from '@/stores/layout.store';
import { useTaskStore } from '~/stores/taskStore';

// Importar componentes con rutas absolutas
import ClassNavigation from '@/components/class/ClassNavigation.vue';
import TaskList from '@/components/class/TaskList.vue';
import ModalHeader from '@/components/common/ModalHeader.vue';
import LayoutTaskForm from '@/components/tasks/LayoutTaskForm.vue';
import ImageTask from '@/components/tasks/ImageTask.vue';
import VideoTask from '@/components/tasks/VideoTask.vue';
import MultipleChoiceTask from '@/components/tasks/MultipleChoiceTask.vue';
import TrueFalseTask from '@/components/tasks/TrueFalseTask.vue';
import OrderingTask from '@/components/tasks/OrderingTask.vue';
import CategoriesTask from '@/components/tasks/CategoriesTask.vue';
import FillGapsTask from '@/components/tasks/FillGapsTask.vue';

const route = useRoute();
const classId = computed(() => Number(route.params.classId));

const { isOpen, openModal, closeModal } = useModal();
const currentModal = ref('');
const isChildModalOpen = ref(false);
const formData = ref({
    title: '',
    instructions: '',
    image: null,
    audio: null,
    audioScript: '',
    tasks: [] as any[], // Array para almacenar todas las tareas
});

const tempTaskData = ref({
    instructions: '',
    // Datos para Multiple Choice
    question: '',
    answers: [],
    // Datos para True/False
    questions: [],
    // Datos para Ordering
    items: [],
    // Datos para Categories
    categories: [],
    // Datos para Fill Gaps
    text_with_gaps: '',
    keywords: []
});

const modalTitle = computed(() => {
    const titles = {
        image: 'Image Layout',
        video: 'Video Layout',
        multipleChoice: 'Multiple Choice Task',
        trueFalse: 'True/False Task',
        ordering: 'Ordering Task'
    };
    return titles[currentModal.value] || '';
});

const handleModal = (type: string) => {
    formData.value = {
        title: '',
        instructions: '',
        image: null,
        audio: null,
        audioScript: '',
        tasks: []
    };
    
    currentModal.value = type;
    if (type === 'layoutTask') {
        isChildModalOpen.value = false;
    }
    openModal();
};

const handleFileUpload = (type: string, file: File) => {
    // Handle file upload logic
};

const addAnswer = () => {
    tempTaskData.value.answers.push({ text: '', is_correct: false });
};

const removeAnswer = (index: number) => {
    tempTaskData.value.answers.splice(index, 1);
};

const addQuestion = () => {
    tempTaskData.value.questions.push({
        statement: '',
        state: '1' // Default a verdadero
    });
};

const removeQuestion = (index: number) => {
    tempTaskData.value.questions.splice(index, 1);
};

const addOrderingItem = () => {
    const newOrder = tempTaskData.value.items.length + 1;
    tempTaskData.value.items.push({
        id: newOrder,
        description: '',
        order: newOrder
    });
};

const removeOrderingItem = (index: number) => {
    tempTaskData.value.items.splice(index, 1);
    // Reordenar los elementos restantes
    tempTaskData.value.items.forEach((item, idx) => {
        item.order = idx + 1;
    });
};

const addCategory = () => {
    tempTaskData.value.categories.push({
        name: '',
        items: []
    });
};

const removeCategory = (categoryIndex: number) => {
    tempTaskData.value.categories.splice(categoryIndex, 1);
};

const addCategoryItem = (categoryIndex: number) => {
    tempTaskData.value.categories[categoryIndex].items.push('');
};

const removeCategoryItem = (categoryIndex: number, itemIndex: number) => {
    tempTaskData.value.categories[categoryIndex].items.splice(itemIndex, 1);
};

const savedTasks = ref([]);

const submitForm = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
        console.log('Iniciando guardado de layout y tareas');
        
        if (!taskStore) {
            throw new Error('Store no inicializado correctamente');
        }

        // Crear layout
        const layoutData = new FormData();
        layoutData.append('class_model', classId.value.toString());
        layoutData.append('title', formData.value.title);
        layoutData.append('instructions', formData.value.instructions);
        
        // Verificar que tenemos un classId válido
        console.log('ClassId being sent:', classId.value);
        
        if (formData.value.image) {
            layoutData.append('cover', formData.value.image);
        }
        if (formData.value.audio) {
            layoutData.append('audio', formData.value.audio);
            layoutData.append('audio_script', formData.value.audioScript);
        }

        // Imprimir el FormData para debugging
        for (let pair of layoutData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        const savedLayout = await TasksApiService.createLayout(classId.value, layoutData);
        console.log('Layout guardado:', savedLayout);

        // Guardar tareas
        const success = await taskStore.saveTasksToLayout(savedLayout.id);
        
        if (!success) {
            throw new Error('Error al guardar las tareas');
        }

        console.log('Proceso completado exitosamente');
        alert('Layout y tareas guardados correctamente');

    } catch (err) {
        console.error('Error en submitForm:', err);
        error.value = err instanceof Error ? err.message : 'Error desconocido';
        alert(`Error al guardar: ${error.value}`);
    } finally {
        isLoading.value = false;
    }
};

const taskTypes = [
    {
        type: 'multipleChoice',
        name: 'Multiple Choice',
        description: 'Create multiple choice questions'
    },
    {
        type: 'trueFalse',
        name: 'True/False',
        description: 'Create true/false statements'
    },
    {
        type: 'ordering',
        name: 'Ordering Task',
        description: 'Create ordering exercises'
    },
    {
        type: 'categories',
        name: 'Categories',
        description: 'Create category classification tasks'
    },
    {
        type: 'fillGaps',
        name: 'Fill in the Gaps',
        description: 'Create text with gaps to fill'
    }
];

const selectTaskType = (type: string) => {
    currentModal.value = type;
    tempTaskData.value = {
        instructions: '',
        question: '',
        answers: [],
        questions: [],
        items: [],
        categories: [],
        text_with_gaps: '',
        keywords: []
    };
    isChildModalOpen.value = true;
};

const closeChildModal = () => {
    isChildModalOpen.value = false;
    currentModal.value = 'layoutTask';
};

const handleImageUpload = (file: File) => {
    formData.value.image = file;
};

const handleAudioUpload = (file: File) => {
    formData.value.audio = file;
};

// Método para guardar la tarea
const saveTask = () => {
    let taskToSave;

    switch (currentModal.value) {
        case 'multipleChoice':
            taskToSave = {
                type: 'multipleChoice',
                taskData: {
                    instructions: tempTaskData.value.instructions,
                    question: tempTaskData.value.question,
                    answers: tempTaskData.value.answers.map(answer => ({
                        text: answer.text,
                        is_correct: answer.is_correct
                    }))
                }
            };
            break;

        case 'trueFalse':
            taskToSave = {
                type: 'trueFalse',
                taskData: {
                    instructions: tempTaskData.value.instructions,
                    questions: tempTaskData.value.questions.map(q => ({
                        statement: q.statement,
                        state: q.state
                    }))
                }
            };
            break;

        case 'ordering':
            taskToSave = {
                type: 'ordering',
                taskData: {
                    instructions: tempTaskData.value.instructions,
                    items: tempTaskData.value.items.map(item => ({
                        id: item.id,
                        description: item.description,
                        order: item.order
                    }))
                }
            };
            break;

        case 'categories':
            taskToSave = {
                type: 'categories',
                taskData: {
                    instructions: tempTaskData.value.instructions,
                    categories: tempTaskData.value.categories.map(cat => ({
                        name: cat.name,
                        items: cat.items
                    }))
                }
            };
            break;

        case 'fillGaps':
            taskToSave = {
                type: 'fillGaps',
                taskData: {
                    instructions: tempTaskData.value.instructions,
                    text_with_gaps: tempTaskData.value.text_with_gaps,
                    keywords: tempTaskData.value.text_with_gaps.match(/\[(.*?)\]/g)?.map(k => k.slice(1, -1)) || []
                }
            };
            break;
    }

    if (taskToSave) {
        console.log('Guardando tarea:', taskToSave);
        formData.value.tasks.push(taskToSave);
    }

    closeChildModal();
};

// Método para eliminar una tarea
const removeTask = (index: number) => {
    formData.value.tasks.splice(index, 1);
};

// Computed property para validar la tarea de ordenamiento
const isOrderingTaskValid = computed(() => {
    return tempTaskData.value.items.length >= 2 && 
           tempTaskData.value.items.every(item => item.description.trim() !== '');
});

// Computed property para validar la tarea de categorías
const isCategoriesTaskValid = computed(() => {
    return tempTaskData.value.categories.length >= 2 && // Al menos 2 categorías
           tempTaskData.value.categories.every(category => 
               category.name.trim() !== '' && // Nombre de categoría no vacío
               category.items.length > 0 && // Al menos 1 item por categoría
               category.items.every(item => item.text.trim() !== '') // Items no vacíos
           );
});

const layoutStore = useLayoutStore();
const temporaryLayouts = computed(() => layoutStore.getTemporaryLayouts);

const onLayoutSaved = (layout) => {
    // Reiniciar el formulario
    formData.value = {
        title: '',
        instructions: '',
        image: null,
        audio: null,
        audioScript: '',
        tasks: [] // Importante: reiniciar también las tareas
    };
    
    // Cerrar el modal
    closeModal();
    
    // Reiniciar los estados del modal
    currentModal.value = '';
    isChildModalOpen.value = false;
};

const getTaskTypeName = (type: string) => {
    const taskTypes = {
        multipleChoice: 'Opción múltiple',
        trueFalse: 'Verdadero/Falso',
        ordering: 'Ordenamiento',
        categories: 'Categorías',
        fillGaps: 'Completar espacios'
    };
    return taskTypes[type] || type;
};

// 2. Inicialización del store
const taskStore = useTaskStore();

// 3. Manejo de errores y estado
const error = ref<string | null>(null);
const isLoading = ref(false);
</script>