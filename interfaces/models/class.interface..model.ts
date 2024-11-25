export interface ClassData {
    img_cover: File | null;
    lesson_name: string;
    description: string;
    course_id: number;
    bullet_points: Array<{ text: string }>;
  }