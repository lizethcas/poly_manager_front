import multipleChoice from '../assets/images/multiple_choice.webp'
import fillInTheGaps from '../assets/images/Fillin_gaps.webp'
import trueOrFalse from '../assets/images/true_false.webp'
import putInOrder from '../assets/images/put_order.webp'
import sorting from '../assets/images/sorting.webp'
import category from '../assets/images/category.webp'
import dragTheWords from '../assets/images/drag_words.webp'
import type { PropsInteractiveTask } from '~/interfaces/components/props.components.interface';

export const interactiveTaskData: PropsInteractiveTask[] = [
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
]