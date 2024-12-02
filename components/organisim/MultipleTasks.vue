<!-- Este componente se encarga de renderizar las preguntas y opciones de un tipo de tarea multiple -->
<template>
    <!-- Iteramos sobre las preguntas -->
    <div v-for="(question, qIndex) in questions" :key="qIndex" class="border-b border-gray-500 pb-4">
        <div class="mt-4">
            <div v-if="titleTask">
                <h3 class="text-tarawera-700 font-bold">{{ titleTask }} {{ qIndex + 1 }}</h3>
                <div class="flex items-center gap-2 p-2">
                    <Icon name="mingcute:dots-fill" size="24" class="text-gray-500" />
                    <UInput v-model="question.question" type="text" size="xs" class="w-full mt-1" />
                    <div class="bg-gray-200 rounded-md p-1 flex items-center justify-center">
                        <Icon name="material-symbols:close" size="18" class="text-gray-500 cursor-pointer"
                            @click="removeQuestion(qIndex)" />
                    </div>
                </div>
            </div>
            <!-- Este div se encarga de renderizar las opciones de cada pregunta -->
            <div class="flex justify-end w-full">   
                <div class="w-[95%] items-end">
                    <h3 class="text-fuscous-gray-600 font-bold text-sm">{{ subtitleTask }}</h3>
                    <!-- Iteramos sobre las opciones de cada pregunta -->
                    <!-- El componente InputTask se encarga de renderizar cada opción de la pregunta, puede ser de tipo checkbox, select o text -->
                    <InputTask v-for="(option, oIndex) in question.options" :key="`${qIndex}-${oIndex}`"
                        :qIndex="qIndex" :oIndex="oIndex" :isCorrect="option.isCorrect" :answer="option.answer"
                        :removeOption="removeOption" :type="getType(typeTask)" :typeTask="typeTask"
                        @update:isCorrect="(val) => updateOptionIsCorrect(qIndex, oIndex, val)"
                        @update:answer="(val) => updateOptionAnswer(qIndex, oIndex, val)" />
                  

                    <button class="bg-tarawera-700 text-white text-xs rounded-md w-fit px-2 py-1 mt-2"
                        @click="addOption(qIndex)">Add option</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Este botón se encarga de agregar una nueva pregunta -->
    <button v-if="titleTask" class=" text-xs rounded-md w-fit px-2 py-1 mt-2" @click="addQuestion">Add question</button>


</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import InputTask from '../molecule/InputTask.vue';
import { useRemove } from '~/composables/useRemove';
import { useGetTypeTask } from '~/composables/useGetTypeTask';
import type { Question, MultipleTasksProps } from '~/interfaces/components/props.components.interface';

const { typeTask, titleTask, subtitleTask } = defineProps<MultipleTasksProps>()

const questions = ref<Question[]>([{
    question: '',
    options: [{
        answer: '',
        isCorrect: false,

    }]
}])

const { removeOption, removeQuestion } = useRemove(questions);
const { getType } = useGetTypeTask();

// Este método se encarga de agregar una nueva opción a una pregunta
const addOption = (questionIndex: number) => {
    questions.value[questionIndex].options.push({
        answer: '',
        isCorrect: false,

    })
}

// Este método se encarga de agregar una nueva pregunta
const addQuestion = () => {
    questions.value.push({
        question: '',
        options: [{
            answer: '',
            isCorrect: false,

        }]
    })
}

// Este método se encarga de actualizar la respuesta de una opción
const updateOptionAnswer = (questionIndex: number, optionIndex: number, value: string) => {
    questions.value[questionIndex].options[optionIndex].answer = value;
}

// Este método se encarga de actualizar si una opción es correcta o no
const updateOptionIsCorrect = (questionIndex: number, optionIndex: number, value: boolean) => {
    questions.value[questionIndex].options[optionIndex].isCorrect = value;
}

// Add watch to monitor questions changes
watch(
    questions,
    (newValue) => {
        console.log(typeTask, JSON.stringify(newValue, null, 2))
    },
    { deep: true }
)
</script>