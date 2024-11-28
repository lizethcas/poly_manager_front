<template>
    <uploadImage v-model="formData.cover" @file-selected="handleCoverImage">
        <template #audio>
            <MoleculeInputFile type="text_area" title="Add script" size="lg" container-class="py-2" />
        </template>

    </uploadImage>
    <NuxtLayout>
        <OrganisimInteractiveTask class="mt-4" />
    </NuxtLayout>
    
</template>
<script setup lang="ts">
import uploadImage from '~/components/organisim/UploadImage.vue';
import MoleculeInputFile from '~/components/molecule/InputFile.vue';

const formData = ref<{ cover: File | null }>({ cover: null });

const handleCoverImage = (file: File) => {
    formData.value.cover = file;
};

</script>