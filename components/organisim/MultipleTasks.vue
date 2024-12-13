<template>

    <div v-if="infoResponseApi.isLoading"
        class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <p class="text-title-color text-2xl">Guardando...</p>
    </div>
    <!-- Iteramos sobre las preguntas -->

    <TextAreaTask v-if="typeTask === 'text_area'" :value="value" :description="description" />

    <div v-else v-for="(question, qIndex) in questions" :key="qIndex" class="border-b border-gray-500 pb-4"
        :draggable="true" @dragstart="onDragStart($event, qIndex)" @dragover="onDragOver"
        @drop="onDrop($event, qIndex)">
        <div class="mt-4">
            <div v-if="titleTask">
                <h3 class="text-tarawera-700 font-bold">{{ titleTask }} {{ qIndex + 1 }}</h3>
                <div class="flex items-center gap-2 p-2">
                    <Icon name="mingcute:dots-fill" size="24" class="text-gray-500 cursor-grab" />
                    <UInput v-model="question.question" type="text" size="xs" class="w-full mt-1" />
                    <div class="bg-gray-200 rounded-md p-1 flex items-center justify-center">
                        <Icon name="material-symbols:close" size="18" class="text-gray-500 cursor-pointer"
                            @click="removeQuestion(qIndex)" />
                    </div>
                </div>
            </div>

            <!-- Renderiza las opciones de cada pregunta -->
            <div class="flex justify-end w-full">
                <div class="w-[95%] items-end">
                    <h3 class="text-fuscous-gray-600 font-bold text-sm">{{ subtitleTask }}</h3>
                    <!-- Componente InputTask renderiza las opciones -->
                    <InputTask v-for="(option, oIndex) in question.answers" :key="`${qIndex}-${oIndex}`"
                        :qIndex="qIndex" :oIndex="oIndex" :isCorrect="option.isCorrect" :answer="option.text"
                        :removeOption="(qIndex, oIndex) => removeOption(qIndex, oIndex)" :type="getType(typeTask)"
                        :typeTask="typeTask" @update:isCorrect="(val) => updateOptionIsCorrect(qIndex, oIndex, val)"
                        @update:answer="(val) => updateOptionAnswer(qIndex, oIndex, val)" />

                    <button
                        class="bg-fuscous-gray-100  text-fuscous-gray-600 text-xs rounded-md flex items-center gap-2 px-2 py-1 mt-2"
                        @click="addOption(qIndex)">
                        <Icon name="icon-park-solid:add" size="14" class="bg-fuscous-gray-500 " />
                        Add option
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Este botón se encarga de agregar una nueva pregunta -->
    <UTooltip :text="isActive ? '' : 'all questions and answers are required'" :ui="{
        container: ' text-fuscous-gray-600 text-xs rounded-md flex items-center gap-2 px-2 py-1 mt-2',
    }">
        <button v-if="titleTask" :class="{
            'bg-fuscous-gray-100  text-fuscous-gray-600 text-xs rounded-md flex items-center gap-2 px-2 py-1 mt-2': true,
            'bg-fuscous-gray-100 text-fuscous-gray-600': isActive,
            'bg-fuscous-gray-100 text-fuscous-gray-200 cursor-not-allowed': !isActive
        }" @click="addQuestion" :disabled="!isActive">
            <Icon :disabled="!isActive" name="icon-park-solid:add" size="14" class="bg-fuscous-gray-500 " />Add
            question
        </button>
    </UTooltip>


    <div class="flex items-center gap-2 py-4 text-sm">
        <p>Include the stats</p>
        <AtomosToggle v-model="data.stats" />
    </div>
    <MoleculeActionButtons @handleSave="handleSave()" @handleCancel="handleCancel"
        :isActive="infoResponseApi.isActive" />


</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import EventBus from '~/composables/useEvenBus';
/* Components */
import InputTask from '../molecule/InputTask.vue';
import TextAreaTask from '../molecule/TextAreaTask.vue';
/* Composables */
import { useRemove } from '~/composables/useRemove';
import { useGetTypeTask } from '~/composables/useGetTypeTask';
import { useDragAnDrop } from '~/composables/useDragAndDrop';
import { useTaskStore } from '~/stores/task.store';
import { useMutation } from '@tanstack/vue-query';
import { apiRoutes } from '~/services/routes.api';
import axiosInstance from '~/services/axios.config';

/* Interfaces */
import type { Question, MultipleTasksProps } from '~/interfaces/components/props.components.interface';

// Definir los eventos que emitirá el componente
const emit = defineEmits(['update:value', 'save-task']);
const { typeTask, titleTask, subtitleTask, description } = defineProps<MultipleTasksProps>();
const taskStore = useTaskStore();
const route = useRoute();
const taskInstructions = computed(() => taskStore.getTask('instructions'));
const files = computed(() => taskStore.getTask('files'));
const select = computed(() => taskStore.getTask('select'));
const value = ref('');
const isActive = ref(false);
const task = ref(typeTask);

