<template>
    <div>
        <nav class="flex justify-start gap-4">
            <ul class="flex gap-4">
                <li>
                    Layout
                </li>
                <li>
                    img
                </li>
                <li>
                    video
                </li>
            </ul>
        </nav>

        <MoleculeInputFile title="title" type="text" />
        <MoleculeInputFile title="Instructions" type="text" />
        <div class="flex gap-4 flex-col w-fit">
            <ButtonAtom type="crop" />
            <ButtonAtom type="swap" />
            <ButtonAtom type="delete" />
        </div>

        <!-- <Icon name="ic:baseline-crop" type="primary" /> -->
        <!-- <UButton icon="i-heroicons-pencil-square" size="sm" color="primary" variant="solid" label="Button"
            :trailing="false" />
 -->
    </div>

</template>
<script setup lang="ts">
import { useModal } from '~/composables/useModal';
import ButtonAtom from '~/components/atomos/ButtonAtom.vue';
const modal = useModal();
const route = useRoute();

</script>
