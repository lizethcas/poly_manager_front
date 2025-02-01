export interface ModalProps {
  title: string;
  showExtraElements?: boolean;
  initialData?: {
    course_name: string;
    description: string;
    category: string;
    level: string;
    cover?: string;
    bullet_points: string[];
  };
  actionType?: 'create' | 'edit' | 'delete';
  options?: string[];
  deleteAction?: boolean;
}

export interface FormDataModal {
  [key: string]: string;
}

export interface CourseForm {
  course_name: string;
  description: string;
  cover: File | string | null;
  bullet_points: string[];
  category: string;
  level: string;
  id: number;
  image?: File | null;
}
