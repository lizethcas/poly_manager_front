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
}

export interface PropsInteractiveTask extends ImgAtomProps {
  title: string;
}

export interface Option {
  answer: string;
  isCorrect: boolean;
}

export interface Question {
  question: string;
  options: Option[];
}



export interface InputTaskProps {
  answer: string;
  isCorrect: boolean;
  removeOption: (qIndex: number, oIndex: number) => void;
  qIndex: number;
  oIndex: number;
  type?: 'checkbox' | 'input' | 'select' | 'file';
}

export interface MultipleTasksProps {
  typeTask: 'correctAnswer' | 'truefalse' | 'category' | 'sorting' | 'order';
  titleTask?: string;
  subtitleTask?: string;
}
