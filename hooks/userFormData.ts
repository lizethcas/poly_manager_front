import { ref, toRaw } from "vue";
import { createCourse } from "~/data/cardModal";

export function useFormData() {
  const bulletPoints = ref<string[]>([]);
  const previewImage = ref<string | null>(null);

  const formData = ref<Record<string, any>>({
    // Basic form fields
    lesson_title: '',
    description: '',
    
    // File/Image data
    cover: null,
    
    // Select options
    selectedOptions: {
      [createCourse.label_select[0]]: createCourse.categorys[0], // category
      [createCourse.label_select[1]]: createCourse.levels[0], // level
    },
    
    // Bullet points array
    bulletPoints: [],
  });

  const handleEmit = () => {
    if (bulletPoints.value[bulletPoints.value.length - 1] !== "") {
      bulletPoints.value.push("");
    }
  };

  const handleEmitSave = () => {
    // Filter out empty bullet points
    const filteredBulletPoints = bulletPoints.value.filter(point => point.trim() !== '');
    
    // Update formData with all bullet points
    formData.value.bulletPoints = [
      ...formData.value.bulletPoints,
      ...filteredBulletPoints
    ];

    // Return the complete form data object
    return toRaw(formData.value);
  };

  const updateFormField = (fieldName: string, value: any) => {
    formData.value[fieldName] = value;
  };

  const updateCoverImage = (imageData: string) => {
    formData.value.cover = imageData;
    previewImage.value = imageData;
  };

  return { 
    bulletPoints, 
    formData, 
    previewImage,
    handleEmit, 
    handleEmitSave,
    updateFormField,
    updateCoverImage
  };
}
