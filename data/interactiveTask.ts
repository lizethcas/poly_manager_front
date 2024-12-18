import multipleChoice from "../assets/images/multiple_choice.webp";
import fillInTheGaps from "../assets/images/Fillin_gaps.webp";
import trueOrFalse from "../assets/images/true_false.webp";
import putInOrder from "../assets/images/put_order.webp";
import sorting from "../assets/images/sorting.webp";
import category from "../assets/images/category.webp";
import dragTheWords from "../assets/images/drag_words.webp";
import type { PropsInteractiveTask } from "~/interfaces/components/props.components.interface";

/* export const interactiveTaskData: PropsInteractiveTask[] = [
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
] */
interface TaskOption {
  name: string;
  type: string;
}

export const interactiveTaskOptions: TaskOption[] = [
  {
    name: "Multiple choice",
    type: "multiple_choice",
  },
  {
    name: "True or false",
    type: "true_false",
  },
  {
    name: "Fill in the gaps",
    type: "fill_gaps",
  },
  {
    name: "Word bank",
    type: "word_bank",
  },

  {
    name: "Drop Down Text",
    type: "drop_down_text",
  },

  {
    name: "Put in order",
    type: "ordering",
  },
  {
    name: "Sorting",
    type: "sorting",
  },
  {
    name: "Categories",
    type: "Categories",
  },
  {
    name: "Matching",
    type: "Matching",
  },
  {
    name: "Word Order",
    type: "word_order",
  },
  {
    name: "Picture  Matching",
    type: "picture_matching",
  },
  {
    name: "Picture Labeling  ",
    type: "picture_labeling",
  },
];
