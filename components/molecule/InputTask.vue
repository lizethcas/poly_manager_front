<template>

    <div class="flex items-center gap-2 p-2">
        <Icon name="mingcute:dots-fill" size="24" class="text-gray-500" />
        <input v-if="type === 'checkbox'" type="checkbox" :id="`checkbox-${qIndex}-${oIndex}`" v-model="localIsCorrect"
            class="hidden peer" />
            
        <label v-if="type === 'checkbox'" :for="`checkbox-${qIndex}-${oIndex}`"
            class="w-6 h-6 border-2 border-gray-300 rounded cursor-pointer peer-checked:bg-tarawera-700 peer-checked:border-tarawera-700 flex justify-center items-center">
            <span class="peer-checked:block">
                <Icon name="mingcute:check-2-fill" size="24" class="text-white flex items-center" />
            </span>
        </label>

        <SelectAtom v-if="type === 'select'" :title="'Answer'" :options="['True', 'False', 'Not stated']"
            :label="true" v-model="localIsCorrect" />

        <UInput :model-value="answer" @update:model-value="(val) => emit('update:answer', val)" type="text" size="xs"
            class="w-full" :disabled="false" />

        <InputFile v-if="type === 'file'" fileType="image" icon="true" title="Image file:" />
        <IconMolecule :name="IconType.close" :size="18" @click="removeOption(qIndex, oIndex)" />
    </div>
</template>

<script setup lang="ts">
import IconMolecule from '~/components/atomos/Icon.vue';
import SelectAtom from '~/components/molecule/SelectAtom.vue';
import { IconType } from '~/data/iconsType';
import { ref, watch } from 'vue';
import type { InputTaskProps } from '~/interfaces/components/props.components.interface';

const { answer, isCorrect, removeOption, qIndex, oIndex, type } = defineProps<InputTaskProps>();

const emit = defineEmits(['update:answer', 'update:isCorrect']);

const localIsCorrect = ref<boolean | string>(isCorrect ?? false);

watch(localIsCorrect, (newValue) => {
    console.log('Selected option:', newValue);
    emit('update:isCorrect', newValue);
});

</script>