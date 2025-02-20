import { ref, computed } from "vue";

export interface FormData {
  name: string;
  description: string;
  category: string;
  level: string;
  cover: File | null;
  bullet_points: string[];
  publish: boolean;
}



export function useFormData() {
  const bulletPoints = ref<string[]>([]);
  const formState = ref<FormData>({
    name: '',
    description: '',
    category: '',
    level: '',
    cover: null,
    bullet_points: [],
    publish: false
  });



  const resetForm = () => {
    bulletPoints.value = [];
    formState.value = {
      name: '',
      description: '',
      category: '',
      level: '',
      cover: null,
      bullet_points: [],
      publish: false
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

  const updateFormField = (field: keyof FormData, value: any) => {
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
