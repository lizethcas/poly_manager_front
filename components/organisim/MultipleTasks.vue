<template>
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
        <!--    <button :class="{
            'text-xs rounded-md px-2 py-1 mt-2 mx-1 max-w-32': true,
            'bg-tarawera-700 hover:bg-primary-color text-white ': isActive,
            'bg-fuscous-gray-200 text-fuscous-gray-300 cursor-not-allowed': !isActive
        }" @click="saveTask" :disabled="!isActive">
            Save
        </button> -->
    </UTooltip>
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
/* Interfaces */
import type { Question, MultipleTasksProps } from '~/interfaces/components/props.components.interface';

// Definir los eventos que emitirá el componente
const emit = defineEmits(['update:value', 'save-task']);
const { typeTask, titleTask, subtitleTask, description } = defineProps<MultipleTasksProps>();

const value = ref('');
const isActive = ref(false);
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
            isCorrect: false,
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

/* const saveTask = () => {
    const value = JSON.stringify(questions.value, null, 2);

    tasksStore.saveTask(value);

}; */

// Nueva función para evaluar si el formulario tiene información
const hasQuestionsWithAnswers = () => {
    return questions.value.every(question => {
        // Verifica que la pregunta no esté vacía
        if (question.question.trim() === '') return false;

        // Verifica que todas las respuestas tengan texto
        return question.answers.every(answer => answer.text.trim() !== '');
    });
};

// Observa los cambios en las preguntas para actualizar el estado de isActive
watch(questions, () => {
    isActive.value = hasQuestionsWithAnswers();
}, { deep: true });

// Observa los cambios en las preguntas y actualiza el valor en el store
watch(questions, (newVal, oldVal) => {
    emit('update:value', newVal);

    // Emitir el evento con el objeto questions
    EventBus.emit('questionsUpdated', newVal);
}, { deep: true });
</script>
