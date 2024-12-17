import { ref, computed } from "vue";

export interface FormData {
  course_name: string;
  description: string;
  category: string;
  level: string;
  cover: File | null;
  bullet_points: string[];
}

export function useFormData() {
  const bulletPoints = ref<string[]>([]);
  const formState = ref<FormData>({
    course_name: '',
    description: '',
    category: '',
    level: '',
    cover: null,
    bullet_points: []
  });

  const resetForm = () => {
    bulletPoints.value = [];
    formState.value = {
      course_name: '',
      description: '',
      category: '',
      level: '',
      cover: null,
      bullet_points: []
    };
  };

  const handleEmit = () => {
    bulletPoints.value.push('');
  };

  const handleEmitSave = () => {
    return {
      ...formState.value,
      bullet_points: JSON.stringify(bulletPoints.value.filter(point => point.trim() !== ''))
    };
  };

  const updateFormField = (field: string, value: any) => {
    formState.value[field] = value;
  };

  return {
    bulletPoints,
    formData: computed(() => formState.value),
    handleEmit,
    handleEmitSave,
    updateFormField,
    resetForm
  };
}
