import { ref, toRaw } from "vue";
import { createCourse } from "~/data/cardModal";

export function useFormData() {
  const bulletPoints = ref<string[]>([]);
  const previewImage = ref<string | null>(null);

  const formData = ref<Record<string, any>>({
    lesson_title: '',
    description: '',
    cover: null,
    bullet_points: [],
    selectedOptions: {
      [createCourse.label_select[0]]: createCourse.categorys[0],
      [createCourse.label_select[1]]: createCourse.levels[0],
    }
  });

  const handleEmit = () => {
    if (bulletPoints.value[bulletPoints.value.length - 1] !== "") {
      bulletPoints.value.push("");
    }
  };

  const handleEmitSave = () => {
    const filteredBulletPoints = bulletPoints.value.filter(point => point.trim() !== '');
    
    formData.value.bullet_points = filteredBulletPoints;

    return toRaw(formData.value);
  };

  const updateFormField = (fieldName: string, value: any) => {
    const cleanFieldName = fieldName.replace(/^_+|_+$/g, '');
    formData.value[cleanFieldName] = value;
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
