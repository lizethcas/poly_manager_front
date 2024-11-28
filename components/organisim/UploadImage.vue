<template>
    <div class="shadow-md shadow-fuscous-gray-300 rounded-lg p-4 flex items-center justify-between">
        <InputFile fileType="image" icon="true" title="Main image:" />
        <div class=" flex flex-col justify-between items-center">
            <AtomosButtonAtom type="crop" />
            <AtomosButtonAtom type="swap" />
            <AtomosButtonAtom type="delete" />
        </div>
    </div>
    <div class="shadow-md shadow-fuscous-gray-300 rounded-lg p-4">
        <div class=" flex items-center justify-between">
            <InputFile fileType="audio" icon="true" title="Auio file:" />
            <div class=" flex flex-col justify-between items-center">

                <AtomosButtonAtom type="swap" />
                <AtomosButtonAtom type="delete" />
            </div>
        </div>
        <slot name="audio" />
    </div>

</template>
<script setup lang="ts">
import InputFile from '~/components/InputFile.vue';
import AtomosButtonAtom from '~/components/atomos/ButtonAtom.vue';
</script>