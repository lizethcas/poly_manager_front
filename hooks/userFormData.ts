import { ref, toRaw, computed } from "vue";
import { useCourseStore } from '~/stores/courseStore';

export function useFormData() {
  const courseStore = useCourseStore();
  const bulletPoints = ref<string[]>([]);

  const handleEmit = () => {
    bulletPoints.value.push('');
  };

  const handleEmitSave = () => {
    return {
      ...courseStore.currentForm,
      bullet_points: bulletPoints.value.filter(point => point.trim() !== '')
    };
  };

  const updateFormField = (field: string, value: any) => {
    courseStore.updateCurrentForm({ [field]: value });
  };

  return {
    bulletPoints,
    formData: computed(() => courseStore.currentForm),
    handleEmit,
    handleEmitSave,
    updateFormField
  };
}
