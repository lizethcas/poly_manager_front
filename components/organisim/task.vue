<template>
    <div v-for="(question, index) in questionsList" :key="index"
        class=" max-w-[60%] w-full border-b border-fuscous-gray-950 pb-4">
        <div v-if="question.title !== ''">
            <div class="flex justify-start gap-2">
                <p class="bg-tarawera-200 text-tarawera-800 px-2 py-1 rounded-md">{{ taskNumber }}.{{ index + 1 }}</p>
                <h3 class="text-lg font-bold">{{ capitalizeFirstLetter(question.title) }}</h3>
            </div>
            <p class="">{{ question.instructions }}</p>
        </div>

        <div v-for="(item, qIndex) in question.questions" :key="qIndex">

            <p class="font-bold">{{ item.question }}</p>

            <div v-for="(answer, aIndex) in item.answers" :key="aIndex"
                :class="{ 'flex justify-start': item.isCorrect, 'bg-tarawera-200': answer.isCorrect }">
                <p>{{ answer.text }}</p>
                <!-- <p v-if="answer.isCorrect">correcto</p> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCapitalizerLetter } from '~/composables/useCapitalizerLetter';



const { capitalizeFirstLetter } = useCapitalizerLetter();

const props = defineProps({
    questions: {
        type: Array,
        required: true,
        default: () => []
    }
});

const taskNumber = ref(1);

// Computed property para acceder a las preguntas
const questionsList = computed(() => {
    console.log('Questions from props:', toRaw(props.questions));
    return props.questions;
});


</script>
