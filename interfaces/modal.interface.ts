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
  cover: string | null;
  bullet_points: string[];
  category: string;
  level: string;
  id: string;
}