const infoResponseApi = ref({
    isActive: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,
});

const questions = ref<Question[]>([{
    question: '',
    answers: [
        {
            text: '',
            isCorrect: false,
        },
    ],
    typeTask: titleTask,

}]);


const { removeOption, removeQuestion } = useRemove(questions);
const { getType } = useGetTypeTask();
const { onDragStart, onDragOver, onDrop } = useDragAnDrop(questions);

// Add these refs to store the instructions data
const data = ref({
    class_id: route.params.classId,
    tittle: '',
    instructions: '',
    cover: null as File | null,
    audio: null as File | null,
    script: '',
    question: [] as Question[],
    stats: false,

});

watch(files, (newValue) => {
    data.value.cover = newValue.image;
    data.value.audio = newValue.audio;
}, { deep: true });

watch(taskInstructions, (newValue) => {
    if (newValue) {
        Object.assign(data.value, {
            tittle: newValue.title || '',
            instructions: newValue.instructions || ''
        });
    }
}, { deep: true });

watch(data, (newValue) => {
    console.log('newValue', newValue);
}, { deep: true });


watch(questions, (newValue) => {
    isActive.value = hasQuestionsWithAnswers();
    infoResponseApi.value.isActive = hasQuestionsWithAnswers();
    data.value.question = newValue;
}, { deep: true });

watch(() => typeTask, (newValue) => {
    console.log('typeTask changed:', newValue);
    task.value = newValue;
}, { immediate: true });


// Este método se encarga de agregar una nueva opción a una pregunta
const addOption = (questionIndex: number) => {
    questions.value[questionIndex].answers.push({
        text: '',
        isCorrect: false,
    });
};

// Este método se encarga de agregar una nueva pregunta

const addQuestion = () => {

    questions.value.push({
        question: '',
        answers: [{
            text: '',
            isCorrect: '',
        }],

        typeTask: typeTask,
    });
};

// Este método se encarga de actualizar la respuesta de una opción
const updateOptionAnswer = (questionIndex: number, optionIndex: number, value: string) => {
    questions.value[questionIndex].answers[optionIndex].text = value;
};

// Este método se encarga de actualizar si una opción es correcta o no
const updateOptionIsCorrect = (questionIndex: number, optionIndex: number, value: boolean) => {
    questions.value[questionIndex].answers[optionIndex].isCorrect = value;
};

// Nueva función para evaluar si el formulario tiene información
const hasQuestionsWithAnswers = () => {

    return questions.value.every(question => {
        if (typeTask === 'true_false') {
            return question.answers.every(answer => answer.text.trim() !== '');
        }
        // Verifica que la pregunta no esté vacía
        if (question.question.trim() === '') return false;

        // Verifica que todas las respuestas tengan texto
        return question.answers.every(answer => answer.text.trim() !== '');
    });
};

// Observa los cambios en las preguntas para actualizar el estado de isActive
const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
        infoResponseApi.value.isLoading = true;
        const response = await axiosInstance.post(apiRoutes.orderingtasks, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        infoResponseApi.value.isLoading = false;
        return response.data;
    },
    onSuccess: (data) => {
        console.log('Response from API:', data);
        infoResponseApi.value.isSuccess = true;
        taskStore.addTask('modal', { modal: false });
    },
    onError: (error) => {
        console.error('Error saving data:', error);
        infoResponseApi.value.isError = true;
        infoResponseApi.value.isLoading = false;
    },
});


const handleSave = () => {
    if (task.value) {
        try {
            const formData = new FormData();
            // Handle video file
            if (data.value.cover instanceof File) {
                const newFileName = data.value.cover.name.replace(/\s+/g, '_');
                const newImageFile = new File([data.value.cover], newFileName, {
                    type: data.value.cover.type
                });
                formData.append('cover', newImageFile);
            } else {
                console.error('cover is not a File object');
            }

            // Handle background image
            if (data.value.audio instanceof File) {
                const newFileName = data.value.audio.name.replace(/\s+/g, '_');
                const newImageFile = new File([data.value.audio], newFileName, {
                    type: data.value.audio.type
                });
                formData.append('audio', newImageFile);
            }

            // Append other data
            formData.append('script', data.value.script);
            formData.append('title', data.value.tittle);
            formData.append('instructions', data.value.instructions);
            formData.append('class_id', String(data.value.class_id));
            formData.append('question', JSON.stringify(data.value.question));
            formData.append('stats', String(data.value.stats));

            console.log('Form data:', data.value);
            // Trigger the mutation
            mutation.mutate(formData);

        } catch (error) {
            console.error('Error saving multimedia block:', error);
            throw error;
        }
    }

}
const handleCancel = () => {
    taskStore.addTask('modal', { modal: false });

}


</script>
