import type { Ref } from 'vue';
import type { Question } from '~/interfaces/components/props.components.interface';


export const useRemove = (questions: Ref<Question[]>) => {
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = JSON.parse(JSON.stringify(questions.value));
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    questions.value = updatedQuestions;
  };

  const removeQuestion = (questionIndex: number) => {
    questions.value.splice(questionIndex, 1);
  };
  
  return { removeOption, removeQuestion };
};
