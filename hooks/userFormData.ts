// useFormData.ts (hook personalizado)
import { ref } from "vue";

export function useFormData() {
  const bulletPoints = ref<string[]>([]);
  const formData = ref<Record<string, any>>({ bulletPoints: [] });

  const handleEmit = () => {
    bulletPoints.value.push("");
  };

  const handleEmitSave = () => {
    const updatedBulletPoints = [
      ...formData.value.bulletPoints,
      ...bulletPoints.value,
    ];
    formData.value.bulletPoints = updatedBulletPoints;
    bulletPoints.value = [];
  };

  return { bulletPoints, formData, handleEmit, handleEmitSave };
}
