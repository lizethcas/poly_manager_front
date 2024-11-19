<template>
    <div class="flex items-center gap-4 mb-4 w-full">
        <label class="min-w-[120px] text-middele-gray">{{ title }}</label>
        <div class="w-5/12 text-fresh-green">
            <USelect v-model="selectedOption" :options="options" />
        </div>
    </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ModalProps } from '~/interfaces/modal.interface';

// Recibiendo 'title' y 'options' directamente desde defineProps()
const { title, options } = defineProps<ModalProps>();

// Usamos ref para manejar el valor seleccionado
const selectedOption = ref(options?.[0] || "");
console.log(selectedOption);

/* watch(selectedOption, (newValue) => {
  console.log("Opción seleccionada:", newValue);
});
 */
watch(
    () => options,
    (newOptions) => {
        selectedOption.value = newOptions?.[0] || ""; // Actualiza con la primera opción
    },
    { immediate: true } // Ejecuta la lógica de inmediato
);

</script>
