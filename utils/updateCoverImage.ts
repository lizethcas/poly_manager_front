
import type { CourseForm } from '~/interfaces/modal.interface';
export const updateCoverImage = (imageFile: File, formData: CourseForm) => {
    // Crear nuevo archivo con nombre sin espacios
    const newFileName = imageFile.name.replace(/\s+/g, '_');
    const newFile = new File([imageFile], newFileName, { type: imageFile.type });
    formData.cover = newFile;

    return { newFile, newFileName, formData };
};