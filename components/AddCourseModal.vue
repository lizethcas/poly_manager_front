<!-- Componente principal -->
<template>
    <div class="p-7 max-w-5xl m-auto w-full bg-white rounded-lg">
        <div class="flex justify-between">
            <h2 class="font-bold text-m">{{ title }}</h2>
            <img src="../assets/images/close.webp" alt="close create course" class="w-5 h-5 cursor-pointer"
                @click="closeModal">
        </div>

        <form @submit.prevent @click.stop>
            <div>
                <InputFile />
                <div v-for="(item, index) in labels" :key="'label-' + index">
                    <MoleculeBaseInput :title="item.label_name" :type="item.type" v-model="formData[item.label_name]" />
                    <div v-if="showExtraElements && index === 1">
                        <div class="flex gap-4">
                            <div v-for="(categoryOrLevel, index) in combinedOptions" :key="index" class="flex-1">
                                <SelectAtom :options="categoryOrLevel.options" :title="categoryOrLevel.title" />
                            </div>
                        </div>
                    </div>
                </div>

                <div v-for="(point, index) in bulletPoints" :key="index" class="flex items-center gap-4 mb-4">
                    <div for="" class="min-w-[120px]"></div>
                    <UInput type="text" size="xl" class="w-full" v-model="bulletPoints[index]" />
                </div>

                <BulletPoint @addBulletPoint="handleEmit" />
            </div>

            <div class="flex justify-center gap-4 mt-6">
                <div class="min-w-[120px]"></div>
                <MoleculeButtonGroup @handleSave="handleEmitSave" @handleCancel="closeModal" />
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import BulletPoint from './molecule/BulletPoint.vue';
import { createCourse, labels } from '~/data/cardModal';
import type { ModalProps } from '~/interfaces/modal.interface';
import SelectAtom from './molecule/SelectAtom.vue';
import { useFormData } from '~/hooks/userFormData';

const { bulletPoints, formData, handleEmit, handleEmitSave } = useFormData();
const { title, showExtraElements } = defineProps<ModalProps>();

const combinedOptions = [
    { options: createCourse.categorys, title: createCourse.label_select[0] },
    { options: createCourse.levels, title: createCourse.label_select[1] }
];

const emits = defineEmits(["closeModal"]);

const closeModal = () => {
    emits("closeModal");
};



</script>