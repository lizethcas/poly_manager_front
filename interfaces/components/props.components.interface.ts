export interface ImgAtomProps {
  image: string;
  alt: string;
}

export interface ButtonAtomProps {
  text?: string;
  type: string;
  size?: string;
  icon?: string;
  defaultLabel?: string;
  isActive?: boolean;
}

export interface PropsInteractiveTask extends ImgAtomProps {
  title: string;
}

export interface Option {
  text: string;
  isCorrect: boolean | string;
}

export interface Question {
  question: string;
  answers: Option[];
  typeTask?: string;
}

export interface InputTaskProps {
  answer: string;
  isCorrect: boolean | string;
  removeOption: (qIndex: number, oIndex: number) => void;
  qIndex: number;
  oIndex: number;
  type?: "checkbox" | "input" | "select" | "file";
}

export interface MultipleTasksProps {
  typeTask:
    | "multiple_choice"
    | "true_false"
    | "category"
    | "sorting"
    | "order"
    | "text_area";
  titleTask?: string;
  subtitleTask?: string;
  description?: string;
}
