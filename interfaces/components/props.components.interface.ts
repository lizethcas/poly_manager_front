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
  statement?: string;
  indice?: number;
  isCorrect?: boolean | string | null;
}

export interface Question {

  question: string;
  answers: Option[];

  statement?: string;
  typeTask?: string;
  text?: string;
   stated?: string;
}

export interface InputTaskProps {
  answer: string;
  isCorrect: boolean | string;
  removeOption: (qIndex: number, oIndex: number) => void;
  qIndex: number;
  oIndex: number;
  type?: "checkbox" | "input" | "select" | "file";
}

export interface Extra {
  subtitle: string;
  description: string;
}

export interface Example {
  description: string;
  example: string;
}

export interface MultipleTasksProps {
  typeTask:
    | "multiple_choice"
    | "true_false"
    | "category"
    | "sorting"
    | "ordering"
    | "fill_gaps"
    | "word_bank";
  titleTask?: string;
  subtitleTask?: string;
  description?: {
    description: string[];
    instructions?: string;
    extra?: Extra;
    example?: Example;
  };
  inputTitleTask?: boolean;
}
