import type { CourseForm } from '~/interfaces/modal.interface';

export const updateCoverImage = (imageFile: File, formData: CourseForm) => {
    const imageUrl = URL.createObjectURL(imageFile);
    formData.cover = imageUrl; // Esto asegura que cover sea una URL
};