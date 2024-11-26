<template>
    <div>
        <nav class="flex justify-start gap-4 mb-8">
            <ul class="flex gap-4">
                <li>
                    <button @click="handleModal('image')" class="px-4 py-2 bg-blue-500 text-white rounded">
                        Image Layout
                    </button>
                </li>
                <li>
                    <button @click="handleModal('video')" class="px-4 py-2 bg-blue-500 text-white rounded">
                        Video Layout
                    </button>
                </li>
                <li>
                    <button @click="handleModal('layoutTask')" class="px-4 py-2 bg-blue-500 text-white rounded">
                        Layout Task
                    </button>
                </li>
            </ul>
        </nav>

        <div class="mt-8 space-y-8">
            <div v-if="savedTasks.length > 0" class="space-y-4">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Elementos del curso</h2>
                
                <div v-for="(task, index) in savedTasks" :key="index" 
                    class="border rounded-lg p-6 bg-white shadow-sm">
                    <div class="border-b pb-4 mb-4">
                        <div class="flex justify-between items-start">
                            <div class="space-y-2">
                                <h3 class="text-lg font-semibold text-gray-900">{{ task.title || 'Sin título' }}</h3>
                                <p class="text-sm text-gray-600">{{ task.instructions || 'Sin instrucciones' }}</p>
                            </div>
                            <span class="text-sm font-medium text-gray-500">
                                {{ 
                                    task.type === 'multipleChoice' ? 'Opción Múltiple' :
                                    task.type === 'trueFalse' ? 'Verdadero/Falso' :
                                    task.type === 'ordering' ? 'Ordenamiento' :
                                    task.type === 'fillGaps' ? 'Completar Espacios' :
                                    task.type === 'categories' ? 'Categorías' : ''
                                }}
                            </span>
                        </div>
                    </div>

                    <div class="mt-4">
                        <div v-if="task.type === 'multipleChoice'" class="space-y-3">
                            <p class="font-medium">Pregunta: {{ task.question }}</p>
                            <ul class="ml-4 space-y-2">
                                <li v-for="(answer, aIndex) in task.answers" :key="aIndex" 
                                    class="flex items-center gap-2">
                                    <span class="text-sm">
                                        {{ answer.text }}
                                        <span class="text-xs text-gray-500">
                                            {{ answer.is_correct ? '(Correcta)' : '(Incorrecta)' }}
                                        </span>
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div v-if="task.type === 'trueFalse'" class="space-y-3">
                            <ul class="space-y-2">
                                <li v-for="(question, qIndex) in task.questions" :key="qIndex" 
                                    class="flex items-center gap-2">
                                    <span class="font-medium">{{ question.statement }}</span>
                                    <span class="text-sm">
                                        ({{ question.state === 1 ? 'Verdadero' : question.state === 2 ? 'Falso' : 'No establecido' }})
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div v-if="task.type === 'ordering'" class="space-y-3">
                            <ul class="space-y-2">
                                <li v-for="(item, iIndex) in task.items" :key="iIndex" 
                                    class="flex items-center gap-2">
                                    <span class="text-sm">{{ iIndex + 1 }}. {{ item.description }}</span>
                                </li>
                            </ul>
                        </div>

                        <div v-if="task.type === 'fillGaps'" class="space-y-3">
                            <p class="text-sm">{{ task.text_with_gaps }}</p>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="(keyword, kIndex) in task.keywords" :key="kIndex"
                                    class="px-2 py-1 bg-gray-100 rounded-md text-sm">
                                    {{ keyword }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 overflow-y-auto">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">{{ modalTitle }}</h2>
                    <button @click="isChildModalOpen ? closeChildModal() : closeModal()" class="text-gray-500 hover:text-gray-700">
                        <span class="sr-only">Close</span>
                        ×
                    </button>
                </div>

                <template v-if="currentModal === 'layoutTask' && !isChildModalOpen">
                    <div class="space-y-4 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Título</label>
                            <input 
                                type="text" 
                                v-model="formData.title" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            >
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Instrucciones</label>
                            <textarea 
                                v-model="formData.instructions" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            ></textarea>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
                        <InputFile 
                            v-model="formData.image" 
                            @file-selected="handleImageUpload"
                        />
                    </div>

                    <div class="space-y-4 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Audio</label>
                            <InputFile 
                                v-model="formData.audio" 
                                @file-selected="handleAudioUpload"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Transcripción del audio</label>
                            <textarea 
                                v-model="formData.audioScript" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-32"
                                placeholder="Escribe la transcripción del audio aquí..."
                            ></textarea>
                        </div>
                    </div>

                    <div v-if="formData.tasks.length > 0" class="mt-8 mb-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Tareas creadas</h3>
                        <div class="space-y-4">
                            <div v-for="(task, index) in formData.tasks" :key="index" class="border rounded-lg p-4">
                                <div v-if="task.type === 'trueFalse'" class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <h4 class="font-medium">Verdadero/Falso</h4>
                                        <button @click="removeTask(index)" class="text-red-500 hover:text-red-700">
                                            <span class="sr-only">Eliminar</span>
                                            ×
                                        </button>
                                    </div>
                                    <ul class="space-y-2">
                                        <li v-for="(question, qIndex) in task.questions" :key="qIndex" 
                                            class="flex items-center gap-2">
                                            <span class="font-medium">{{ question.statement }}</span>
                                            <span class="text-sm">
                                                ({{ question.state === 1 ? 'Verdadero' : question.state === 2 ? 'Falso' : 'No establecido' }})
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div v-if="task.type === 'multipleChoice'" class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <h4 class="font-medium">Opción Múltiple</h4>
                                        <button @click="removeTask(index)" class="text-red-500 hover:text-red-700">×</button>
                                    </div>
                                    <div class="space-y-2">
                                        <p class="font-medium">Pregunta: {{ task.question }}</p>
                                        <ul class="ml-4 space-y-1">
                                            <li v-for="(answer, aIndex) in task.answers" :key="aIndex" 
                                                class="flex items-center gap-2">
                                                <span class="text-sm">
                                                    {{ answer.text }}
                                                    <span class="text-xs text-gray-500">
                                                        {{ answer.is_correct ? '(Correcta)' : '(Incorrecta)' }}
                                                    </span>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div v-if="task.type === 'ordering'" class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <h4 class="font-medium">Tarea de Ordenamiento</h4>
                                        <button @click="removeTask(index)" class="text-red-500 hover:text-red-700">×</button>
                                    </div>
                                    <ul class="space-y-2">
                                        <li v-for="(item, iIndex) in task.items" :key="iIndex" 
                                            class="flex items-center gap-2">
                                            <span class="text-sm">{{ iIndex + 1 }}. {{ item.description }}</span>
                                        </li>
                                    </ul>
                                </div>

                                <div v-if="task.type === 'categories'" class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <h4 class="font-medium">Tarea de Categorías</h4>
                                        <button @click="removeTask(index)" class="text-red-500 hover:text-red-700">×</button>
                                    </div>
                                    <div class="space-y-4">
                                        <div v-for="(category, cIndex) in task.categories" :key="cIndex" class="ml-4">
                                            <h5 class="font-medium">{{ category.name }}</h5>
                                            <ul class="list-disc ml-4">
                                                <li v-for="(item, iIndex) in category.items" :key="iIndex" 
                                                    class="text-sm">
                                                    {{ item }}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="task.type === 'fillGaps'" class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <h4 class="font-medium">Completar Espacios</h4>
                                        <button @click="removeTask(index)" class="text-red-500 hover:text-red-700">×</button>
                                    </div>
                                    <p class="text-sm">{{ task.text_with_gaps }}</p>
                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="(keyword, kIndex) in task.keywords" :key="kIndex"
                                            class="px-2 py-1 bg-gray-100 rounded-md text-sm">
                                            {{ keyword }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Agregar nueva tarea</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <button 
                                v-for="task in taskTypes" 
                                :key="task.type"
                                @click="selectTaskType(task.type)"
                                class="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center transition-colors"
                            >
                                <span class="font-medium">{{ task.name }}</span>
                                <span class="text-sm text-gray-500">{{ task.description }}</span>
                            </button>
                        </div>
                    </div>
                </template>

                <template v-if="isChildModalOpen">
                    <div class="space-y-4 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" v-model="formData.title" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Instructions</label>
                            <textarea v-model="formData.instructions" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <template v-if="currentModal === 'layoutTask'">
                            <div class="grid grid-cols-2 gap-4">
                                <button 
                                    v-for="task in taskTypes" 
                                    :key="task.type"
                                    @click="selectTaskType(task.type)"
                                    class="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center"
                                >
                                    <span class="font-medium">{{ task.name }}</span>
                                    <span class="text-sm text-gray-500">{{ task.description }}</span>
                                </button>
                            </div>
                        </template>

                        <template v-if="currentModal === 'image'">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Upload Image</label>
                                <input type="file" @change="handleFileUpload" accept="image/*" class="mt-1 block w-full">
                            </div>
                        </template>

                        <template v-if="currentModal === 'video'">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Upload Video</label>
                                <input type="file" @change="handleFileUpload" accept="video/*" class="mt-1 block w-full">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Video Script</label>
                                <textarea v-model="formData.script" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                            </div>
                        </template>

                        <template v-if="currentModal === 'multipleChoice'">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Pregunta</label>
                                    <input 
                                        type="text" 
                                        v-model="tempTaskData.question" 
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    >
                                </div>
                                <div class="space-y-2">
                                    <div v-for="(answer, index) in tempTaskData.answers" :key="index" class="flex gap-2">
                                        <input 
                                            type="text" 
                                            v-model="answer.text" 
                                            placeholder="Respuesta" 
                                            class="flex-1 rounded-md border-gray-300 shadow-sm"
                                        >
                                        <label class="flex items-center gap-2">
                                            <input type="checkbox" v-model="answer.is_correct">
                                            Correcta
                                        </label>
                                        <button @click="removeAnswer(index)" class="text-red-500">Eliminar</button>
                                    </div>
                                    <button @click="addAnswer" class="text-blue-500">+ Agregar respuesta</button>
                                </div>
                            </div>
                            <div class="mt-4 flex justify-end gap-2">
                                <button @click="closeChildModal" class="px-4 py-2 border rounded">Cancelar</button>
                                <button @click="saveTask" class="px-4 py-2 bg-blue-500 text-white rounded">Guardar</button>
                            </div>
                        </template>

                        <template v-if="currentModal === 'trueFalse'">
                            <div class="space-y-4">
                                <div v-for="(question, index) in tempTaskData.questions" :key="index" class="space-y-2 border-b pb-4">
                                    <div class="flex justify-between items-center">
                                        <div class="flex-1">
                                            <input 
                                                type="text" 
                                                v-model="question.statement" 
                                                placeholder="Escribe la afirmación" 
                                                class="w-full rounded-md border-gray-300 shadow-sm"
                                            >
                                        </div>
                                        <select 
                                            v-model="question.state" 
                                            class="ml-2 rounded-md border-gray-300 shadow-sm"
                                        >
                                            <option value="1">Verdadero</option>
                                            <option value="2">Falso</option>
                                            <option value="3">No establecido</option>
                                        </select>
                                        <button @click="removeQuestion(index)" class="ml-2 text-red-500 hover:text-red-700">
                                            ×
                                        </button>
                                    </div>
                                </div>
                                
                                <button 
                                    @click="addQuestion" 
                                    class="text-blue-500 hover:text-blue-700"
                                >
                                    + Agregar afirmación
                                </button>

                                <div class="mt-4 flex justify-end gap-2">
                                    <button @click="closeChildModal" class="px-4 py-2 border rounded">
                                        Cancelar
                                    </button>
                                    <button @click="saveTask" class="px-4 py-2 bg-blue-500 text-white rounded">
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </template>

                        <template v-if="currentModal === 'ordering'">
                            <div class="space-y-4">
                                <div class="space-y-2">
                                    <div v-for="(item, index) in tempTaskData.items" :key="index" 
                                        class="flex items-center gap-2 p-2 bg-white rounded-lg border">
                                        <span class="text-gray-500 min-w-[2rem]">{{ index + 1 }}.</span>
                                        <input 
                                            type="text" 
                                            v-model="item.description" 
                                            placeholder="Descripción del elemento"
                                            class="flex-1 rounded-md border-gray-300 shadow-sm"
                                        >
                                        <button @click="removeOrderingItem(index)" 
                                            class="text-red-500 hover:text-red-700 px-2">
                                            ×
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    @click="addOrderingItem" 
                                    class="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                                >
                                    + Agregar elemento
                                </button>
                                
                                <div class="mt-4 flex justify-end gap-2">
                                    <button @click="closeChildModal" class="px-4 py-2 border rounded">
                                        Cancelar
                                    </button>
                                    <button 
                                        @click="saveTask" 
                                        class="px-4 py-2 bg-blue-500 text-white rounded"
                                        :disabled="!isOrderingTaskValid"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </template>

                        <template v-if="currentModal === 'categories'">
                            <div class="space-y-4">
                                <div v-for="(category, categoryIndex) in tempTaskData.categories" :key="categoryIndex" 
                                    class="p-4 border rounded-lg space-y-4">
                                    <div class="flex justify-between items-center">
                                        <input 
                                            type="text" 
                                            v-model="category.name" 
                                            placeholder="Nombre de la categoría"
                                            class="flex-1 rounded-md border-gray-300 shadow-sm mr-2"
                                        >
                                        <button @click="removeCategory(categoryIndex)" 
                                            class="text-red-500 hover:text-red-700">
                                            ×
                                        </button>
                                    </div>

                                    <div class="pl-4 space-y-2">
                                        <div v-for="(item, itemIndex) in category.items" :key="itemIndex" 
                                            class="flex items-center gap-2">
                                            <input 
                                                type="text" 
                                                v-model="category.items[itemIndex]" 
                                                placeholder="Elemento de la categoría"
                                                class="flex-1 rounded-md border-gray-300 shadow-sm"
                                            >
                                            <button @click="removeCategoryItem(categoryIndex, itemIndex)" 
                                                class="text-red-500 hover:text-red-700">
                                                ×
                                            </button>
                                        </div>
                                        <button 
                                            @click="addCategoryItem(categoryIndex)" 
                                            class="text-blue-500 hover:text-blue-700 text-sm">
                                            + Agregar elemento
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    @click="addCategory" 
                                    class="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors">
                                    + Agregar categoría
                                </button>

                                <div class="mt-4 flex justify-end gap-2">
                                    <button @click="closeChildModal" class="px-4 py-2 border rounded">
                                        Cancelar
                                    </button>
                                    <button 
                                        @click="saveTask" 
                                        class="px-4 py-2 bg-blue-500 text-white rounded"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </template>

                        <template v-if="currentModal === 'fillGaps'">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Texto con espacios</label>
                                    <textarea 
                                        v-model="tempTaskData.text_with_gaps" 
                                        placeholder="Usa [palabra] para indicar espacios. Ejemplo: El [gato] es [negro]"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-32"
                                    ></textarea>
                                </div>

                                <div class="mt-4 flex justify-end gap-2">
                                    <button @click="closeChildModal" class="px-4 py-2 border rounded">
                                        Cancelar
                                    </button>
                                    <button @click="saveTask" class="px-4 py-2 bg-blue-500 text-white rounded">
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>

                <div class="mt-6 flex justify-end">
                    <button @click="submitForm" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useModal } from '~/composables/useModal';

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
    type: '',
    question: '',
    answers: [] as any[],
    questions: [] as any[], // Para true/false
    items: [] as Array<{
        id: number,
        description: string,
        order: number
    }>,
    categories: [] as Array<{
        name: string,
        items: Array<{
            text: string
        }>
    }>,
    text_with_gaps: '',
    keywords: [] as string[]
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
    savedTasks.value = [...formData.value.tasks];
    
    formData.value.tasks = [];
    closeModal();
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
        type,
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
        case 'trueFalse':
            taskToSave = {
                type: 'trueFalse',
                questions: [...tempTaskData.value.questions]
            };
            break;
        case 'multipleChoice':
            taskToSave = {
                type: 'multipleChoice',
                question: tempTaskData.value.question,
                answers: tempTaskData.value.answers
            };
            break;

        case 'categories':
            taskToSave = {
                type: 'categories',
                categories: tempTaskData.value.categories
            };
            break;

        case 'ordering':
            taskToSave = {
                type: 'ordering',
                items: tempTaskData.value.items
            };
            break;

        case 'fillGaps':
            const matches = tempTaskData.value.text_with_gaps.match(/\[(.*?)\]/g) || [];
            const keywords = matches.map(match => match.replace(/[\[\]]/g, ''));
            
            taskToSave = {
                type: 'fillGaps',
                text_with_gaps: tempTaskData.value.text_with_gaps,
                keywords: keywords
            };
            break;
    }

    if (taskToSave) {
        console.log('Tarea a guardar:', taskToSave); // Para debugging
        formData.value.tasks.push(taskToSave);
    }

    // Limpiar datos temporales
    tempTaskData.value = {
        type: '',
        question: '',
        answers: [],
        questions: [],
        items: [],
        categories: [],
        items: [],
        text_with_gaps: ''
    };
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
</script>