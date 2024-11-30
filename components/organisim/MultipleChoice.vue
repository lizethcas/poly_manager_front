<template>
    <!-- Iteramos sobre las preguntas -->
    <div v-for="(question, qIndex) in questions" :key="qIndex" class="border-b border-gray-500 pb-4">
        <div class="mt-4">
            <h3 class="text-tarawera-700 font-bold">Question {{ qIndex + 1 }}</h3>
            <div class="flex items-center gap-2 p-2">
                <Icon name="mingcute:dots-fill" size="24" class="text-gray-500" />
                <UInput v-model="question.question" type="text" size="xs" class="w-full mt-1" />
                <div class="bg-gray-200 rounded-md p-1 flex items-center justify-center">
                    <Icon name="material-symbols:close" size="18" class="text-gray-500 cursor-pointer"
                        @click="removeQuestion(qIndex)" />
                </div>
            </div>

            <div class="flex justify-end w-full">
                <div class="w-[95%] items-end">
                    <h3 class="text-fuscous-400 font-bold">Answer options:</h3>
                    <!-- Iteramos sobre las opciones de cada pregunta -->
                    <div v-for="(option, oIndex) in question.options" :key="oIndex" class="flex items-center gap-2 p-2">
                        <Icon name="mingcute:dots-fill" size="24" class="text-gray-500" />
                        <input type="checkbox" :id="`checkbox-${qIndex}-${oIndex}`" v-model="option.isCorrect"
                            class="hidden peer" />
                        <label :for="`checkbox-${qIndex}-${oIndex}`"
                            class="w-6 h-6 border-2 border-gray-300 rounded cursor-pointer peer-checked:bg-tarawera-700 peer-checked:border-tarawera-700 flex justify-center items-center">
                            <span class="peer-checked:block">
                                <Icon name="mingcute:check-2-fill" size="24" class="text-white flex items-center" />
                            </span>
                        </label>
                        <UInput v-model="option.answer" type="text" size="xs" class="w-full" />
                        <div class="bg-gray-200 rounded-md p-1 flex items-center justify-center">
                            <Icon name="material-symbols:close" size="18" class="text-gray-500 cursor-pointer"
                                @click="removeOption(qIndex, oIndex)" />
                        </div>
                    </div>
                    <button class="bg-tarawera-700 text-white text-xs rounded-md w-fit px-2 py-1 mt-2"
                        @click="addOption(qIndex)">Add option</button>
                </div>
            </div>
        </div>
    </div>
    <button class=" text-xs rounded-md w-fit px-2 py-1 mt-2" @click="addQuestion">Add question</button>


</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

let id = 1
interface Option {
    answer: string
    isCorrect: boolean
    id: number
}

interface Question {
    question: string

    options: Option[]
}

const questions = ref<Question[]>([{
    question: '',


    options: [{
        answer: '',
        isCorrect: false,
        id: id++
    }]
}])

const addOption = (questionIndex: number) => {
    questions.value[questionIndex].options.push({
        answer: '',
        isCorrect: false,
        id: id++
    })
}

const addQuestion = () => {
    questions.value.push({
        question: '',
        options: [{
            answer: '',
            isCorrect: false,
            id: id++
        }]
    })
}

console.log(toRaw(questions.value))
const removeOption = (questionIndex: number, optionIndex: number) => {
    questions.value[questionIndex].options.splice(optionIndex, 1)
}

const removeQuestion = (questionIndex: number) => {
    questions.value.splice(questionIndex, 1)
}
</script>