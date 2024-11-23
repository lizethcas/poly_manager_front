export interface ModalProps {
  title: string;
  showExtraElements?: boolean;
  options?: string[];
}

export interface FormDataModal {
  [key: string]: string;
}

export interface CourseForm {
  course_name: string;
  description: string;
  cover: File | string;
  bullet_points: string[];
  category: string;
  level: string;
  id: number;
  image?: File | null;
}
