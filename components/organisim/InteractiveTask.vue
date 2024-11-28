<template>
    <div class="flex flex-nowrap w-full items-center justify-center gap-2">
        <div v-for="task in interactiveTaskData" 
             :key="task.alt"
             class="flex items-center justify-between p-2 max-w-[13%] w-full shrink-0 bg-fuscous-gray-100 rounded-lg cursor-pointer hover:scale-105 transition-all duration-300">
            <img :src="task.image" :alt="task.alt" class="w-10 h-8" />
            <p class="text-[0.6rem] text-center w-10">{{ task.title }}</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import multipleChoice from '../../assets/images/multiple_choice.webp'
import fillInTheGaps from '../../assets/images/Fillin_gaps.webp'
import trueOrFalse from '../../assets/images/true_false.webp'
import putInOrder from '../../assets/images/put_order.webp'
import sorting from '../../assets/images/sorting.webp'
import category from '../../assets/images/category.webp'
import dragTheWords from '../../assets/images/drag_words.webp'

 


interface Props {
    image: string;
    alt: string;
    title: string;
}

const props = defineProps<Props>();

const interactiveTaskData = ref<Props[]>([
    {
        image: multipleChoice,
        alt: 'multiple choice',
        title: 'Multiple choice',
    },
    {
        image: fillInTheGaps,
        alt: 'fill in the gaps',
        title: 'Fill in the gaps',
    }, 
    {
        image: dragTheWords,
        alt: 'drag the words in the correct place    ',
        title: 'Drag the words',
    }, 
 
    {
        image: trueOrFalse,
        alt: 'true false',
        title: 'True or false',
    },
    {
        image: putInOrder,
        alt: 'put in order',
        title: 'Put in order',
    },
    {
        image: sorting,
        alt: 'sorting',
        title: 'Sorting',
    },
    {
        image: category,
        alt: 'category',
        title: 'Category',
    },
]); 

</script>
