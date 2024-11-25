import type { CourseForm } from '~/interfaces/modal.interface';
import { useCourseStore } from '@/stores/courseStore';

export const findItem = (courseId: string, item: CourseForm[]) => {
    const courseStore = useCourseStore();
    return courseStore.courses.find((course: CourseForm) => course.id === Number(courseId));
}


